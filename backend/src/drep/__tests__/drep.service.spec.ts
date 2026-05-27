import { DataSource } from 'typeorm';
import { DrepService } from '../drep.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AttachmentService } from 'src/attachment/attachment.service';
import { ReactionsService } from 'src/reactions/reactions.service';
import { CommentsService } from 'src/comments/comments.service';
import { AuthService } from 'src/auth/auth.service';

describe('DrepService - SQL Injection Prevention', () => {
  let service: DrepService;
  let mockCexplorerQuery: jest.Mock;
  let mockVoltaireRepo: any;

  beforeEach(() => {
    mockCexplorerQuery = jest.fn().mockResolvedValue([]);
    mockVoltaireRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null),
      }),
      insert: jest.fn(),
      update: jest.fn(),
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValue([]),
          getOne: jest.fn().mockResolvedValue(null),
        }),
      }),
    };

    const mockVoltaireDataSource = {
      getRepository: jest.fn().mockReturnValue(mockVoltaireRepo),
    };

    service = new DrepService(
      mockVoltaireDataSource as any,
      { manager: { query: mockCexplorerQuery } } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  describe('getAllDRepsCexplorer - Search parameterization', () => {
    it('should use parameterized queries for search input instead of string interpolation', async () => {
      const searchQuery = "test'; DROP TABLE drep_hash; --";
      
      // Mock the method to capture the SQL
      mockCexplorerQuery.mockResolvedValue([]);
      
      // Call with malicious search - should not throw, but should parameterize
      // The key test is that the SQL string should NOT contain the raw search term
      await service.getAllDRepsCexplorer(
        searchQuery,
        1,
        24,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );

      // Check that queries were called with params array
      expect(mockCexplorerQuery).toHaveBeenCalled();
      
      // Get the first call's arguments
      const [sql, params] = mockCexplorerQuery.mock.calls[0];
      
      // The SQL should use $1, $2 placeholders instead of the raw search string
      expect(sql).not.toContain(searchQuery);
      // The params array should contain the search values
      expect(params).toBeDefined();
      expect(params).toContain(`%${searchQuery}%`);
    });

    it('should properly escape single quotes in nameFilteredDRepViews', async () => {
      const maliciousView = "drep_test'; DROP TABLE drep_hash; --";
      
      mockCexplorerQuery.mockResolvedValue([]);
      
      await service.getAllDRepsCexplorer(
        undefined,
        1,
        24,
        [maliciousView],
      );

      const [sql] = mockCexplorerQuery.mock.calls[0];
      // Single quotes in view values should be escaped
      // The malicious content should be escaped with doubled quotes
      expect(sql).toContain("drep_test''; DROP TABLE drep_hash; --");
    });
  });
});
