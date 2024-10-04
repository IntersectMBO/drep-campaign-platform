import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AttachmentService } from 'src/attachment/attachment.service';
import { CommentsService } from 'src/comments/comments.service';
import { Delegation, StakeKeys } from 'src/common/types';
import { DrepService } from 'src/drep/drep.service';
import { createNoteDto } from 'src/dto';
import { ReactionsService } from 'src/reactions/reactions.service';
import { DataSource } from 'typeorm';
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
    stakeKeyBech32?: string,
    delegation?: Delegation,
    currentNote?: number,
    request?: string,
  ) {
    let allNotes = await this.getNotesWithVisibility(
      delegation,
      stakeKeyBech32,
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

  async getSingleNote(noteId: string) {
    const numifiedNoteId = Number(noteId);
    const note = await this.voltaireService.getRepository('Note').findOne({
      where: { id: numifiedNoteId },
    });
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
    delegation?,
    stakeKeyBech32?: string,
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
    // Basic query for notes with visibility 'everyone'
    queryBuilder.where('note.note_visibility = :everyone', {
      everyone: 'everyone',
    });
    if (currentNote) {
      if (request === 'before') {
        queryBuilder.where('note.id <= :currentNote', { currentNote: Number(currentNote) });
      } else if (request === 'after') {
        queryBuilder.where('note.id <= :currentNote', {
          currentNote: Number(currentNote) + 20,
        });
      }
    }

    // 'delegators' visibility
    if (delegation) {
      queryBuilder.orWhere(
        'note.note_visibility = :delegators AND signature.drepVoterId = :drepVoterId',
        {
          delegators: 'delegators',
          drepVoterId: delegation.drep_view,
        },
      );
    }
    // 'myself' visibility
    if (stakeKeyBech32) {
      queryBuilder.orWhere(
        'note.note_visibility = :myself AND signature.drepStakeKey = :stakeKeyBech32',
        {
          myself: 'myself',
          stakeKeyBech32: stakeKeyBech32,
        },
      );
    }

    return queryBuilder.getRawMany();
  }
}
