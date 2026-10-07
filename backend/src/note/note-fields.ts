import { BadRequestException } from '@nestjs/common';
import { createNoteDto } from 'src/dto';

// Note fields a DRep can set; the author always comes from the session
const NOTE_FIELDS = [
  'note_title',
  'note_tag',
  'note_content',
  'note_visibility',
] as const;
const NOTE_VISIBILITIES = ['everyone', 'delegators', 'myself'];

/** The note fields from a request body, with the visibility checked. */
export const pickNoteFields = (note: createNoteDto) => {
  const fields = NOTE_FIELDS.reduce(
    (acc, key) =>
      note?.[key] === undefined ? acc : { ...acc, [key]: note[key] },
    {} as Partial<createNoteDto>,
  );
  if (
    fields.note_visibility !== undefined &&
    !NOTE_VISIBILITIES.includes(fields.note_visibility)
  ) {
    throw new BadRequestException('Unknown note visibility');
  }
  return fields;
};
