import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  ManyToMany,
} from 'typeorm';
import { Note } from './note.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from 'src/global';

enum ReactionTypeName {
  Like = 'like',
  ThumbsUp = 'thumbsup',
  ThumbsDown = 'thumbsdown',
  Rocket = 'rocket',
}
export enum ReactionParentEntityType {
  Note = 'note',
  Comment = 'comment',
}

@Entity()
@Unique(['voter', 'type', 'parentId', 'parentEntity']) // Ensures delegator can't react twice to the same parent entity
export class Reaction extends BaseEntity {
 

  @Column({
    type: 'enum',
    enum: ReactionTypeName,
    default: ReactionTypeName.Like,
    nullable: false,
  })
  type: ReactionTypeName;

  @Column({
    type: 'enum',
    enum: ReactionParentEntityType,
    default: ReactionParentEntityType.Note, // Set default value if needed
  })
  parentEntity: ReactionParentEntityType;

  @Column({ type: 'int', nullable: false })
  parentId: number;

  @ManyToOne(() => Comment, (comment) => comment.id ) // Many-to-One relationship with Comment
  comment: Comment;

  @ManyToMany(() => Note, (note) => note.id)
  note: Note;

  @Column({ nullable: false,  })
  voter: string;
  //timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
