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
import { BaseEntity } from 'src/global';

@Entity()
export class Drep extends BaseEntity {
 
  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  metadata: string;
  @Column({ type: 'json', nullable: true })
  social: Record<string, any>;

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

}
