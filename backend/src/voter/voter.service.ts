import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class VoterService {
  constructor(
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
  ) {}
  async getAdaHolderCurrentDelegation(stakeKey: string) {
    const delegation = await this.cexplorerService.manager.query(
      `SELECT
          CASE
              WHEN drep_hash.raw IS NULL THEN NULL
              ELSE ENCODE(drep_hash.raw, 'hex')
          END AS drep_raw,
          drep_hash.view AS drep_view,
          ENCODE(tx.hash, 'hex')
      FROM
          delegation_vote
      JOIN
          tx ON tx.id = delegation_vote.tx_id
      JOIN
          drep_hash ON drep_hash.id = delegation_vote.drep_hash_id
      JOIN
          stake_address ON stake_address.id = delegation_vote.addr_id
      WHERE
          stake_address.hash_raw = DECODE('${stakeKey}', 'hex')
          AND NOT EXISTS (
              SELECT *
              FROM delegation_vote AS dv2
              WHERE dv2.addr_id = delegation_vote.addr_id
                AND dv2.tx_id > delegation_vote.tx_id
          )
      LIMIT 1;`,
    );
    return delegation[0];
  }
}
