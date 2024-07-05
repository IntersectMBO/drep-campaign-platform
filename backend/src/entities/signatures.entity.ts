import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Drep } from './drep.entity';

@Entity()
export class Signature {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Drep, (drep) => drep.id, { onDelete: 'CASCADE' })
  drep: number;
  @Column()
  drepVoterId: string;
  @Column()
  drepStakeKey: string;
  @Column({ nullable: true, unique: false, default: null })
  drepSignature: string;
  @Column({ nullable: true, unique: false, default: null })
  drepSignatureKey: string;
}
