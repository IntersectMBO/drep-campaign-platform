import { Injectable, NotFoundException } from '@nestjs/common';
import { createDrepDto } from 'src/dto';
import { faker } from '@faker-js/faker';
import { AttachmentService } from 'src/attachment/attachment.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ReactionsService } from 'src/reactions/reactions.service';
import { CommentsService } from 'src/comments/comments.service';
import { Delegation } from 'src/common/types';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class DrepService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
    private attachmentService: AttachmentService,
    private configService: ConfigService,
    private reactionsService: ReactionsService,
    private commentsService: CommentsService,
    private authService: AuthService,
  ) {}
  async getAllDReps(
    query?: string,
    currentPage?: number,
    itemsPerPage?: number,
    sortBy?: string,
    order?: string,
  ) {
    const nameFilteredDReps = query ? await this.getDRepsByName(query) : [];
    const nameFilteredDRepViews: string[] = nameFilteredDReps.map(
      (drep) => drep.signature_drepVoterId,
    );

    let sortColumn = null;
    let sortOrder = null;

    if (sortBy && sortBy === 'power') {
      sortColumn = 'amount';
    } else if (sortBy && sortBy === 'delegators') {
      sortColumn = 'delegation_vote_count';
    }

    if (order) sortOrder = order.toUpperCase();

    const drepList = await this.getAllDRepsCexplorer(
      query,
      currentPage,
      itemsPerPage,
      nameFilteredDRepViews,
      sortColumn,
      sortOrder,
    );

    const drepViews = drepList.data.map((drep) => drep.view);

    const voltaireDReps = await this.getVoltaireDRepsByViews(drepViews);

    const totalPages = Math.ceil(drepList.totalItems / itemsPerPage);

    const mergedDRepsData = drepList.data.map((drep) => {
      const voltaireDrep = voltaireDReps.find(
        (voltaireDrep) => voltaireDrep.signature_drepVoterId === drep.view,
      );
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
  ) {
    const offset = (currentPage - 1) * itemsPerPage;

    const sanitizedSearch = query ? query.replace(/'/g, "''") : '';

    let drepViewsCondition = '';
    if (nameFilteredDRepViews && nameFilteredDRepViews.length > 0) {
      drepViewsCondition = `OR dh.view IN (${nameFilteredDRepViews.map((v) => `'${v}'`).join(', ')})`;
    }

    let orderByClause = '';
    if (sortColumn && sortOrder) {
      const validSortColumns = ['delegation_vote_count', 'amount'];
      const validSortOrders = ['ASC', 'DESC'];

      if (
        validSortColumns.includes(sortColumn) &&
        validSortOrders.includes(sortOrder)
      ) {
        if (sortColumn === 'amount') {
          orderByClause = `ORDER BY COALESCE(${sortColumn}, 0) ${sortOrder}`;
        } else {
          orderByClause = `ORDER BY ${sortColumn} ${sortOrder}`;
        }
      }
    }

    const drepList = await this.cexplorerService.manager.query(
      `WITH RankedRows AS (
          SELECT 
              dh.id AS drep_hash_id, 
              dh.raw, 
              dh.view, 
              dh.has_script,
              dd.id AS drep_distr_id, 
              dd.hash_id, 
              dd.amount, 
              dd.epoch_no, 
              dd.active_until,
              dr.id AS drep_registration_id, 
              dr.tx_id, 
              dr.cert_index, 
              dr.deposit, 
              dr.drep_hash_id AS reg_drep_hash_id, 
              dr.voting_anchor_id AS reg_voting_anchor_id,  
              va.id AS voting_anchor_id, 
              va.url, 
              va.data_hash, 
              va.type,
              sa.view AS stake_address,
              (
                SELECT COUNT(DISTINCT dv.addr_id)
                FROM delegation_vote dv
                WHERE dv.drep_hash_id = dh.id
            ) AS delegation_vote_count,
              ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS RowNum
          FROM 
              drep_hash AS dh
          LEFT JOIN 
              drep_distr AS dd ON dh.id = dd.hash_id
          LEFT JOIN 
              drep_registration AS dr ON dh.id = dr.drep_hash_id
          LEFT JOIN 
              voting_anchor AS va ON dr.voting_anchor_id = va.id
          LEFT JOIN 
              delegation_vote AS dv ON dh.id = dv.drep_hash_id 
          LEFT JOIN
              stake_address AS sa ON dv.addr_id = sa.id
          WHERE
              dh.view ILIKE '%${sanitizedSearch}%' 
              ${drepViewsCondition}
      )
      SELECT 
          drep_hash_id,
          view,
          delegation_vote_count,
          stake_address,
          amount,
          epoch_no,
          active_until,
          deposit,
          url,
          type
      FROM 
          RankedRows
      WHERE 
          RowNum = 1
      ${orderByClause}
      LIMIT ${itemsPerPage} OFFSET ${offset}`,
    );

    const totalResults = await this.cexplorerService.manager.query(
      `SELECT COUNT(*) AS total FROM drep_hash AS dh WHERE dh.view ILIKE '%${sanitizedSearch}%' ${drepViewsCondition}`,
    );

    return {
      data: drepList.map((entry) => {
        return {
          ...entry,
          deposit: (entry.deposit / 1000000).toFixed(1),
          amount: (entry.amount / 1000000).toFixed(1),
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
      .where('signature.drepVoterId IN (:...views)', { views })
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
  async getSingleDrepViaID(
    drepId: number,
    stakeKeyBech32?: string,
    delegation?: Delegation,
    startDateCursor?: number,
    endDateCursor?: number,
  ) {
    const drep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect(
        'attachment',
        'attachment',
        'attachment.parentEntity = :parentEntity AND attachment.parentId = drep.id',
        { parentEntity: 'drep' },
      )
      .leftJoinAndSelect('signature', 'signature', 'signature.drepId = drep.id')
      .where('drep.id = :drepId', { drepId })
      .getRawMany();
    let drepVoterId;
    if (drep.length > 0) drepVoterId = drep[0].signature_drepVoterId;
    const drepCexplorer = await this.getDrepCexplorerDetails(drepVoterId);
    const drepVotingHistory = await this.getDrepTimeline(
      drep[0].drep_id,
      drepVoterId,
      stakeKeyBech32,
      delegation,
      startDateCursor,
      endDateCursor,
    );
    const drepDelegators =
      await this.getDrepDelegatorsWithVotingPower(drepVoterId);
    const combinedResult = {
      ...drep[0],
      cexplorerDetails: drepCexplorer,
      activity: drepVotingHistory,
      delegators: drepDelegators,
    };
    if (
      (!drep || drep.length === 0) &&
      (!drepCexplorer || drepCexplorer.length === 0)
    ) {
      throw new NotFoundException('Drep not found!');
    }
    if (combinedResult.attachment_url) {
      combinedResult.attachment_url =
        await this.attachmentService.parseBufferToBase64(
          combinedResult.attachment_url,
          combinedResult.attachment_attachmentType,
        );
    }

    return combinedResult;
  }
  async getSingleDrepViaVoterID(
    drepVoterId: string,
    stakeKeyBech32?: string,
    delegation?: Delegation,
    startDateCursor?: number,
    endDateCursor?: number,
  ) {
    const drep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect(
        'attachment',
        'attachment',
        'attachment.parentEntity = :parentEntity AND attachment.parentId = drep.id',
        { parentEntity: 'drep' },
      )
      .leftJoinAndSelect('signature', 'signature', 'signature.drepId = drep.id')
      .where('signature.drepVoterId = :drepVoterId', { drepVoterId })
      .getRawMany();
    const drepCexplorer = await this.getDrepCexplorerDetails(drepVoterId);
    const drepVotingHistory = await this.getDrepTimeline(
      drep[0]?.drep_id,
      drepVoterId,
      stakeKeyBech32,
      delegation,
      startDateCursor,
      endDateCursor,
    );
    const drepDelegators =
      await this.getDrepDelegatorsWithVotingPower(drepVoterId);
    const combinedResult = {
      ...drep[0],
      cexplorerDetails: drepCexplorer,
      activity: drepVotingHistory,
      delegators: drepDelegators,
    };
    if (
      (!drep || drep.length === 0) &&
      (!drepCexplorer || drepCexplorer.length === 0)
    ) {
      throw new NotFoundException('Drep not found!');
    }
    if (combinedResult.attachment_url) {
      combinedResult.attachment_url =
        await this.attachmentService.parseBufferToBase64(
          combinedResult.attachment_url,
          combinedResult.attachment_attachmentType,
        );
    }

    return combinedResult;
  }
  async getDrepCexplorerDetails(drepVoterId: string) {
    //also get his details from cexplorer
    const viewParam = drepVoterId;
    const drepCexplorer = await this.cexplorerService.manager.query(
      `WITH RankedRows AS (
              SELECT 
                  dh.id AS drep_hash_id, 
                  dh.raw, 
                  dh.view, 
                  dh.has_script,
                  dd.id AS drep_distr_id, 
                  dd.hash_id, 
                  dd.amount, 
                  dd.epoch_no, 
                  dd.active_until,
                  dr.id AS drep_registration_id, 
                  dr.tx_id, 
                  dr.cert_index, 
                  dr.deposit, 
                  dr.drep_hash_id AS reg_drep_hash_id, 
                  dr.voting_anchor_id AS reg_voting_anchor_id,  
                  va.id AS voting_anchor_id, 
                  va.url, 
                  reg_tx_bk.time AS date_of_registration,
                  reg_tx_bk.epoch_no AS epoch_of_registration,
                  va.data_hash, 
                  va.type,
                  sa.view AS stake_address,
                  (
                    SELECT COUNT(DISTINCT dv.addr_id)
                    FROM delegation_vote dv
                    WHERE dv.drep_hash_id = dh.id
                  ) AS delegation_vote_count,
                  ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS RowNum
              FROM 
                  drep_hash AS dh
              LEFT JOIN 
                  drep_distr AS dd ON dh.id = dd.hash_id
              LEFT JOIN 
                  drep_registration AS dr ON dh.id = dr.drep_hash_id
              LEFT JOIN 
                  voting_anchor AS va ON dr.voting_anchor_id = va.id
              LEFT JOIN 
                  delegation_vote AS dv ON dh.id = dv.drep_hash_id 
              LEFT JOIN 
                  tx AS reg_tx ON dr.tx_id = reg_tx.id 
              LEFT JOIN 
                  block AS reg_tx_bk ON reg_tx.block_id = reg_tx_bk.id 
              LEFT JOIN
                  stake_address AS sa ON dv.addr_id = sa.id 
              WHERE 
                  dh.view = $1
          )
          SELECT 
              drep_hash_id,
              view,
              delegation_vote_count,
              stake_address,
              amount,
              epoch_no,
              active_until,
              deposit,
              date_of_registration,
              epoch_of_registration,
              url,
              type
          FROM 
              RankedRows
          WHERE 
              RowNum = 1`,
      [viewParam],
    );
    return drepCexplorer[0];
  }
  async getDrepDateofRegistration(drepVoterId: string) {
    const viewParam = drepVoterId;
    const drepRegistrationData = await this.cexplorerService.manager.query(
      `WITH RankedRows AS (
          SELECT 
              dh.id AS drep_hash_id, 
              reg_tx_bk.time AS date_of_registration,
              reg_tx_bk.epoch_no AS epoch_of_registration,
              ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS RowNum
          FROM 
              drep_hash AS dh
          LEFT JOIN 
              drep_distr AS dd ON dh.id = dd.hash_id
          LEFT JOIN 
              drep_registration AS dr ON dh.id = dr.drep_hash_id
          LEFT JOIN 
              voting_anchor AS va ON dr.voting_anchor_id = va.id
          LEFT JOIN 
              delegation_vote AS dv ON dh.id = dv.drep_hash_id 
          LEFT JOIN 
              tx AS reg_tx ON dr.tx_id = reg_tx.id 
          LEFT JOIN 
              block AS reg_tx_bk ON reg_tx.block_id = reg_tx_bk.id 
          LEFT JOIN
              stake_address AS sa ON dv.addr_id = sa.id 
          WHERE 
              dh.view = $1
      )
      SELECT 
          date_of_registration,
          epoch_of_registration
      FROM 
          RankedRows
      WHERE 
          RowNum = 1`,
      [viewParam],
    );
    return drepRegistrationData[0];
  }
  async getDrepTimeline(
    drepId: number,
    drepVoterId: string,
    stakeKeyBech32?: string,
    delegation?: Delegation,
    beforeDate?: number,
    tillDate?: number,
  ) {
    //get current time in timestamp form then backtrack till the time the drep is registered
    //limit activity to three epochs or five days=>432000seconds
    //get epochs
    //get voting activity
    //get notes
    // TODO: get delegating activity across a certain epoch
    const startingTime = beforeDate ? new Date(Number(beforeDate)) : new Date();
    const endingTime = tillDate
      ? new Date(Number(tillDate))
      : new Date(new Date(startingTime).getTime() - 432000000); // 5 days ago
      console.log(startingTime, endingTime)
    const epochs = await this.getEpochs(startingTime, endingTime);
    const drepRegData = await this.getDrepDateofRegistration(drepVoterId);
    const regDate = new Date(drepRegData?.date_of_registration).getTime();
    const drepVotingHistory = await this.getDrepVotingActivity(
      drepVoterId,
      startingTime,
      endingTime,
    );
    let drepNotes = [];

    // Retrieve notes if drepId is defined
    if (drepId) {
      drepNotes = await this.getDRepNotes(
        drepId,
        startingTime,
        endingTime,
        stakeKeyBech32,
        delegation,
      );
    }
    const drepActivity = [
      ...epochs.map((epoch) => ({
        ...epoch,
        type: 'epoch',
        timestamp: epoch.start_time,
      })),
      ...drepVotingHistory.map((vote) => ({
        ...vote,
        type: 'voting_activity',
        timestamp: vote.time_voted,
      })),
      ...drepNotes.map((note) => ({
        ...note,
        type: 'note',
        timestamp: note.note_createdAt,
      })),
    ];
    // Add the registration event if it falls within the time range
    if (startingTime.getTime() > regDate && endingTime.getTime() < regDate) {
      drepActivity.push({
        type: 'registration',
        timestamp: drepRegData.date_of_registration,
        epoch_no: drepRegData.epoch_of_registration,
      });
    }
    // Sort the combined array by timestamp from latest to earliest
    drepActivity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return drepActivity;
  }

  async getEpochs(beforeDate: Date, tillDate: Date) {
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
  ) {
    const viewParam = drepVoterId;

    // Convert the start and end times from seconds to timestamps
    const drepVotingHistory = (await this.cexplorerService.manager.query(
      `SELECT  
          dh.view, 
          encode(prop_creation_tx.hash, 'hex') AS gov_action_proposal_id,
          prop_creation_bk.time AS prop_inception,
          gp.description,
          vp.vote,
          bk.time AS time_voted,
          prop_creation_bk.epoch_no AS proposal_epoch,
          bk.epoch_no AS voting_epoch
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
      WHERE
          dh.view = $1
          AND bk.time::DATE BETWEEN $3::DATE AND $2::DATE
      ORDER BY 
          bk.epoch_no`,
      [viewParam, beforeDate, tillDate],
    )) as any[];

    return drepVotingHistory.map((item) => {
      return {
        ...item,
        type: 'voting_activity',
        gov_action_proposal_id: item.gov_action_proposal_id,
      };
    });
  }
  async getDRepNotes(
    drepId: number,
    beforeDate: Date,
    tillDate: Date,
    stakeKeyBech32?: string,
    delegation?: any,
  ) {
    const queryBuilder = await this.voltaireService
      .getRepository('Note')
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.voter', 'drep')
      .leftJoin('drep.signatures', 'signature')
      .where('note.voterId = :drepId', { drepId })
      .andWhere(
        'note."createdAt"::DATE BETWEEN :tillDate::DATE AND :beforeDate::DATE',
        {
          beforeDate,
          tillDate,
        },
      );

    // Basic query for notes with visibility 'everyone'
    queryBuilder.andWhere('note.note_visibility = :everyone', {
      everyone: 'everyone',
    });

    // 'delegators' visibility
    if (delegation) {
      queryBuilder.orWhere(
        'note.note_visibility = :delegators AND signature.drepVoterId = :drepVoterId',
        {
          delegators: 'delegators',
          drepVoterId: delegation.drep_view,
        },
      );
    }

    // 'myself' visibility
    if (stakeKeyBech32) {
      queryBuilder.orWhere(
        'note.note_visibility = :myself AND signature.drepStakeKey = :stakeKeyBech32',
        {
          myself: 'myself',
          stakeKeyBech32: stakeKeyBech32,
        },
      );
    }

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
  async registerDrep(drepDto: createDrepDto, profileUrl: Express.Multer.File) {
    const insertedDrep = await this.voltaireService
      .getRepository('Drep')
      .insert(drepDto);
    if (profileUrl) {
      const optimizedProfileImageUrl =
        await this.attachmentService.parseImageSize(
          profileUrl,
          profileUrl.mimetype,
        );
      await this.attachmentService.insertAttachment(
        optimizedProfileImageUrl,
        profileUrl.mimetype,
        insertedDrep.identifiers[0].id,
        'drep',
      );
    }
    const signatureDto = {
      drep: insertedDrep.identifiers[0].id,
      drepVoterId: drepDto?.voter_id,
      drepStakeKey: drepDto?.stake_addr,
      drepSignatureKey: drepDto?.key,
      drepSignature: drepDto?.signature,
    };
    const insertedSig = await this.voltaireService
      .getRepository('Signature')
      .insert(signatureDto);
    const { token } = await this.authService.login(
      { signature: drepDto?.signature, key: drepDto.key },
      10000,
    );
    return { insertedDrep, insertedSig, token };
  }
  async getEpochParams() {
    try {
      const APIURL =
        'https://cardano-sanchonet.blockfrost.io/api/v0/epochs/latest/parameters';
      const response = await axios.get(APIURL, {
        headers: {
          project_id: this.configService.get<string>(
            'BLOCKFROST_SANCHONET_PROJECT_ID',
          ),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async getDrepDelegatorsWithVotingPower(drepVoterId: string) {
    // Step 1: Get the delegators and their delegation epoch
    const drepDelegators = await this.cexplorerService.manager.query(
      `SELECT 
          sa.view AS stake_address,
          b.epoch_no AS delegation_epoch
       FROM 
          drep_hash AS dh
       JOIN 
          delegation_vote AS dv ON dh.id = dv.drep_hash_id
       JOIN 
          stake_address sa ON dv.addr_id = sa.id
       JOIN 
          tx ON dv.tx_id = tx.id
       JOIN 
          block b ON tx.block_id = b.id
       WHERE 
          dh.view = $1`,
      [drepVoterId],
    );

    // Step 2: Remove duplicates and keep track of delegation epochs
    const uniqueDelegatorsMap = new Map<string, number>();
    drepDelegators.forEach((delegator) => {
      uniqueDelegatorsMap.set(
        delegator.stake_address,
        delegator.delegation_epoch,
      );
    });

    // Step 3: Calculate voting power for each unique delegator
    const delegatorsWithVotingPower = await Promise.all(
      Array.from(uniqueDelegatorsMap).map(
        async ([stakeAddress, delegationEpoch]) => {
          const votingPowerResult = await this.cexplorerService.manager.query(
            `SELECT 
            SUM(uv.value) AS total_stake
         FROM 
            utxo_view uv
         JOIN 
            stake_address sa ON uv.stake_address_id = sa.id
         WHERE 
            sa.view = $1
         GROUP BY 
            sa.view;`,
            [stakeAddress],
          );

          let totalStakeInAda = 0;
          if (votingPowerResult.length > 0) {
            const totalStakeInLovelace = parseInt(
              votingPowerResult[0].total_stake,
              10,
            );
            totalStakeInAda = totalStakeInLovelace / 1000000;
          }

          return {
            stakeAddress,
            delegationEpoch,
            votingPower: totalStakeInAda,
          };
        },
      ),
    );
    //sort from highest epoch
    delegatorsWithVotingPower.sort(
      (a, b) => b.delegationEpoch - a.delegationEpoch,
    );

    return delegatorsWithVotingPower;
  }

  async updateDrepInfo(
    drepId: number,
    drep: createDrepDto,
    profileUrl: Express.Multer.File,
  ) {
    const foundDrep = await this.voltaireService
      .getRepository('Drep')
      .createQueryBuilder('drep')
      .leftJoinAndSelect(
        'attachment',
        'attachment',
        'attachment.parentEntity = :parentEntity AND attachment.parentId = drep.id',
        { parentEntity: 'drep' },
      )
      .where('drep.id = :drepId', { drepId })
      .getRawMany();

    if (!foundDrep) {
      throw new NotFoundException('Drep to be updated not found!');
    }
    if (profileUrl) {
      const optimizedProfileImageBuffer =
        await this.attachmentService.parseImageSize(
          profileUrl,
          profileUrl.mimetype,
        );
      await this.attachmentService.updateAttachment(
        optimizedProfileImageBuffer,
        foundDrep[0].attachment_id,
        profileUrl.mimetype,
        drepId,
        'drep',
      );
    }
    if (drep.signature) {
      await this.voltaireService
        .getRepository('Signature')
        .update(
          { drep: foundDrep[0].drep_id },
          { drepSignatureKey: drep.key, drepSignature: drep.signature },
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
    delete updatedDrep['profileUrl'];
    return await this.voltaireService
      .getRepository('Drep')
      .update(drepId, updatedDrep);
  }
}
