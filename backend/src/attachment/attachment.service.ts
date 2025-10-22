import { HttpException, Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import {
  Attachment,
  AttachmentParentEntityType,
  AttachmentTypeName,
} from 'src/entities/attachment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import {
  IPFSPinResponse,
  IPFSPinStatusResponse,
  IPFSResponse,
} from 'src/common/types';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { BlockfrostService } from 'src/blockfrost/blockfrost.service';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    private httpService: HttpService,
    private blockfrostService: BlockfrostService,
  ) {}
  async parseMimeType(mimeType: string) {
    switch (mimeType) {
      case 'image/png':
        return AttachmentTypeName.PNG;
      case 'image/jpg':
        return AttachmentTypeName.JPG;
      case 'image/jpeg':
        return AttachmentTypeName.JPG;
      case 'image/gif':
        return AttachmentTypeName.GIF;
      case 'image/svg':
        return AttachmentTypeName.SVG;
      case 'image/svg+xml':
        return AttachmentTypeName.SVG;
      case 'image/webp':
        return AttachmentTypeName.WEBP;
      case 'application/pdf':
        return AttachmentTypeName.PDF;
      default:
        return AttachmentTypeName.Link;
    }
  }
  async parseBufferToBase64(buffer: Buffer, mimeType: string) {
    const raw = Buffer.from(buffer).toString('base64');
    const url = `data:image/${mimeType};base64,${raw}`;
    return url;
  }
  parseJimpMimeType(mimeType: string) {
    switch (mimeType) {
      case 'image/png':
        return Jimp.MIME_PNG;
      case 'image/jpg':
        return Jimp.MIME_JPEG;
      case 'image/jpeg':
        return Jimp.MIME_JPEG;
      case 'image/gif':
        return Jimp.MIME_GIF;
      default:
        return Jimp.MIME_PNG;
    }
  }
  async parseImageSize(file: Express.Multer.File, mimeType: string) {
    try {
      const optimizedImageBuffer = await Jimp.read(file.buffer)
        .then((image) => {
          return image
            .resize(480, 480)
            .quality(60)
            .getBufferAsync(this.parseJimpMimeType(mimeType));
        })
        .then((buffer) => {
          return buffer;
        });
      return { ...file, buffer: optimizedImageBuffer };
    } catch (error) {
      console.log(error);
    }
  }
  parseEntityType(entityType: string) {
    switch (entityType) {
      case 'drep':
        return AttachmentParentEntityType.DRep;
      case 'note':
        return AttachmentParentEntityType.Note;
      case 'comment':
        return AttachmentParentEntityType.Comment;
      default:
        return AttachmentParentEntityType.DRep;
    }
  }
  async insertAttachment(
    attachment: Express.Multer.File,
    mimeType: string,
    parentId: number,
    parentEntity: string,
  ) {
    try {
      const newAttachment = {
        url: attachment.buffer,
        name: attachment.originalname,
        parententity: this.parseEntityType(parentEntity),
        parentid: !String(parentId).includes('null') ? parentId : null,
        attachmentType: await this.parseMimeType(mimeType),
      };

      const attachmentRepo =
        await this.voltaireService.getRepository('Attachment');
      const createdAttachment = attachmentRepo.create(newAttachment);
      const res = (await attachmentRepo.save(createdAttachment)) as Attachment;
      return res;
    } catch (error) {
      //duplicate key value violates unique constraint
      if (error.code === '23505') {
        try {
          const existingAttachment = await this.voltaireService
            .getRepository('Attachment')
            .findOneBy({ name: attachment.originalname });
          return existingAttachment;
        } catch (findError) {
          console.log('Error finding existing attachment:', findError);
          throw findError;
        }
      } else {
        console.log('Error inserting attachment:', error);
        throw error;
      }
    }
  }

  async getSingleAttachment(attachmentId: number) {
    try {
      const attachment = await this.voltaireService
        .getRepository('Attachment')
        .findOneBy({ id: attachmentId });
      return attachment;
    } catch (error) {
      console.log(error);
    }
  }
  async getSingleAttachmentByName(attachmentName: string) {
    try {
      const attachment = await this.voltaireService
        .getRepository('Attachment')
        .findOneBy({ name: attachmentName });
      return attachment;
    } catch (error) {
      console.log(error);
    }
  }
  async updateAttachment(
    attachment: any,
    attachmentId: number,
    mimeType: string,
    parentId: number,
    parentEntity: string,
  ) {
    try {
      const newAttachment = {
        url: attachment,
        parententity: this.parseEntityType(parentEntity),
        parentid: parentId,
        attachmentType: await this.parseMimeType(mimeType),
      };
      if (attachmentId) {
        await this.voltaireService
          .getRepository('Attachment')
          .update(attachmentId, newAttachment);
      } else
        await this.insertAttachment(
          attachment,
          mimeType,
          parentId,
          parentEntity,
        );
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAttachment(attachmentId: number) {
    try {
      await this.voltaireService
        .getRepository('Attachment')
        .delete(attachmentId);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async uploadAttachmentToIPFS(
    attachment: Express.Multer.File | Buffer | Uint8Array | Blob | FormData,
  ): Promise<IPFSResponse> {
    try {
      const res = await lastValueFrom(
        this.httpService.post(
          `${this.blockfrostService.blockfrostIPFSURL}/api/v0/ipfs/add`,
          attachment,
          {
            headers: {
              project_id: this.blockfrostService.blockfrostIPFSProjectID,
            },
          },
        ),
      );
      const ipfsRes = res.data as IPFSResponse;
      //then auto-pin the attachment
      const ipfsPinStatus = (await this.pinAttachmentToIPFS(
        ipfsRes.ipfs_hash,
      )) as IPFSPinResponse;
      return {
        ...ipfsRes,
        state: ipfsPinStatus.state,
      };
    } catch (error) {
      console.error(error.response.data || error.response || error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  async pinAttachmentToIPFS(hash: string): Promise<IPFSPinResponse> {
    try {
      const res = await lastValueFrom(
        this.httpService.post(
          `${this.blockfrostService.blockfrostIPFSURL}/api/v0/ipfs/pin/add/${hash}`,
          {},
          {
            headers: {
              project_id: this.blockfrostService.blockfrostIPFSProjectID,
            },
          },
        ),
      );
      return res.data;
    } catch (error) {
      console.error(error.response.data || error.response || error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  async checkPinStatus(hash: string): Promise<IPFSPinStatusResponse> {
    try {
      const res = await lastValueFrom(
        this.httpService.get(
          `${this.blockfrostService.blockfrostIPFSURL}/api/v0/ipfs/pin/list/${hash}`,
          {
            headers: {
              project_id: this.blockfrostService.blockfrostIPFSProjectID,
            },
          },
        ),
      );
      return res.data;
    } catch (error) {
      console.error(error.response.data || error.response || error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  async unpinAttachmentFromIPFS(hash: string): Promise<IPFSPinResponse> {
    try {
      const res = await lastValueFrom(
        this.httpService.post(
          `${this.blockfrostService.blockfrostIPFSURL}/api/v0/ipfs/pin/remove/${hash}`,
          {},
          {
            headers: {
              project_id: this.blockfrostService.blockfrostIPFSProjectID,
            },
          },
        ),
      );
      return res.data;
    } catch (error) {
      console.error(error.response.data || error.response || error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
  async getAttachmentFromIPFS(hash: string, res: Response): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.blockfrostService.blockfrostIPFSURL}/api/v0/ipfs/gateway/${hash}`,
          {
            headers: {
              project_id: this.blockfrostService.blockfrostIPFSProjectID,
            },
            responseType: 'stream', // Used stream to handle large files or non-JSON data
          },
        ),
      );

      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value as string);
      }
      // Stream the data directly to the client
      return response.data.pipe(res);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.response.statusText || 'An error occured',
        error.response.status,
      );
    }
  }
}
