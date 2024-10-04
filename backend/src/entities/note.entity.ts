import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Drep } from './drep.entity';
import { BaseEntity } from 'src/global';
import { Reaction } from './reaction.entity';

@Entity()
export class Note extends BaseEntity {
  @Column({ unique: true, nullable: false })
  note_title: string;

  @Column('simple-array', { nullable: true })
  note_tag: string[];

  @Column({ nullable: false })
  note_content: string;

  @ManyToOne(() => Drep, (drep) => drep.id)
  voter: Drep;

  @Column()
  note_visibility: string;

  @OneToMany(() => Reaction, (reaction) => reaction.note, {
    onDelete: 'CASCADE',
  })
  reactions: Reaction[];
}
