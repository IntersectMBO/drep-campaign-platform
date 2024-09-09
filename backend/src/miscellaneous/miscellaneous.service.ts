import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MiscellaneousService {
  constructor(
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
  ) {}
  async getFirstEpoch() {
    const epoch = await this.cexplorerService.manager.query(
      `SELECT * 
        FROM "epoch" 
        ORDER BY "start_time" ASC 
        LIMIT 1;`,
    );
    return epoch[0];
  }
}
