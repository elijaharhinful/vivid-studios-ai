import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from '../enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('credit_transactions')
export class CreditTransaction extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'enum', enum: TransactionType })
  transaction_type!: TransactionType;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ type: 'int' })
  balance_after!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference_id?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.credit_transactions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
