import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';
import {
  AttachmentParentEntityType,
  AttachmentTypeName,
} from 'src/entities/attachment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource) {}
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
  async parseImageSize(buffer: Buffer, mimeType: string) {
    try {
      const optimizedImageBuffer = await Jimp.read(buffer)
        .then((image) => {
          return image
            .resize(480, 480)
            .quality(60)
            .getBufferAsync(this.parseJimpMimeType(mimeType));
        })
        .then((buffer) => {
          return buffer;
        });
      return optimizedImageBuffer;
    } catch (error) {
      console.log(error);
    }
  }
  async insertAttachment(attachment: any, mimeType: string, parentId: number) {
    try {
      const newAttachment = {
        url: attachment,
        parententity: AttachmentParentEntityType.DRep,
        parentid: parentId,
        attachmentType: await this.parseMimeType(mimeType),
      };
      await this.voltaireService.getRepository('Attachment').insert(newAttachment);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async updateAttachment(
    attachment: any,
    attachmentId: number,
    mimeType: string,
    parentId: number,
  ) {
    try {
      const newAttachment = {
        url: attachment,
        parententity: AttachmentParentEntityType.DRep,
        parentid: parentId,
        attachmentType: await this.parseMimeType(mimeType),
      };
      await this.voltaireService
        .getRepository('Attachment')
        .update(attachmentId, newAttachment);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
