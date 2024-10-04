import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { createNoteDto } from 'src/dto';
import { NoteService } from './note.service';
import { VoterService } from 'src/voter/voter.service';

@Controller('notes')
export class NoteController {
  constructor(
    private noteService: NoteService,
    private voterService: VoterService,
  ) {}
  @Get('/all')
  async getAllNotes(@Query('stakeKeys') stakeKeys?: any, @Query('currentNoteCursor') currentNote?: number, @Query('request') request?: string) {
    const { stakeKey, stakeKeyBech32 } = stakeKeys || {};

    let delegation = null;

    if (stakeKey) {
      delegation =
        await this.voterService.getAdaHolderCurrentDelegation(stakeKey);
    }

    return this.noteService.getAllNotes(stakeKeyBech32, delegation,currentNote, request);
  }
  @Get('/:id/single')
  getSingleNote(@Param('id') noteId: string) {
    return this.noteService.getSingleNote(noteId);
  }
  @Post('/new')
  addNote(@Body() note: createNoteDto) {
    return this.noteService.registerNote(note);
  }
  @Post('/:id/update')
  updateNote(@Param('id') noteId: string, @Body() note: createNoteDto) {
    return this.noteService.updateNoteInfo(noteId, note);
  }
}
