import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from './note.entity';

@Entity()
export class Drep {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  platform_statement: string;

  @Column({ nullable: true })
  expertise: string;

  @Column({ nullable: true })
  perspective: string;

  @Column({})
  stake_addr: string;

  @Column({ nullable: false, unique: true })
  voter_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
