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

@Entity()
export class Note {
  //auto increment primary key decorator
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  note_title: string;

  @Column({})
  note_tag: string;

  @Column({ nullable: false })
  note_content: string;

  @ManyToOne(() => Drep, (drep) => drep.voter_id)
  voter: Drep;

  @Column()
  note_visibility: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
