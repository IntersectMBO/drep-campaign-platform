import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Drep } from './drep.entity';
import { BaseEntity } from 'src/global';

@Entity()
export class Note extends BaseEntity {


  @Column({ unique: true, nullable: false })
  note_title: string;

  @Column({})
  note_tag: string;

  @Column({ nullable: false })
  note_content: string;

  @ManyToOne(() => Drep, (drep) => drep.id)
  voter: Drep;

  @Column()
  note_visibility: string;


}
