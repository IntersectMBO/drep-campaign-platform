import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { getProposalByHashQuery } from 'src/queries/getProposalsViaQuery';
import { DataSource } from 'typeorm';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
  ) {}
  async getProposalByQuery(query: string) {
    if (!query) throw new HttpException('query is required', 400);
    if (query.length < 5)
      throw new HttpException(
        'Query string should be greater than 5 chars',
        400,
      );
    const matchingProposals = await this.cexplorerService.manager.query(
      getProposalByHashQuery,
        [`%${query}%`],
    );
    if (!matchingProposals.length)
      throw new HttpException('No matching proposals found', 404);
    return matchingProposals;
  }
}
