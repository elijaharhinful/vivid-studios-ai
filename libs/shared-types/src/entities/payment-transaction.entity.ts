import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentStatus, PaymentMethod } from '../enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  subscription_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method!: PaymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_payment_intent_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_charge_id?: string;

  @Column({ type: 'text', nullable: true })
  failure_reason?: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
