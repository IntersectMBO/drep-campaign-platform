import { Injectable, NotFoundException } from '@nestjs/common';
import { createDrepDto } from 'src/dto';
import { faker } from '@faker-js/faker';
import { AttachmentService } from 'src/attachment/attachment.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DrepService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
    private attachmentService: AttachmentService,
  ) {}
  //get from cexplorer db
  async getAllDrepsCexplorer() {
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
              va.tx_id AS va_tx_id, 
              va.url, 
              va.data_hash, 
              va.type,
              sa.view AS stake_address,
              (
                  SELECT COUNT(*)
                  FROM delegation_vote
                  WHERE drep_hash_id = dh.id
              ) AS delegation_vote_count,
              ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS RowNum
          FROM 
              drep_hash AS dh
          JOIN 
              drep_distr AS dd ON dh.id = dd.hash_id
          LEFT JOIN 
              drep_registration AS dr ON dh.id = dr.drep_hash_id
          LEFT JOIN 
              voting_anchor AS va ON dr.voting_anchor_id = va.id
          LEFT JOIN 
              delegation_vote AS dv ON dh.id = dv.drep_hash_id 
          LEFT JOIN
              stake_address AS sa ON dv.addr_id = sa.id 
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
          RowNum = 1`,
    );
    const drepListInADA = drepList.map((entry) => {
      return {
        ...entry,
        deposit: (entry.deposit / 1000000).toFixed(1),
        amount: (entry.amount / 1000000).toFixed(1),
      };
    });

    return drepListInADA;
  }
  async getAllDRepsVoltaire() {
    return await this.voltaireService.getRepository('Drep').find();
  }
  async getAllDreps() {
    // get both dreps from voltaire and cexplorer matching drep.view from cexplorer with drep.voter_id from voltaire
    const drepList = await this.getAllDrepsCexplorer();
    const voltaireDreps = await this.getAllDRepsVoltaire();
    //add all fields from voltaire to cexplorer, if no matching, the field can be null
    const mergedDreps = drepList.map((drep) => {
      const voltaireDrep = voltaireDreps.find(
        (voltaireDrep) => voltaireDrep.voter_id === drep.view,
      );
      return {
        ...drep,
        ...voltaireDrep,
      };
    });
    return mergedDreps;
  }
  async getSingleDrepViaID(drepId: number) {
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

    if (!drep || drep.length === 0) {
      throw new NotFoundException('Drep not found!');
    }
    if (drep[0].attachment_url) {
      drep[0].attachment_url = await this.attachmentService.parseBufferToBase64(
        drep[0].attachment_url,
        drep[0].attachment_attachmentType,
      );
    }

    return drep[0];
  }
  async getSingleDrepViaVoterID(drepVoterId: string) {
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

    if (!drep || drep.length === 0) {
      throw new NotFoundException('Drep not found!');
    }
    if (drep[0].attachment_url) {
      drep[0].attachment_url = await this.attachmentService.parseBufferToBase64(
        drep[0].attachment_url,
        drep[0].attachemnt_attachmentType,
      );
    }

    return drep[0];
  }
  async populateFakeDRepData() {
    const dreps = await this.getAllDrepsCexplorer();
    //seeding`
    const modified = dreps.map((drep) => {
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
          profileUrl.buffer,
          profileUrl.mimetype,
        );
      await this.attachmentService.insertAttachment(
        optimizedProfileImageUrl,
        profileUrl.mimetype,
        insertedDrep.identifiers[0].id,
      );
    }
    const signatureDto = {
      drep: insertedDrep.identifiers[0].id,
      drepVoterId: drepDto?.voter_id,
      drepStakeKey: drepDto?.stake_addr,
    };
    const insertedSig = await this.voltaireService
      .getRepository('Signature')
      .insert(signatureDto);
    return { insertedDrep, insertedSig };
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
      .getMany();

    if (!foundDrep) {
      throw new NotFoundException('Drep to be updated not found!');
    }
    if (profileUrl) {
      const optimizedProfileImageBuffer =
        await this.attachmentService.parseImageSize(
          profileUrl.buffer,
          profileUrl.mimetype,
        );
      await this.attachmentService.updateAttachment(
        optimizedProfileImageBuffer,
        foundDrep[0].id,
        profileUrl.mimetype,
        drepId,
      );
    }
   if(drep.signature){
    await this.voltaireService.getRepository('Signature')
    .update({drep:foundDrep[0].id}, {drepSignatureKey:drep.key, drepSignature:drep.signature})
    delete drep.signature
    delete drep.key
    delete drep.stake_addr
    delete drep.voter_id
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
    delete updatedDrep['profileUrl']
    return await this.voltaireService
      .getRepository('Drep')
      .update(drepId, updatedDrep);
    
  }
}
