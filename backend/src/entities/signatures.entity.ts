import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Drep } from './drep.entity';

@Entity()
export class Signature {
  //can belong to a Drep or voter
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Drep, (drep) => drep.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  drep: Drep;

  @Column({ nullable: true })
  voterId: string;

  @Column({ nullable: true })
  stakeKey: string;

  @Column({ nullable: true, unique: false, default: null })
  signature: string;

  @Column({ nullable: true, unique: false, default: null })
  signatureKey: string;
}
