import { NoteController } from './note.controller';

const STAKE_KEY_HEX = 'e1' + 'ab'.repeat(28);

describe('NoteController viewer', () => {
  let noteService: { getAllNotes: jest.Mock; getSingleNote: jest.Mock };
  let voterService: { getAdaHolderCurrentDelegation: jest.Mock };
  let controller: NoteController;

  beforeEach(() => {
    noteService = {
      getAllNotes: jest.fn().mockResolvedValue([]),
      getSingleNote: jest.fn().mockResolvedValue({}),
    };
    voterService = {
      getAdaHolderCurrentDelegation: jest
        .fn()
        .mockResolvedValue({ drep_view: 'drep1delegated' }),
    };
    controller = new NoteController(noteService as any, voterService as any);
  });

  it('passes an empty viewer when no stake keys are given', async () => {
    await controller.getAllNotes(undefined, 30, 'before');

    expect(noteService.getAllNotes).toHaveBeenCalledWith({}, 30, 'before');
    expect(voterService.getAdaHolderCurrentDelegation).not.toHaveBeenCalled();
  });

  it('resolves the delegated DRep and stake address of the caller', async () => {
    await controller.getAllNotes({
      stakeKey: STAKE_KEY_HEX,
      stakeKeyBech32: 'stake1caller',
    });

    expect(voterService.getAdaHolderCurrentDelegation).toHaveBeenCalledWith(
      STAKE_KEY_HEX,
    );
    expect(noteService.getAllNotes).toHaveBeenCalledWith(
      { delegatedDRepId: 'drep1delegated', stakeKeyBech32: 'stake1caller' },
      undefined,
      undefined,
    );
  });

  it('ignores a stake key that is not a hex reward address', async () => {
    await controller.getAllNotes({
      stakeKey: 'stake1notahexaddress',
      stakeKeyBech32: undefined,
    });

    expect(voterService.getAdaHolderCurrentDelegation).not.toHaveBeenCalled();
    expect(noteService.getAllNotes).toHaveBeenCalledWith(
      {},
      undefined,
      undefined,
    );
  });

  it('ignores stake keys that are not plain strings', async () => {
    await controller.getAllNotes({
      stakeKey: [STAKE_KEY_HEX] as any,
      stakeKeyBech32: ['stake1caller'] as any,
    });

    expect(voterService.getAdaHolderCurrentDelegation).not.toHaveBeenCalled();
    expect(noteService.getAllNotes).toHaveBeenCalledWith(
      {},
      undefined,
      undefined,
    );
  });

  it('does not add a delegation when the caller has not delegated', async () => {
    voterService.getAdaHolderCurrentDelegation.mockResolvedValue(undefined);

    await controller.getSingleNote('7', {
      stakeKey: STAKE_KEY_HEX,
      stakeKeyBech32: 'stake1caller',
    });

    expect(noteService.getSingleNote).toHaveBeenCalledWith('7', {
      stakeKeyBech32: 'stake1caller',
    });
  });

  it('applies the caller to single note lookups', async () => {
    await controller.getSingleNote('7', {
      stakeKey: STAKE_KEY_HEX,
      stakeKeyBech32: 'stake1caller',
    });

    expect(noteService.getSingleNote).toHaveBeenCalledWith('7', {
      delegatedDRepId: 'drep1delegated',
      stakeKeyBech32: 'stake1caller',
    });
  });
});
