import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { bech32 } from 'bech32';
import { AuthPrincipal } from 'src/auth/auth.principal';
import { TestWalletKey } from '../../test/test-wallet';
import { DrepService } from './drep.service';

const queryBuilder = () => {
  const qb: Record<string, jest.Mock> = {};
  ['select', 'where', 'andWhere', 'orderBy'].forEach((method) => {
    qb[method] = jest.fn(() => qb);
  });
  qb.getRawOne = jest.fn().mockResolvedValue(undefined);
  qb.getCount = jest.fn().mockResolvedValue(0);
  qb.getOne = jest.fn().mockResolvedValue(null);
  return qb;
};

describe('DrepService profile ownership', () => {
  const stakeKey = new TestWalletKey();
  const drepKey = new TestWalletKey();
  const principal: AuthPrincipal = {
    stakeAddress: stakeKey.stakeAddress(),
    drepId: drepKey.drepId(),
  };
  const cip129DrepId = bech32.encode(
    'drep',
    bech32.toWords(Buffer.concat([Buffer.from([0x22]), drepKey.keyHash])),
  );

  let signatureQuery: ReturnType<typeof queryBuilder>;
  let metadataQuery: ReturnType<typeof queryBuilder>;
  let repositories: Record<string, Record<string, jest.Mock>>;
  let attachmentService: Record<string, jest.Mock>;
  let service: DrepService;

  beforeEach(() => {
    signatureQuery = queryBuilder();
    metadataQuery = queryBuilder();
    repositories = {
      Signature: {
        createQueryBuilder: jest.fn(() => signatureQuery),
        insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 11 }] }),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      },
      Drep: {
        insert: jest
          .fn()
          .mockResolvedValue({ identifiers: [{ id: 5 }], raw: [{ id: 5 }] }),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      },
      Metadata: {
        createQueryBuilder: jest.fn(() => metadataQuery),
        create: jest.fn((value) => value),
        save: jest.fn(async (value) => ({ id: 1, ...value })),
      },
    };
    const dataSource = {
      getRepository: jest.fn((name: string) => repositories[name]),
    };
    attachmentService = {
      uploadAttachmentToIPFS: jest
        .fn()
        .mockResolvedValue({ ipfs_hash: 'bafy', state: 'pinned' }),
    };
    service = new DrepService(
      dataSource as any,
      {} as any,
      attachmentService as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  describe('registerDrep', () => {
    it('requires a DRep session', async () => {
      await expect(
        service.registerDrep({} as any, {
          stakeAddress: stakeKey.stakeAddress(),
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repositories.Drep.insert).not.toHaveBeenCalled();
    });

    it('looks for an existing profile under both DRep id spellings', async () => {
      signatureQuery.getRawOne.mockResolvedValue({ drepId: 3 });

      await expect(
        service.registerDrep({} as any, principal),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(signatureQuery.where).toHaveBeenCalledWith(
        'signature.drepVoterId IN (:...drepIds)',
        { drepIds: [drepKey.drepId(), cip129DrepId] },
      );
      expect(repositories.Drep.insert).not.toHaveBeenCalled();
    });

    it('creates the profile for the session DRep and stake address', async () => {
      const signed = drepKey.signData(`Verify DRep ${drepKey.drepId()}`);

      const result = await service.registerDrep(
        {
          voter_id: new TestWalletKey().drepId(),
          stake_addr: new TestWalletKey().stakeAddress(),
          platform_statement: 'statement',
          id: 99,
          ...signed,
        } as any,
        principal,
      );

      expect(repositories.Drep.insert).toHaveBeenCalledWith({
        platform_statement: 'statement',
      });
      expect(repositories.Signature.insert).toHaveBeenCalledWith({
        drep: 5,
        drepVoterId: drepKey.drepId(),
        drepStakeKey: stakeKey.stakeAddress(),
        drepSignature: signed.signature,
        drepSignatureKey: signed.key,
      });
      expect(result).not.toHaveProperty('token');
    });

    it('rejects a profile signature made with another key', async () => {
      const signed = new TestWalletKey().signData('Verify DRep');

      await expect(
        service.registerDrep({ ...signed } as any, principal),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repositories.Drep.insert).not.toHaveBeenCalled();
    });
  });

  describe('updateDrepInfo', () => {
    it("rejects changes to another DRep's profile", async () => {
      signatureQuery.getCount.mockResolvedValue(0);

      await expect(
        service.updateDrepInfo(
          5,
          { platform_statement: 'x' } as any,
          principal,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(signatureQuery.where).toHaveBeenCalledWith(
        'signature.drepId = :id',
        {
          id: 5,
        },
      );
      expect(repositories.Drep.update).not.toHaveBeenCalled();
      expect(repositories.Signature.update).not.toHaveBeenCalled();
    });

    it('requires a DRep session', async () => {
      await expect(
        service.updateDrepInfo(5, {} as any, {
          stakeAddress: stakeKey.stakeAddress(),
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('updates only profile fields', async () => {
      signatureQuery.getCount.mockResolvedValue(1);

      await service.updateDrepInfo(
        5,
        {
          social: '{"x":"handle"}',
          expertise: 'governance',
          voter_id: new TestWalletKey().drepId(),
          stake_addr: new TestWalletKey().stakeAddress(),
          id: 6,
          deletedAt: '2026-01-01',
        } as any,
        principal,
      );

      expect(repositories.Drep.update).toHaveBeenCalledWith(5, {
        social: { x: 'handle' },
        expertise: 'governance',
      });
      expect(repositories.Signature.update).not.toHaveBeenCalled();
    });

    it('stores a profile signature made with the DRep key', async () => {
      signatureQuery.getCount.mockResolvedValue(1);
      const signed = drepKey.signData(`Verify DRep ${drepKey.drepId()}`);

      const result = await service.updateDrepInfo(
        5,
        { ...signed, voter_id: drepKey.drepId() } as any,
        principal,
      );

      expect(repositories.Signature.update).toHaveBeenCalledWith(
        { drep: 5 },
        { drepSignature: signed.signature, drepSignatureKey: signed.key },
      );
      expect(repositories.Drep.update).not.toHaveBeenCalled();
      expect(result).toEqual({ affected: 0 });
    });

    it('rejects a profile signature made with another key', async () => {
      signatureQuery.getCount.mockResolvedValue(1);
      const signed = new TestWalletKey().signData('Verify DRep');

      await expect(
        service.updateDrepInfo(5, { ...signed } as any, principal),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repositories.Signature.update).not.toHaveBeenCalled();
    });
  });

  describe('saveMetadata', () => {
    it("rejects saving metadata for another DRep's profile", async () => {
      signatureQuery.getCount.mockResolvedValue(0);

      await expect(
        service.saveMetadata({}, 'hash', 8, 'name', principal),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(attachmentService.uploadAttachmentToIPFS).not.toHaveBeenCalled();
    });

    it("uses the session DRep's profile when none is given", async () => {
      signatureQuery.getRawOne.mockResolvedValue({ drepId: 5 });
      signatureQuery.getCount.mockResolvedValue(1);

      await service.saveMetadata(
        { body: {} },
        'hash',
        undefined,
        'name',
        principal,
      );

      expect(repositories.Metadata.save).toHaveBeenCalledWith(
        expect.objectContaining({ drep: 5, hash: 'hash', content: 'bafy' }),
      );
    });

    it('reports a DRep without a profile', async () => {
      signatureQuery.getRawOne.mockResolvedValue(undefined);

      await expect(
        service.saveMetadata({}, 'hash', undefined, 'name', principal),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
