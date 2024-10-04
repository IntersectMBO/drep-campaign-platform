import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Note } from './note.entity';
import { Reaction } from './reaction.entity';
import { BaseEntity } from '../global';
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

  @Column({ nullable: false })
  voter: string;

  @OneToMany(() => Reaction, (reaction) => reaction.comment, {
    onDelete: 'CASCADE',
  })
  reactions: Reaction[];
}
