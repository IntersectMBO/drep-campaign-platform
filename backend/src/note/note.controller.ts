import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createNoteDto } from 'src/dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get('/all')
  getAllNotes() {
    return this.noteService.getAllNotes();
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
