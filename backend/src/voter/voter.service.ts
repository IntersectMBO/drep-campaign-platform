import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Delegation, VoterData } from 'src/common/types';
import { getCurrentDelegationQuery } from 'src/queries/currentDelegation';
import { getDrepAddrData } from 'src/queries/drepAddrData';
import { getAddrDataQuery } from 'src/queries/getAddrData';
import { getStakeKeyData } from 'src/queries/getStakeKeyData';
import { getVoterDelegationHistory } from 'src/queries/getVoterDelegationHistory';
import {
  getVoterGovActionsCountQuery,
  getVoterGovActionsQuery,
} from 'src/queries/voterGovActions';
import { DataSource } from 'typeorm';

@Injectable()
export class VoterService {
  constructor(
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
  ) {}
  async getVoter(voterIdentity: string): Promise<VoterData> {
    let voterData;
    let delegationHistory;
    switch (true) {
      case voterIdentity.includes('drep'):
        voterData = await this.cexplorerService.manager.query(
          getDrepAddrData,
          [voterIdentity],
        );
        delegationHistory = await this.cexplorerService.manager.query(
          getVoterDelegationHistory,
          [voterData[0].stake_address],
        );
        break;
      case voterIdentity.includes('stake'):
        voterData = await this.cexplorerService.manager.query(getStakeKeyData, [
          voterIdentity,
        ]);
        delegationHistory = await this.cexplorerService.manager.query(
          getVoterDelegationHistory,
          [voterIdentity], // stakeKey
        );
        break;
      default:
        voterData = await this.cexplorerService.manager.query(
          getAddrDataQuery,
          [voterIdentity],
        );
        delegationHistory = await this.cexplorerService.manager.query(
          getVoterDelegationHistory,
          [voterData[0].stake_address],
        );
        break;
    }

    return Array.isArray(voterData)
      ? {
          ...voterData[0],
          delegationHistory,
          isDelegated: delegationHistory.length > 0,
        }
      : null;
  }
  async getAdaHolderCurrentDelegation(stakeKey: string): Promise<Delegation> {
    const delegation = await this.cexplorerService.manager.query(
      getCurrentDelegationQuery,
      [stakeKey],
    );
    return delegation[0];
  }

  async getGovActions(
    voterIdentity: string,
    currentPage: number,
    itemsPerPage: number,
  ) {
    const offset = (currentPage - 1) * itemsPerPage;
    let queryType: 'stake' | 'drep' | 'wallet';
    let param: string;

    if (voterIdentity.startsWith('stake')) {
      queryType = 'stake';
      param = voterIdentity;
    } else if (voterIdentity.startsWith('drep')) {
      queryType = 'drep';
      param = voterIdentity;
    } else {
      queryType = 'wallet';
      param = voterIdentity;
    }

    const govActions = await this.cexplorerService.manager.query(
      getVoterGovActionsQuery(queryType, itemsPerPage, offset),
      [param],
    );

    const totalResults = await this.cexplorerService.manager.query(
      getVoterGovActionsCountQuery(queryType),
      [param],
    );

    const totalItems = parseInt(totalResults[0]?.total, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: govActions,
      totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
    };
  }
}
