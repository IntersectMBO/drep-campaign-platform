import { Entity, OneToMany } from 'typeorm';
import { Signature } from './signatures.entity';
import { BaseEntity } from '../global';

@Entity()
export class Drep extends BaseEntity {
  @OneToMany(() => Signature, (signature) => signature.drep)
  signatures: Signature[];
}
