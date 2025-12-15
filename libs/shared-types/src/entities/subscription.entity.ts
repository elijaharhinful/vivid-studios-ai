import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubscriptionStatus, SubscriptionTier } from '../enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'enum', enum: SubscriptionTier })
  tier!: SubscriptionTier;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status!: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  start_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  next_billing_date?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_subscription_id?: string;

  @Column({ type: 'boolean', default: true })
  auto_renew!: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
