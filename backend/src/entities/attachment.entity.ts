import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from './note.entity';
import { Drep } from './drep.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from 'src/global';
export enum AttachmentTypeName {
  Link = 'link',
  PDF = 'pdf',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
  SVG = 'svg',
}

export enum AttachmentParentEntityType {
  DRep = 'drep',
  Note = 'note',
  Comment = 'comment',
}
@Entity()
export class Attachment  extends BaseEntity {

  @Column({ type: 'bytea' })
  url: Uint8Array;

  @Column({
    type: 'enum',
    enum: AttachmentParentEntityType,
    default: AttachmentParentEntityType.DRep,
  })
  parententity: AttachmentParentEntityType;

  @Column({ type: 'int', nullable: false })
  parentid: number;

  @ManyToOne(() => Note, (note) => note.id)
  note: Note;

  @ManyToOne(() => Drep, (drep) => drep.id)
  drep: Drep;

  @ManyToOne(() => Comment, (comment) => comment.id)
  comment: Comment;

  @Column({
    type: 'enum',
    enum: AttachmentTypeName,
    default: AttachmentTypeName.Link,
  })
  attachmentType: AttachmentTypeName;
}
