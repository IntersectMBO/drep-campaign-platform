import { BaseEntity } from 'src/global';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Delegator extends BaseEntity {

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  voter_id: string;

}
