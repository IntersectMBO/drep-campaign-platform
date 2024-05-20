import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { createNoteDto } from 'src/dto';
import { DataSource } from 'typeorm';
@Injectable()
export class NoteService {
  constructor(
   @InjectDataSource('default')
    private voltaireService:DataSource,
  ) {}
  async getAllNotes() {
    return await this.voltaireService.getRepository('Note').find();
  }
  async getSingleNote(noteId: string) {
    const numifiedNoteId = Number(noteId);
    const noteList = await this.voltaireService.getRepository('Note')
    .findOne({
      where: { id: numifiedNoteId },
    });
    if (!noteList) {
      throw new NotFoundException('Note not found!');
    }
    return noteList;
  }
  async registerNote(noteDto: createNoteDto) {
    const isPresent = await this.voltaireService
      .getRepository('Drep')
      .findOneBy({ voter_id: noteDto.voter });
    if (isPresent) {
      const modifiedNoteDto = { ...noteDto, voter: isPresent.id };
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
    const foundNote = await this.voltaireService.getRepository('Note')
    .findOne({
      where: { id: numifiedNoteId },
    });
    if (!foundNote) {
      throw new NotFoundException('Note to be updated not found!');
    }
    const isPresent = await this.voltaireService
      .getRepository('Drep')
      .findOneBy({ voter_id: note.voter });
    if (isPresent) {
      const modifiedNote = { ...note, voter: isPresent.id };
      // Iterate through the properties of the note object
      Object.keys(modifiedNote).forEach((key) => {
        foundNote[key] = modifiedNote[key];
      });
      return await foundNote.save(foundNote);
    } else {
      return new NotFoundException('DRep associated with note not found!');
    }
  }
}
