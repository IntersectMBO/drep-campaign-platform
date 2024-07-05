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
import { Signature } from './signatures.entity';

@Entity()
export class Drep {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Signature, (signature) => signature.drep)
  signatures: Signature[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
