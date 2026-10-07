import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AttachmentService } from 'src/attachment/attachment.service';
import { CommentsService } from 'src/comments/comments.service';
import { DrepService } from 'src/drep/drep.service';
import { createNoteDto } from 'src/dto';
import { ReactionsService } from 'src/reactions/reactions.service';
import { Brackets, DataSource } from 'typeorm';

/**
 * The caller asking for notes. Both fields are optional; an empty viewer only
 * sees notes shared with everyone.
 */
export type NoteViewer = {
  // stake address (bech32) of the caller, matched against the author's stake key
  stakeKeyBech32?: string;
  // DRep id the caller currently delegates to
  delegatedDRepId?: string;
};

/**
 * Visibility condition for notes joined as `note` with the author's
 * signature joined as `signature`:
 * everyone OR (delegators AND the caller delegates to the author)
 * OR (myself AND the caller is the author).
 * The alternatives are grouped in brackets so further filters can be added
 * with `andWhere` without widening the result.
 */
export const noteVisibilityCondition = (viewer: NoteViewer = {}) =>
  new Brackets((qb) => {
    qb.where('note.note_visibility = :visibilityEveryone', {
      visibilityEveryone: 'everyone',
    });
    if (viewer.delegatedDRepId) {
      qb.orWhere(
        '(note.note_visibility = :visibilityDelegators AND signature.drepVoterId = :viewerDelegatedDRepId)',
        {
          visibilityDelegators: 'delegators',
          viewerDelegatedDRepId: viewer.delegatedDRepId,
        },
      );
    }
    if (viewer.stakeKeyBech32) {
      qb.orWhere(
        '(note.note_visibility = :visibilityMyself AND signature.drepStakeKey = :viewerStakeKeyBech32)',
        {
          visibilityMyself: 'myself',
          viewerStakeKeyBech32: viewer.stakeKeyBech32,
        },
      );
    }
  });

@Injectable()
export class NoteService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    private drepService: DrepService,
    private attachmentService: AttachmentService,
    private reactionsService: ReactionsService,
    private commentsService: CommentsService,
  ) {}
  async getAllNotes(
    viewer: NoteViewer = {},
    currentNote?: number,
    request?: string,
  ) {
    let allNotes = await this.getNotesWithVisibility(
      viewer,
      currentNote,
      request,
    );

    // Used Promise.all to ensure all asynchronous operations complete
    allNotes = await Promise.all(
      allNotes.map(async (note) => {
        // Get reactions and comments
        const reactions = await this.reactionsService.getReactions(
          note.note_id,
          'note',
        );
        const comments = await this.commentsService.getComments(
          note.note_id,
          'note',
        );
        // Add reactions and comments to the note
        return { ...note, reactions: reactions, comments: comments };
      }),
    );

    return allNotes;
  }

  async getSingleNote(noteId: string, viewer: NoteViewer = {}) {
    const numifiedNoteId = Number(noteId);
    // A note the viewer may not see is reported as not found
    const note = await this.voltaireService
      .getRepository('Note')
      .createQueryBuilder('note')
      .leftJoin('note.voter', 'drep')
      .leftJoin('drep.signatures', 'signature')
      .where('note.id = :noteId', { noteId: numifiedNoteId })
      .andWhere(noteVisibilityCondition(viewer))
      .getOne();
    if (!note) {
      throw new NotFoundException('Note not found!');
    }
    return note;
  }
  async registerNote(noteDto: createNoteDto) {
    const isPresent = await this.drepService.getSingleDrepViaVoterID(
      noteDto.voter,
    );
    if (isPresent) {
      const modifiedNoteDto = { ...noteDto, voter: isPresent.drep_id };
      const res = await this.voltaireService
        .getRepository('Note')
        .insert(modifiedNoteDto);
      return { noteAdded: res.identifiers[0].id };
    } else {
      return new NotFoundException('DRep associated with note not found!');
    }
  }
  async updateNoteInfo(noteId: string, note: createNoteDto) {
    const numifiedNoteId = Number(noteId);
    const foundNote = await this.voltaireService.getRepository('Note').findOne({
      where: { id: numifiedNoteId },
    });
    if (!foundNote) {
      throw new NotFoundException('Note to be updated not found!');
    }
    const isPresent = await this.drepService.getSingleDrepViaVoterID(
      note.voter,
    );
    if (isPresent) {
      const modifiedNote = { ...note, voter: isPresent.drep_id };
      // Iterate through the properties of the note object
      Object.keys(modifiedNote).forEach((key) => {
        foundNote[key] = modifiedNote[key];
      });
      return await this.voltaireService.getRepository('Note').save(foundNote);
    } else {
      return new NotFoundException('DRep associated with note not found!');
    }
  }

  private async getNotesWithVisibility(
    viewer: NoteViewer,
    currentNote?: number,
    request?: string,
  ) {
    const queryBuilder = this.voltaireService
      .getRepository('Note')
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.voter', 'drep')
      .leftJoin('drep.signatures', 'signature')
      .orderBy('note.createdAt', 'DESC') // Order by createdAt descending
      .limit(20); // limit per req
    // Only notes the viewer may see; the cursor narrows this further
    queryBuilder.where(noteVisibilityCondition(viewer));
    if (currentNote) {
      if (request === 'before') {
        queryBuilder.andWhere('note.id <= :currentNote', {
          currentNote: Number(currentNote),
        });
      } else if (request === 'after') {
        queryBuilder.andWhere('note.id <= :currentNote', {
          currentNote: Number(currentNote) + 20,
        });
      }
    }

    return queryBuilder.getRawMany();
  }
}
