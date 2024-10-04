import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/global';
import { Drep } from './drep.entity';

@Entity()
export class Metadata extends BaseEntity {
  @Column({ nullable: false, unique: true })
  name: string;
  @Column({ nullable: false })
  hash: string;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Drep, (drep) => drep.id)
  drep: Drep;
}
