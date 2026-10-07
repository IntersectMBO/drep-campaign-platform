import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { createNoteDto } from 'src/dto';
import { NoteService, NoteViewer } from './note.service';
import { VoterService } from 'src/voter/voter.service';
import { StakeKeys } from 'src/common/types';

// hex-encoded reward address: one header byte and a 28 byte credential
const STAKE_ADDRESS_HEX = /^[0-9a-fA-F]{58}$/;

@Controller('notes')
export class NoteController {
  constructor(
    private noteService: NoteService,
    private voterService: VoterService,
  ) {}
  @Get('/all')
  async getAllNotes(
    @Query('stakeKeys') stakeKeys?: StakeKeys,
    @Query('currentNoteCursor') currentNote?: number,
    @Query('request') request?: string,
  ) {
    const viewer = await this.getViewer(stakeKeys);
    return this.noteService.getAllNotes(viewer, currentNote, request);
  }
  @Get('/:id/single')
  async getSingleNote(
    @Param('id') noteId: string,
    @Query('stakeKeys') stakeKeys?: StakeKeys,
  ) {
    const viewer = await this.getViewer(stakeKeys);
    return this.noteService.getSingleNote(noteId, viewer);
  }
  @Post('/new')
  addNote(@Body() note: createNoteDto) {
    return this.noteService.registerNote(note);
  }
  @Post('/:id/update')
  updateNote(@Param('id') noteId: string, @Body() note: createNoteDto) {
    return this.noteService.updateNoteInfo(noteId, note);
  }

  /**
   * Resolves who is reading notes. The stake keys are still taken from the
   * query string; this is the single place to switch to a verified session
   * once one is available.
   */
  private async getViewer(stakeKeys?: StakeKeys): Promise<NoteViewer> {
    const { stakeKey, stakeKeyBech32 } = stakeKeys || {};
    const viewer: NoteViewer = {};

    if (typeof stakeKeyBech32 === 'string' && stakeKeyBech32) {
      viewer.stakeKeyBech32 = stakeKeyBech32;
    }
    if (typeof stakeKey === 'string' && STAKE_ADDRESS_HEX.test(stakeKey)) {
      const delegation =
        await this.voterService.getAdaHolderCurrentDelegation(stakeKey);
      if (delegation?.drep_view) {
        viewer.delegatedDRepId = delegation.drep_view;
      }
    }
    return viewer;
  }
}
