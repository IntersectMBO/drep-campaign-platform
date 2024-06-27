import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from './note.entity';
import { Delegator } from './delegator.entity';
import { BaseEntity } from 'src/global';
export enum CommentParentEntityType {
  Note = 'note',
  Comment = 'comment',
}
@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: CommentParentEntityType,
    default: CommentParentEntityType.Note, // Set default value if needed
  })
  parentEntity: CommentParentEntityType;

  @Column({ type: 'int', nullable: false })
  parentId: number;

  @ManyToOne(() => Note, (note) => note.id) // Many-to-One relationship with Note
  note: Note;

  @ManyToOne(() => Comment, (comment) => comment.id) // Many-to-One relationship with Comment
  comment: Comment;

  @ManyToOne(() => Delegator, (delegator) => delegator.id) // Many-to-One relationship with Delegator
  delegator: Delegator;

}
