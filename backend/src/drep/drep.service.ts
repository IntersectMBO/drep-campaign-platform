import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createDrepDto, ValidateMetadataDTO } from 'src/dto';
import { faker } from '@faker-js/faker';
import * as blake from 'blakejs';
import { HttpService } from '@nestjs/axios';
import { AttachmentService } from 'src/attachment/attachment.service';
import {
  catchError,
  firstValueFrom,
  Observable,
  from,
  of,
  forkJoin,
  lastValueFrom,
  timeout
} from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReactionsService } from 'src/reactions/reactions.service';
import { CommentsService } from 'src/comments/comments.service';
import {
  Delegation,
  DRepDelegatorsHistoryResponse,
  DRepRegistrationData,
  DRepTimelineParams,
  EpochActivityResponse,
  IPFSResponse,
  LoggerMessage,
  MetadataStandard,
  MetadataValidationStatus,
  TimelineEntry,
  TimelineFilters,
  ValidateMetadataResult,
  VoterNoteResponse,
  VotingActivityHistory,
} from 'src/common/types';
import { AuthService } from 'src/auth/auth.service';
import { getAllDRepsQuery, getTotalResultsQuery } from 'src/queries/getDReps';
import {
  getDRepDelegatorsCountQuery,
  getDRepVotesCountQuery,
  getDRepVotingPowerQuery,
} from 'src/queries/drepStats';
import { getEpochParams } from 'src/queries/getEpochParams';
import { getDRepDelegatorsHistory } from 'src/queries/drepDelegatorsHistory';
import { JsonLd } from 'jsonld/jsonld-spec';
import { Response } from 'express';
import { getDrepCexplorerDetailsQuery } from 'src/queries/drepCexplorerDetails';
import {
  getDrepDelegatorsCountQuery,
  getDrepDelegatorsWithVotingPowerQuery,
} from 'src/queries/drepDelegatorsWithVotingPower';
import { BlockfrostService } from 'src/blockfrost/blockfrost.service';
import { drepRegistrationQuery } from 'src/queries/drepRegistration';
import { getDRepMetadataQuery } from 'src/queries/drepMetadata';

@Injectable()
export class DrepService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
    private attachmentService: AttachmentService,
    private reactionsService: ReactionsService,
    private commentsService: CommentsService,
    private authService: AuthService,
    private readonly httpService: HttpService,
    private blockfrostService: BlockfrostService,
  ) {}
  async getAllDReps(
    query?: string,
    currentPage?: number,
    itemsPerPage?: number,
    sort?: string,
    order?: string,
    onChainStatus?: 'active' | 'inactive',
    campaignStatus?: 'claimed' | 'unclaimed',
    includeRetired?: true | false,
    type?: 'has_script',
  ) {
    let nameFilteredDRepViews: string[];

    // disabled temporarily due to model changes
    // if (query) {
    //   const nameFilteredDReps = query ? await this.getDRepsByName(query) : [];
    //   nameFilteredDRepViews = nameFilteredDReps.map(
    //     (drep) => drep.signature_voterId,
    //   );
    // }

    const sortColumn =
      {
        voting_power: 'voting_power',
        live_stake: 'live_stake',
        delegators: 'delegation_vote_count',
      }[sort] || null;

    const sortOrder = !!order ? order.toUpperCase() : null;

    let dRepViews: string[];

    if (campaignStatus) {
      const voltaireDReps = (await this.getAllDRepsVoltaire()) ?? [];
      dRepViews = voltaireDReps.map((drep) => drep.signature_voterId);
    }

    const drepList = await this.getAllDRepsCexplorer(
      query,
      currentPage,
      itemsPerPage,
      nameFilteredDRepViews,
      sortColumn,
      sortOrder,
      onChainStatus,
      campaignStatus,
      includeRetired,
      dRepViews,
      type,
    );

    const drepViews = drepList.data.map((drep) => drep.view);

    const voltaireDReps = await this.getVoltaireDRepsByViews(drepViews);

    const totalPages = Math.ceil(drepList.totalItems / itemsPerPage);

    const mergedDRepsData = drepList.data.map((drep) => {
      const voltaireDrep = voltaireDReps.find(
        (voltaireDrep) => voltaireDrep.signature_voterId === drep.view,
      );
      //account for voting options
      if (
        drep?.view &&
        (drep?.view.includes('drep_always_abstain') ||
          drep?.view.includes('drep_always_no_confidence'))
      ) {
        drep['type'] = 'voting_option';
      } else if (!!drep?.has_script) {
        drep['type'] = 'scripted';
      } else {
        drep['type'] = 'drep';
      }
      return {
        ...drep,
        ...(voltaireDrep ? voltaireDrep : {}),
      };
    });

    return {
      data: mergedDRepsData,
      totalItems: drepList.totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
    };
  }

  async getAllDRepsCexplorer(
    query?: string,
    currentPage?: number,
    itemsPerPage?: number,
    nameFilteredDRepViews?: string[],
    sortColumn?: string,
    sortOrder?: string,
    onChainStatus?: 'active' | 'inactive',
    campaignStatus?: 'claimed' | 'unclaimed',
    includeRetired?: true | false,
    dRepViews?: string[],
    type?: 'has_script',
  ) {
    const offset = (currentPage - 1) * itemsPerPage;

    const sanitizedSearch = query ? query.replace(/'/g, "''") : '';
    let sanitizedSearchCondition = '';
    if (sanitizedSearch && sanitizedSearch.length > 0) {
      sanitizedSearchCondition = `AND (dh.view ILIKE '%${sanitizedSearch}%' OR off_chain_vote_drep_data.given_name ILIKE '%${sanitizedSearch}%')`;
    }

    let nameFilteredDRepCondition = '';
    if (nameFilteredDRepViews && nameFilteredDRepViews.length > 0) {
      nameFilteredDRepCondition = `OR dh.view IN (${nameFilteredDRepViews.map((v) => `'${v}'`).join(', ')})`;
    }

    let chainStatusCondition = '';
    if (onChainStatus === 'active') {
      chainStatusCondition = `AND (DRepActivity.epoch_no - coalesce(block.epoch_no, block_first_register.epoch_no)) <=
                  DRepActivity.drep_activity`;
    } else if (onChainStatus === 'inactive') {
      chainStatusCondition = `AND (DRepActivity.epoch_no - coalesce(block.epoch_no, block_first_register.epoch_no)) >
                  DRepActivity.drep_activity`;
    }
    if (!includeRetired) {
      chainStatusCondition += ` AND (dr_voting_anchor.deposit IS NULL OR dr_voting_anchor.deposit >= 0) `;
    }

    let campaignStatusCondition = '';
    if (dRepViews && dRepViews.length > 0) {
      if (campaignStatus === 'claimed') {
        campaignStatusCondition = `AND dh.view IN (${dRepViews.map((v) => `'${v}'`).join(', ')})`;
      } else if (campaignStatus === 'unclaimed') {
        campaignStatusCondition = `AND dh.view NOT IN (${dRepViews.map((v) => `'${v}'`).join(', ')})`;
      }
    }

    let typeCondition = '';
    if (type === 'has_script') {
      typeCondition = `AND dh.has_script = true`;
    }

    let orderByClause = '';
    if (sortColumn && sortOrder) {
      const validSortColumns = [
        'delegation_vote_count',
        'live_stake',
        'voting_power',
      ];
      const validSortOrders = ['ASC', 'DESC'];

      if (
        validSortColumns.includes(sortColumn) &&
        validSortOrders.includes(sortOrder)
      ) {
        if (sortOrder === 'DESC') {
          orderByClause = `ORDER BY ${sortColumn} ${sortOrder} NULLS LAST`;
        } else if (sortOrder === 'ASC') {
          orderByClause = `ORDER BY ${sortColumn} ${sortOrder} NULLS FIRST`;
        }
      }
    }
    const drepList = await this.cexplorerService.manager.query(
      getAllDRepsQuery(
        sanitizedSearchCondition,
        nameFilteredDRepCondition,
        campaignStatusCondition,
        chainStatusCondition,
        orderByClause,
        itemsPerPage,
        offset,
        typeCondition,
      ),
    );
    const totalResults = await this.cexplorerService.manager.query(
      getTotalResultsQuery(
        sanitizedSearchCondition,
        nameFilteredDRepCondition, 
        campaignStatusCondition,
        chainStatusCondition,
        typeCondition,
      ),
    );

    return {
      data: drepList.map((entry) => {
        return {
          ...entry,
          // deposit: (entry.deposit / 1000000).toFixed(1),
          voting_power:
            entry.voting_power != null
              ? (entry.voting_power / 1000000).toFixed(1)
              : null,
          live_stake:
            entry.live_stake != null
              ? (entry.live_stake / 1000000).toFixed(1)
              : null,
        };
      }),
      totalItems: parseInt(totalResults[0].total, 10),
    };
  }
  async getAllDRepsVoltaire() {
    return await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect('signature', 'signature', 'signature.drepId = drep.id')
      .getRawMany();
  }

  async getVoltaireDRepsByViews(views: string[]) {
    if (views.length === 0) return [];

    return await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect('drep.signatures', 'signature')
      .where('signature.voterId IN (:...views)', { views })
      .getRawMany();
  }

  async getDRepsByName(name: string) {
    return await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect('drep.signatures', 'signature')
      .where('drep.name ILIKE :name', { name: `%${name}%` })
      .getRawMany();
  }
  async getSingleDrepViaID(drepId: number) {
    const drep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect('signature', 'signature', 'signature.drepId = drep.id')
      .where('drep.id = :drepId', { drepId })
      .getRawMany();
    let drepVoterId;
    if (drep.length > 0) drepVoterId = drep[0].signature_voterId;
    const drepCexplorer = await this.getDrepCexplorerDetails(drepVoterId);

    const combinedResult = {
      ...drep[0],
      ...drepCexplorer,
    };
    if (
      (!drep || drep.length === 0) &&
      (!drepCexplorer || drepCexplorer.length === 0)
    ) {
      throw new NotFoundException('Drep not found!');
    }
    //account for voting options
    if (
      combinedResult?.view.includes('drep_always_abstain') ||
      combinedResult?.view.includes('drep_always_no_confidence')
    ) {
      combinedResult['type'] = 'voting_option';
    } else {
      combinedResult['type'] = 'drep';
    }

    return combinedResult;
  }
  async getSingleDrepViaVoterID(drepVoterId: string) {
    const drep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect('signature', 'signature', 'signature.drepId = drep.id')
      .where('signature.voterId = :drepVoterId', { drepVoterId })
      .getRawMany();
    const drepCexplorer = await this.getDrepCexplorerDetails(drepVoterId);
    const combinedResult = {
      ...drep[0],
      ...drepCexplorer,
    };
    if (
      (!drep || drep.length === 0) &&
      (!drepCexplorer || drepCexplorer.length === 0)
    ) {
      throw new NotFoundException('Drep not found!');
    }
    //account for voting options
    if (
      combinedResult?.view.includes('drep_always_abstain') ||
      combinedResult?.view.includes('drep_always_no_confidence')
    ) {
      combinedResult['type'] = 'voting_option';
    } else if (!!combinedResult.has_script) {
      combinedResult['type'] = 'scripted';
    } else {
      combinedResult['type'] = 'drep';
    }

    return combinedResult;
  }
  async getDrepCexplorerDetails(drepVoterId: string) {
    //also get his details from cexplorer
    const viewParam = drepVoterId;
    const drepCexplorer = await this.cexplorerService.manager.query(
      getDrepCexplorerDetailsQuery,
      [viewParam],
    );
    return drepCexplorer[0];
  }

  async getDrepDateofRegistration(
    drepVoterId: string,
  ): Promise<DRepRegistrationData | null> {
    const drepRegistrationData = await this.cexplorerService.manager.query(
      `SELECT 
              dh.id AS drep_hash_id, 
              SUBSTRING(CAST(reg_tx.hash AS TEXT) FROM 3) AS reg_tx_hash,
              reg_tx_bk.time AS date_of_registration,
              reg_tx_bk.epoch_no AS epoch_of_registration
          FROM 
              drep_hash AS dh
          LEFT JOIN 
              drep_registration AS dr ON dh.id = dr.drep_hash_id
          LEFT JOIN 
              tx AS reg_tx ON dr.tx_id = reg_tx.id 
          LEFT JOIN 
              block AS reg_tx_bk ON reg_tx.block_id = reg_tx_bk.id 
          WHERE 
              dh.view = $1`,
      [drepVoterId],
    );
    return drepRegistrationData[0];
  }

  private getFilters(filterValues?: string[]): TimelineFilters {
    return {
      includeVotingActivity: !filterValues || filterValues.includes('va'),
      includeDelegations: !filterValues || filterValues.includes('d'),
      includeNotes: !filterValues || filterValues.includes('n'),
      includeClaimedProfile: !filterValues || filterValues.includes('cp'),
      includeRegistration: !filterValues || filterValues.includes('r'),
    };
  }

  private getTimeRange(beforeDate?: number, tillDate?: number): { startingTime: Date; endingTime: Date } {
    const startingTime = beforeDate ? new Date(Number(beforeDate)) : new Date();
    const endingTime = tillDate
      ? new Date(Number(tillDate))
      : new Date(startingTime.getTime() - 432000000); // 5 days ago
    return { startingTime, endingTime };
  }

  private createTimelineEntries<T extends { [key: string]: any }>(
    data: T[],
    type: string,
    timestampField: keyof T
  ): TimelineEntry[] {
    return data.map(item => ({
      ...item,
      type,
      timestamp: item[timestampField],
    }));
  }

  private isWithinTimeRange(timestamp: string | Date, startTime: Date, endTime: Date): boolean {
    const time = new Date(timestamp).getTime();
    return startTime.getTime() > time && endTime.getTime() < time;
  }

  async getDrepTimeline({
    drep,
    drepVoterId,
    stakeKeyBech32,
    delegation,
    beforeDate,
    tillDate,
    filterValues,
  }: DRepTimelineParams): Promise<TimelineEntry[]> {
    const filters = this.getFilters(filterValues);
    const { startingTime, endingTime } = this.getTimeRange(beforeDate, tillDate);
    const drepId = drep?.drep_id;

    // Setting up observables for parallel data fetching
    const queries: Record<string, Observable<any>> = {
      epochs: from(this.getEpochs(startingTime, endingTime)),
      regData: filters.includeRegistration
        ? from(this.getDrepDateofRegistration(drepVoterId))
        : of(null),
      votingHistory: filters.includeVotingActivity
        ? from(this.getDrepVotingActivity(drepVoterId, startingTime, endingTime))
        : of<VotingActivityHistory[]>([]),
      delegatorsHistory: filters.includeDelegations
        ? from(this.getDrepDelegators(drepVoterId, startingTime, endingTime))
        : of<DRepDelegatorsHistoryResponse>([]),
      notes: filters.includeNotes && drepId
        ? from(this.getDRepNotes(drepId, startingTime, endingTime, stakeKeyBech32, delegation))
        : of<VoterNoteResponse>([]),
    };

    try {
      const results = await lastValueFrom(
        forkJoin(queries).pipe(
          timeout(100000), // 100 second timeout for mainnet data(may be heavy)
          catchError(error => {
            console.error('Error fetching DRep timeline data:', error);
            throw new Error('Failed to fetch DRep timeline data');
          })
        )
      );

      // Combining all timeline entries
      let timelineEntries: TimelineEntry[] = [
        ...this.createTimelineEntries(results.epochs, 'epoch', 'start_time'),
        ...this.createTimelineEntries(results.votingHistory, 'voting_activity', 'time_voted'),
        ...this.createTimelineEntries(results.notes, 'note', 'note_updatedAt'),
        ...results.delegatorsHistory,
      ];
      if (
        filters.includeClaimedProfile &&
        drepId &&
        drep?.drep_createdAt &&
        this.isWithinTimeRange(drep.drep_createdAt, startingTime, endingTime)
      ) {
        timelineEntries.push({
          type: 'claimed_profile',
          timestamp: drep.drep_createdAt,
          claimingId: drepId,
          claimedDRepId: drepVoterId,
        });
      }
      const regDate = results.regData?.date_of_registration;
      if (
        filters.includeRegistration &&
        regDate &&
        this.isWithinTimeRange(regDate, startingTime, endingTime)
      ) {
        timelineEntries.push({
          type: 'registration',
          timestamp: regDate,
          tx_hash: results.regData.reg_tx_hash,
          epoch_no: results.regData.epoch_of_registration,
        });
      }

      // Sort timeline entries by timestamp (latest first)
      timelineEntries.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      return timelineEntries;
    } catch (error) {
      console.error('Error processing DRep timeline:', error);
      throw error;
    }
  }

  async getEpochs(
    beforeDate: Date,
    tillDate: Date,
  ): Promise<EpochActivityResponse[]> {
    const epochs = (await this.cexplorerService.manager.query(
      `SELECT 
      start_time, end_time, no
       FROM epoch
       WHERE epoch.start_time::DATE
        BETWEEN
         $2::DATE AND $1::DATE`,
      [beforeDate, tillDate],
    )) as any[];

    return epochs.map((epoch) => ({
      ...epoch,
      type: 'epoch',
    }));
  }

  async getDrepVotingActivity(
    drepVoterId: string,
    beforeDate: Date,
    tillDate: Date,
  ): Promise<VotingActivityHistory[]> {
    // Convert the start and end times from seconds to timestamps
    const drepVotingHistory = (await this.cexplorerService.manager.query(
      `SELECT  
          dh.view, 
          SUBSTRING(CAST(prop_creation_tx.hash AS TEXT) FROM 3) AS gov_action_proposal_id,
          prop_creation_bk.time AS prop_inception,
          gp.type,
          gp.description,
          gp.voting_anchor_id,
          vp.vote::text,
          ocvd.json AS metadata,
          bk.time AS time_voted,
          prop_creation_bk.epoch_no AS proposal_epoch,
          bk.epoch_no AS voting_epoch,
          va.url
      FROM 
          drep_hash AS dh
      JOIN 
          voting_procedure AS vp ON dh.id = vp.drep_voter
      LEFT JOIN 
          gov_action_proposal AS gp ON vp.gov_action_proposal_id = gp.id
      LEFT JOIN 
          tx AS tx ON vp.tx_id = tx.id
      LEFT JOIN 
          tx AS prop_creation_tx ON gp.tx_id = prop_creation_tx.id
      LEFT JOIN 
          block AS bk ON tx.block_id = bk.id 
      LEFT JOIN 
          block AS prop_creation_bk ON prop_creation_tx.block_id = prop_creation_bk.id
      LEFT JOIN
          voting_anchor as va ON gp.voting_anchor_id = va.id
      LEFT JOIN
        off_chain_vote_data AS ocvd ON ocvd.voting_anchor_id = va.id
      WHERE
          dh.view = $1
          AND bk.time::DATE BETWEEN $3::DATE AND $2::DATE
      ORDER BY 
          bk.epoch_no`,
      [drepVoterId, beforeDate, tillDate],
    )) as any[];

    return drepVotingHistory.map((item) => {
      return {
        ...item,
        type: 'voting_activity',
      };
    });
  }

  async getDRepNotes(
    drepId: number,
    beforeDate: Date,
    tillDate: Date,
    stakeKeyBech32?: string,
    delegation?: any,
  ): Promise<VoterNoteResponse> {
    const queryBuilder = await this.voltaireService
      .getRepository('Note')
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.drep', 'drep')
      .leftJoin('drep.signatures', 'signature')
      .where('note.drep = :drepId', { drepId })
      .andWhere(
        'note."createdAt"::DATE BETWEEN :tillDate::DATE AND :beforeDate::DATE',
        {
          beforeDate,
          tillDate,
        },
      );

    // Prepare visibility conditions
    const visibilityConditions = ['note.visibility = :everyone'];

    const visibilityParams: {
      everyone: string;
      delegators?: string;
      drepVoterId?: string;
      myself?: string;
      stakeKeyBech32?: string;
    } = {
      everyone: 'everyone',
    };

    // 'delegators' visibility
    if (delegation) {
      visibilityConditions.push(
        'note.visibility = :delegators AND signature.voterId = :drepVoterId',
      );
      visibilityParams.delegators = 'delegators';
      visibilityParams.drepVoterId = delegation.drep_view;
    }

    // 'myself' visibility
    if (stakeKeyBech32) {
      visibilityConditions.push(
        'note.visibility = :myself AND signature.stakeKey = :stakeKeyBech32',
      );
      visibilityParams.myself = 'myself';
      visibilityParams.stakeKeyBech32 = stakeKeyBech32;
    }

    // Combine visibility conditions with OR logic
    queryBuilder.andWhere(
      `(${visibilityConditions.join(' OR ')})`,
      visibilityParams,
    );

    let allNotes = await queryBuilder.getRawMany();

    // Use Promise.all to ensure all asynchronous operations complete
    allNotes = await Promise.all(
      allNotes.map(async (note) => {
        // Get reactions and comments
        const reactions = await this.reactionsService.getReactions(
          note.note_id,
          'note',
        );
        const comments = await this.commentsService.getComments(
          note.note_id,
          'note',
        );
        // Add reactions and comments to the note
        return {
          ...note,
          reactions: reactions,
          comments: comments,
          type: 'note',
        };
      }),
    );
    return allNotes;
  }

  async populateFakeDRepData() {
    const dreps = await this.getAllDRepsCexplorer();
    //seeding`
    const modified = dreps.data.map((drep) => {
      return {
        ...drep,
        name: faker.person.fullName(),
        bio: faker.lorem.sentences(2),
      };
    });
    await this.voltaireService.getRepository('Drep').insert(modified);
    return modified;
  }
  async registerDrep(drepDto: createDrepDto) {
    const insertedDrep = await this.voltaireService
      .getRepository('Drep')
      .insert(drepDto);
    const signatureDto = {
      drepId: insertedDrep.identifiers[0].id,
      voterId: drepDto?.voter_id,
      stakeKey: drepDto?.stake_addr,
      key: drepDto?.key,
      signature: drepDto?.signature,
    };
    const { token, insertedSig } = await this.authService.login(
      signatureDto,
      10000,
    );
    return { insertedDrep, insertedSig, token };
  }
  async getEpochParams() {
    try {
      return await this.blockfrostService.getEpochParameters();
    } catch (error) {
      console.error('Blockfrost API call failed:', error);
      try {
        // Fallback to cexplorerService
        const fallbackResponse =
          await this.cexplorerService.manager.query(getEpochParams);
        if (fallbackResponse) {
          const modifiedRes = {
            ...fallbackResponse[0],
            nonce: String(fallbackResponse[0]?.nonce).slice(2),
            hash: String(fallbackResponse[0]?.hash).slice(2),
          };
          return modifiedRes;
        }
        return null;
      } catch (fallbackError) {
        console.error('Fallback to cexplorerService failed:', fallbackError);
        throw fallbackError; // Throw the fallback error if both attempts fail
      }
    }
  }

  async getDrepDelegatorsWithVotingPower(
    drepVoterId: string,
    currentPage: number,
    itemsPerPage: number,
    sort?: string,
    order?: string,
  ) {
    const offset = (currentPage - 1) * itemsPerPage;

    const sortColumns = {
      power: 'voting_power',
      epoch: 'epoch_no',
    };

    const sortColumn = sortColumns[sort] || null;
    const sortOrder = order?.toUpperCase();

    const orderByClause =
      sortColumn && ['ASC', 'DESC'].includes(sortOrder)
        ? `ORDER BY ${sortColumn} ${sortOrder} NULLS ${sortOrder === 'DESC' ? 'LAST' : 'FIRST'}`
        : '';

    const delegatorsWithVotingPower = await this.cexplorerService.manager.query(
      getDrepDelegatorsWithVotingPowerQuery(
        itemsPerPage,
        offset,
        orderByClause,
      ),
      [drepVoterId],
    );

    const totalResults = await this.cexplorerService.manager.query(
      getDrepDelegatorsCountQuery(),
      [drepVoterId],
    );

    const totalItems = parseInt(totalResults[0].total, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: delegatorsWithVotingPower.map((delegator) => ({
        stakeAddress: delegator?.stake_address,
        delegationEpoch: delegator?.delegation_epoch,
        votingPower: delegator?.voting_power,
      })),
      totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
    };
  }

  async updateDrepInfo(drepId: number, drep: createDrepDto) {
    const foundDrep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .where('drep.id = :drepId', { drepId })
      .getRawMany();

    if (!foundDrep) {
      throw new NotFoundException('Drep to be updated not found!');
    }
    if (drep.signature) {
      await this.voltaireService
        .getRepository('Signature')
        .update(
          { drep: foundDrep[0].drep_id },
          { signatureKey: drep.key, signature: drep.signature },
        );
      delete drep.signature;
      delete drep.key;
      delete drep.stake_addr;
      delete drep.voter_id;
    }
    const updatedDrep = Object.keys(drep).reduce((acc, key) => {
      let value = drep[key];
      try {
        value = JSON.parse(value);
      } catch (e) {
        // ignore
      }
      return { ...acc, [key]: value };
    }, {});

    return await this.voltaireService
      .getRepository('Drep')
      .update(drepId, updatedDrep);
  }

  async getMetadataFromExternalLink(metadataUrl: string) {
    if (!metadataUrl) throw new Error('Inadequate parameters');
    const { data } = await firstValueFrom(
      this.httpService.get(metadataUrl).pipe(
        catchError((err) => {
          console.log(err);
          throw new Error('Metadata not found');
        }),
      ),
    );

    return data;
  }
  async validateMetadata({
    hash,
    url,
    standard = MetadataStandard.CIP100,
  }: ValidateMetadataDTO): Promise<
    Observable<AxiosResponse<ValidateMetadataResult, any>>
  > {
    let status: MetadataValidationStatus;
    let metadata: any;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError(() => {
            throw MetadataValidationStatus.URL_NOT_FOUND;
          }),
        ),
      );

      Logger.debug(LoggerMessage.METADATA_DATA, data);
      //buggy
      // if (standard) {
      //   await validateMetadataStandard(data, standard);
      //   metadata = parseMetadata(data.body, standard);
      // }
      const hashedMetadata = blake.blake2bHex(
        JSON.stringify(data),
        undefined,
        32,
      );
      if (hashedMetadata !== hash) {
        throw MetadataValidationStatus.INVALID_HASH;
      }
    } catch (error) {
      Logger.error(LoggerMessage.METADATA_VALIDATION_ERROR, error);
      if (Object.values(MetadataValidationStatus).includes(error)) {
        status = error;
      }
    }

    return { status, valid: !Boolean(status), metadata } as any;
  }
  async saveMetadata(metadata: any) {
    // Create a new metadata record in IPFS
    const { ipfs_hash, state } = await this.saveMetadataToIPFS(metadata);

    return { content: ipfs_hash, state };
  }
  async saveMetadataToIPFS(metadata: JsonLd): Promise<IPFSResponse> {
    try {
      //save to IPFS via blockfrost
      const metadataStr = JSON.stringify(metadata);
      const binary = Buffer.from(metadataStr);

      // Prepare the FormData
      const formData = new FormData();
      formData.append('file', binary as any);
      const res = await this.attachmentService.uploadAttachmentToIPFS(formData);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getMetadataFromIPFS(hash: string, res: Response): Promise<JsonLd> {
    try {
      const response = await this.attachmentService.getAttachmentFromIPFS(
        hash,
        res,
      );
      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getStats(drepVoterId: string) {
    const drepDelegatorsCountResult = await this.cexplorerService.manager.query(
      getDRepDelegatorsCountQuery,
      [drepVoterId],
    );

    const drepDelegatorsCount = Number(
      drepDelegatorsCountResult[0]?.delegators_count || 0,
    );

    const drepVotesCountResult = await this.cexplorerService.manager.query(
      getDRepVotesCountQuery,
      [drepVoterId],
    );
    const drepVotesCount = Number(drepVotesCountResult[0]?.vote_count || 0);

    const drepVotingPowerResult = await this.cexplorerService.manager.query(
      getDRepVotingPowerQuery,
      [drepVoterId],
    );

    const drepVotingPower = Number(drepVotingPowerResult[0]?.voting_power) || 0;

    const drepStats = {
      delegators: drepDelegatorsCount,
      votes: drepVotesCount,
      votingPower: drepVotingPower,
    };

    return drepStats;
  }

  async getDrepDelegators(
    drepVoterId: string,
    beforeDate: Date,
    tillDate: Date,
  ): Promise<DRepDelegatorsHistoryResponse> {
    const drepHashQuery = `
      SELECT id, view FROM drep_hash WHERE view = $1
    `;
    const drepHashResult = await this.cexplorerService.manager.query(
      drepHashQuery,
      [drepVoterId],
    );
    const drepHashId = drepHashResult[0]?.id;

    if (!drepHashId) {
      throw new Error(`No DRep found with the view: ${drepVoterId}`);
    }

    const addrIdsQuery = `
      SELECT DISTINCT addr_id FROM delegation_vote WHERE drep_hash_id = $1
    `;
    const addrIdsResult = await this.cexplorerService.manager.query(
      addrIdsQuery,
      [drepHashId],
    );
    const addrIds = addrIdsResult.map((row) => row.addr_id);
    const drepDelegations = await this.cexplorerService.manager.query(
      getDRepDelegatorsHistory(addrIds),
      [drepHashId, drepVoterId, beforeDate, tillDate],
    );
    return drepDelegations;
  }

  async isDrepRegistered(voterId: string) {
    const latestRegistration = await this.cexplorerService.manager.query(
      drepRegistrationQuery,
      [voterId],
    );

    const regDeposit = latestRegistration[0]?.deposit;

    return regDeposit === null || regDeposit > 0;
  }

  async getMetadata(voterId: string) {
    const metadataRes = await this.cexplorerService.manager.query(
      getDRepMetadataQuery,
      [voterId],
    );

    if (!metadataRes || !metadataRes?.[0].metadata) {
      throw new NotFoundException(
        `Metadata not found for voter ID: ${voterId}`,
      );
    }

    return metadataRes?.[0];
  }
}
