import { NotFoundException } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { Comment } from 'src/entities/comment.entity';
import { Drep } from 'src/entities/drep.entity';
import { Metadata } from 'src/entities/metadata.entity';
import { Note } from 'src/entities/note.entity';
import { Reaction } from 'src/entities/reaction.entity';
import { Signature } from 'src/entities/signatures.entity';
import { NoteService } from './note.service';

type CapturedQuery = { sql: string; params: any[] };

// The WHERE clause up to the soft-delete filter TypeORM appends
const whereClause = (sql: string) =>
  sql.slice(sql.indexOf(' WHERE '), sql.indexOf(' AND ( "note"."deletedAt"'));

describe('NoteService visibility', () => {
  let dataSource: DataSource;
  let service: NoteService;
  let captured: CapturedQuery[];
  let singleNoteResult: any;

  beforeAll(async () => {
    // Metadata only: queries are built but never sent to a database
    dataSource = new DataSource({
      type: 'postgres',
      entities: [
        Note,
        Drep,
        Signature,
        Reaction,
        Comment,
        Attachment,
        Metadata,
      ],
    });
    await (dataSource as any).buildMetadatas();
  });

  beforeEach(() => {
    captured = [];
    singleNoteResult = null;
    jest
      .spyOn(SelectQueryBuilder.prototype, 'getRawMany')
      .mockImplementation(function (this: SelectQueryBuilder<any>) {
        const [sql, params] = this.getQueryAndParameters();
        captured.push({ sql, params });
        return Promise.resolve([]);
      });
    jest
      .spyOn(SelectQueryBuilder.prototype, 'getOne')
      .mockImplementation(function (this: SelectQueryBuilder<any>) {
        const [sql, params] = this.getQueryAndParameters();
        captured.push({ sql, params });
        return Promise.resolve(singleNoteResult);
      });
    service = new NoteService(
      dataSource,
      {} as any,
      {} as any,
      { getReactions: jest.fn().mockResolvedValue([]) } as any,
      { getComments: jest.fn().mockResolvedValue([]) } as any,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  describe('getAllNotes', () => {
    it('returns only public notes to an anonymous caller', async () => {
      await service.getAllNotes();

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( ("note"."note_visibility" = $1) )',
      );
      expect(captured[0].params).toEqual(['everyone']);
    });

    it('keeps the visibility filter when paging backwards', async () => {
      await service.getAllNotes({}, 30, 'before');

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( ("note"."note_visibility" = $1) AND "note"."id" <= $2 )',
      );
      expect(captured[0].params).toEqual(['everyone', 30]);
    });

    it('keeps the visibility filter when paging forwards', async () => {
      await service.getAllNotes({}, 30, 'after');

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( ("note"."note_visibility" = $1) AND "note"."id" <= $2 )',
      );
      expect(captured[0].params).toEqual(['everyone', 50]);
    });

    it('groups the delegator and author alternatives before applying the cursor', async () => {
      await service.getAllNotes(
        { delegatedDRepId: 'drep1delegated', stakeKeyBech32: 'stake1caller' },
        30,
        'before',
      );

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( ("note"."note_visibility" = $1' +
          ' OR ("note"."note_visibility" = $2 AND "signature"."drepVoterId" = $3)' +
          ' OR ("note"."note_visibility" = $4 AND "signature"."drepStakeKey" = $5))' +
          ' AND "note"."id" <= $6 )',
      );
      expect(captured[0].params).toEqual([
        'everyone',
        'delegators',
        'drep1delegated',
        'myself',
        'stake1caller',
        30,
      ]);
    });

    it('adds only the alternatives the caller qualifies for', async () => {
      await service.getAllNotes({ delegatedDRepId: 'drep1delegated' });

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( ("note"."note_visibility" = $1' +
          ' OR ("note"."note_visibility" = $2 AND "signature"."drepVoterId" = $3)) )',
      );
      expect(captured[0].params).toEqual([
        'everyone',
        'delegators',
        'drep1delegated',
      ]);
    });
  });

  describe('getSingleNote', () => {
    it('applies the visibility filter to the requested note', async () => {
      singleNoteResult = { id: 7, note_visibility: 'myself' };

      const note = await service.getSingleNote('7', {
        stakeKeyBech32: 'stake1caller',
      });

      expect(note).toBe(singleNoteResult);
      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( "note"."id" = $1 AND ("note"."note_visibility" = $2' +
          ' OR ("note"."note_visibility" = $3 AND "signature"."drepStakeKey" = $4)) )',
      );
      expect(captured[0].params).toEqual([
        7,
        'everyone',
        'myself',
        'stake1caller',
      ]);
    });

    it('only matches public notes for an anonymous caller', async () => {
      singleNoteResult = { id: 7, note_visibility: 'everyone' };

      await service.getSingleNote('7');

      expect(whereClause(captured[0].sql)).toBe(
        ' WHERE ( "note"."id" = $1 AND ("note"."note_visibility" = $2) )',
      );
      expect(captured[0].params).toEqual([7, 'everyone']);
    });

    it('reports a note the caller may not see as not found', async () => {
      singleNoteResult = null;

      await expect(service.getSingleNote('7')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
