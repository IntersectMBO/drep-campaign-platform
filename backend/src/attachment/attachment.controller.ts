import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { Response } from 'express';
import { Attachment } from 'src/entities/attachment.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('attachments')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}
  @Get(':attachmentName')
  async getAttachment(
    @Param('attachmentName') name: string,
    @Res() res: Response,
  ): Promise<StreamableFile | any> {
    //pipe the attachment
    const attachment = (await this.attachmentService.getSingleAttachmentByName(
      name,
    )) as Attachment;
    if (!attachment) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Attachment not found' });
    }
    res.setHeader('Content-Type', attachment.attachmentType);
    //set inline for images, otherwise download eg pdf
    // if (attachment.attachmentType.includes('pdf')) {
    //   res.setHeader(
    //     'Content-Disposition',
    //     `attachment; filename=${attachment.name}`,
    //   );
    // } else {
    // }
    res.setHeader('Content-Disposition', `inline; filename=${attachment.name}`);
    return res.send(attachment.url);
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('attachment'))
  async addAttachment(
    @UploadedFile() attachment: Express.Multer.File,
    @Body('parentId') parentId: number,
    @Body('parentEntity') parentEntity: string,
  ) {
    return this.attachmentService.insertAttachment(
      attachment,
      attachment.mimetype,
      parentId,
      parentEntity,
    );
  }
  @Get('ipfs/:ipfsHash')
  async getAttachmentByIpfsHash(
    @Param('ipfsHash') ipfsHash: string,
    @Res() res: Response,
  ) {
    return this.attachmentService.getAttachmentFromIPFS(ipfsHash, res);
  }
  @Post('ipfs/add')
  @UseInterceptors(FileInterceptor('attachment'))
  async uploadAttachmentToIpfs(
    @UploadedFile()
    attachment: Express.Multer.File,
  ) {
    const attachmentFormData = new FormData();
    // Check if attachment is a File or has a buffer
    if (attachment instanceof File) {
      attachmentFormData.append('attachment', attachment, attachment.name);
    } else if (attachment.buffer) {
      // Convert buffer to Blob
      const blob = new Blob([attachment.buffer], { type: attachment.mimetype });
      attachmentFormData.append('attachment', blob, attachment.originalname);
    } else {
      throw new Error('Invalid attachment format');
    }
    console.log(attachmentFormData);
    return this.attachmentService.uploadAttachmentToIPFS(attachmentFormData);
  }
}
