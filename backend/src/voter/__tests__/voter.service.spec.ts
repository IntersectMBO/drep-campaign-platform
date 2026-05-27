import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VoterService } from '../voter.service';

describe('VoterService', () => {
  let service: VoterService;
  let mockQuery: jest.Mock;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockQuery = jest.fn().mockResolvedValue([]);
    mockDataSource = {
      manager: {
        query: mockQuery,
      } as any,
    };
    service = new VoterService(mockDataSource as DataSource);
  });

  describe('getAdaHolderCurrentDelegation - SQL Injection Prevention', () => {
    it('should reject input containing SQL injection with single quote', async () => {
      const maliciousInput = "'; DROP TABLE delegation_vote; --";
      await expect(service.getAdaHolderCurrentDelegation(maliciousInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject input containing UNION-based injection', async () => {
      const maliciousInput = "00' UNION SELECT username, password, null FROM users --";
      await expect(service.getAdaHolderCurrentDelegation(maliciousInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject input containing OR 1=1 injection', async () => {
      const maliciousInput = "' OR '1'='1";
      await expect(service.getAdaHolderCurrentDelegation(maliciousInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject empty string', async () => {
      await expect(service.getAdaHolderCurrentDelegation('')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject input with spaces', async () => {
      const maliciousInput = "abcd ef01";
      await expect(service.getAdaHolderCurrentDelegation(maliciousInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject input with special characters', async () => {
      const maliciousInput = "abcd;--ef01";
      await expect(service.getAdaHolderCurrentDelegation(maliciousInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should accept valid hex stake key and use parameterized query', async () => {
      const validStakeKey = 'e0abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';
      mockQuery.mockResolvedValue([{ drep_raw: 'abc', drep_view: 'drep1xyz' }]);

      const result = await service.getAdaHolderCurrentDelegation(validStakeKey);

      expect(mockQuery).toHaveBeenCalledTimes(1);
      const [sql, params] = mockQuery.mock.calls[0];

      // Verify parameterized query is used ($1 instead of interpolated value)
      expect(sql).toContain('DECODE($1');
      expect(sql).not.toContain(`DECODE('${validStakeKey}'`);
      expect(params).toEqual([validStakeKey]);
      expect(result).toEqual({ drep_raw: 'abc', drep_view: 'drep1xyz' });
    });

    it('should use parameterized query - injection attempt in param array is safe', async () => {
      const validHex = 'abcdef0123456789abcdef01';
      mockQuery.mockResolvedValue([]);

      await service.getAdaHolderCurrentDelegation(validHex);

      const [sql, params] = mockQuery.mock.calls[0];
      // Ensure the stakeKey value is NOT in the SQL string itself
      expect(sql).not.toContain(validHex);
      // Ensure it IS in the params array
      expect(params).toContain(validHex);
    });
  });
});
