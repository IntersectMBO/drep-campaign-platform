import { Column, Entity, OneToMany } from 'typeorm';
import { Signature } from './signatures.entity';
import { BaseEntity } from 'src/global';

@Entity()
export class Drep extends BaseEntity {
  @Column({ type: 'json', nullable: true })
  social: Record<string, any>;
  @Column({ nullable: true })
  platform_statement: string;
  @Column({ nullable: true })
  expertise: string;
  @Column({ nullable: true })
  perspective: string;
  @OneToMany(() => Signature, (signature) => signature.drep)
  signatures: Signature[];
}
