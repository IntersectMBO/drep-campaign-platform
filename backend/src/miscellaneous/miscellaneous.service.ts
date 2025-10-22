import { HttpException, Injectable} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlockfrostService } from 'src/blockfrost/blockfrost.service';
import { BlockfrostBlockRes, NodeBlockRes } from 'src/common/types';
import { getLatestBlock } from 'src/queries/getLatestBlock';
import { DataSource } from 'typeorm';

@Injectable()
export class MiscellaneousService  {
  constructor(
    @InjectDataSource('dbsync')
    private cexplorerService: DataSource,
    private blockfrostService: BlockfrostService,
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

  async checkTxExists(hash: string) {
    const tx = await this.cexplorerService.manager.query(
      `SELECT id, SUBSTRING(CAST(tx.hash AS TEXT) FROM 3) AS tx_hash 
       FROM "tx" 
       WHERE "hash" = decode($1, 'hex');`,
      [hash],
    );

    return tx[0]?.tx_hash ? true : false;
  }
  async getNodeStatus() {
    try {
      const nodeLatestBlock: [NodeBlockRes] =
        await this.cexplorerService.manager.query(getLatestBlock);
      //compare with the latest block from a blockfrost API or any other API
      const confirmationLatestBlock: BlockfrostBlockRes =
        await this.blockfrostService.getLatestBlock();
      //compare the block number
      return {
        ...nodeLatestBlock[0],
        behindBy: confirmationLatestBlock.height - nodeLatestBlock[0].block_no,
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to get the node sync tip status', 500);
    }
  }
}
