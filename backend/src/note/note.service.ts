import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { Delegation } from 'src/common/types';
import { DrepService } from 'src/drep/drep.service';
import { createNoteDto } from 'src/dto';
import { ReactionsService } from 'src/reactions/reactions.service';
import { VoterService } from 'src/voter/voter.service';
import { DataSource } from 'typeorm';
@Injectable()
export class NoteService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    private drepService: DrepService,
    private reactionsService: ReactionsService,
    private commentsService: CommentsService,
    private voterService: VoterService,
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
    const reactions = await this.reactionsService.getReactions(note.id, 'note');
    const comments = await this.commentsService.getComments(note.id, 'note');
    return { ...note, reactions: reactions, comments: comments };
  }
  async registerNote(noteDto: createNoteDto) {
    try {
      const isDRepPresent = await this.drepService.getSingleDrepViaVoterID(
        noteDto.drep,
      );
      const author = await this.voltaireService
        .getRepository('Signature')
        .findOne({ where: { stakeKey: noteDto.stake_addr } });
      if (!author) {
        return new NotFoundException('Author details not found!');
      }
      const modifiedNoteDto = {
        ...noteDto,
        drep: isDRepPresent.drep_id,
        author: author.id,
      };
      const res = await this.voltaireService
        .getRepository('Note')
        .insert(modifiedNoteDto);
      return { noteAdded: res.identifiers[0].id };
    } catch (error) {
      console.log(error);
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
    const isPresent = await this.drepService.getSingleDrepViaVoterID(note.drep);
    if (isPresent) {
      const modifiedNote = { ...note, drep: isPresent.drep_id };
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
      .leftJoinAndSelect('note.drep', 'drep')
      .leftJoin('drep.signatures', 'signature')
      .orderBy('note.createdAt', 'DESC') // Order by createdAt descending
      .limit(20); // limit per req
    // Basic query for notes with visibility 'everyone'
    queryBuilder.where('note.visibility = :everyone', {
      everyone: 'everyone',
    });
    if (currentNote) {
      if (request === 'before') {
        queryBuilder.where('note.id <= :currentNote', {
          currentNote: Number(currentNote),
        });
      } else if (request === 'after') {
        queryBuilder.where('note.id <= :currentNote', {
          currentNote: Number(currentNote) + 20,
        });
      }
    }

    // 'delegators' visibility
    if (delegation) {
      queryBuilder.orWhere(
        'note.visibility = :delegators AND signature.voterId = :drepVoterId',
        {
          delegators: 'delegators',
          drepVoterId: delegation.drep_view,
        },
      );
    }
    // 'myself' visibility
    if (stakeKeyBech32) {
      queryBuilder.orWhere(
        'note.visibility = :myself AND signature.stakeKey = :stakeKeyBech32',
        {
          myself: 'myself',
          stakeKeyBech32: stakeKeyBech32,
        },
      );
    }

    return queryBuilder.getRawMany();
  }
}
