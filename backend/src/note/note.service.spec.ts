import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthPrincipal } from 'src/auth/auth.principal';
import { NoteService } from './note.service';

describe('NoteService authorship', () => {
  const principal: AuthPrincipal = {
    stakeAddress: 'stake1session',
    drepId: 'drep1session',
  };
  let noteRepository: Record<string, jest.Mock>;
  let drepService: Record<string, jest.Mock>;
  let service: NoteService;

  beforeEach(() => {
    noteRepository = {
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 21 }] }),
      findOne: jest.fn(),
      save: jest.fn(async (note) => note),
    };
    drepService = {
      findProfileIdForDRep: jest.fn().mockResolvedValue(5),
      assertProfileOwner: jest.fn().mockResolvedValue(undefined),
    };
    service = new NoteService(
      { getRepository: jest.fn(() => noteRepository) } as any,
      drepService as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  describe('registerNote', () => {
    it("adds the note to the session DRep's profile", async () => {
      const result = await service.registerNote(
        {
          note_title: 'title',
          note_content: 'content',
          note_visibility: 'delegators',
          note_tag: ['tag'],
          voter: 'drep1someoneelse',
          stake_addr: 'stake1someoneelse',
          id: 3,
        } as any,
        principal,
      );

      expect(drepService.findProfileIdForDRep).toHaveBeenCalledWith(
        'drep1session',
      );
      expect(noteRepository.insert).toHaveBeenCalledWith({
        note_title: 'title',
        note_content: 'content',
        note_visibility: 'delegators',
        note_tag: ['tag'],
        voter: 5,
      });
      expect(result).toEqual({ noteAdded: 21 });
    });

    it('requires a DRep session', async () => {
      await expect(
        service.registerNote({} as any, { stakeAddress: 'stake1session' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(noteRepository.insert).not.toHaveBeenCalled();
    });

    it('requires the DRep to have a profile', async () => {
      drepService.findProfileIdForDRep.mockResolvedValue(null);

      await expect(
        service.registerNote({ note_title: 'title' } as any, principal),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(noteRepository.insert).not.toHaveBeenCalled();
    });

    it('rejects an unknown visibility', async () => {
      await expect(
        service.registerNote(
          { note_title: 'title', note_visibility: 'public' } as any,
          principal,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('updateNoteInfo', () => {
    it("rejects changes to another DRep's note", async () => {
      noteRepository.findOne.mockResolvedValue({ id: 9, voter: 8 });
      drepService.assertProfileOwner.mockRejectedValue(
        new ForbiddenException(),
      );

      await expect(
        service.updateNoteInfo('9', { note_title: 'new' } as any, principal),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(drepService.assertProfileOwner).toHaveBeenCalledWith(8, principal);
      expect(noteRepository.save).not.toHaveBeenCalled();
    });

    it('updates note fields and keeps the author', async () => {
      noteRepository.findOne.mockResolvedValue({
        id: 9,
        voter: 5,
        note_title: 'old',
      });

      await service.updateNoteInfo(
        '9',
        { note_title: 'new', voter: 'drep1someoneelse', id: 1 } as any,
        principal,
      );

      expect(noteRepository.save).toHaveBeenCalledWith({
        id: 9,
        voter: 5,
        note_title: 'new',
      });
    });

    it('reports a missing note', async () => {
      noteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateNoteInfo('9', {} as any, principal),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
