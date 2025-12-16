import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserRole, SubscriptionTier } from '../enums';
import { BaseEntity } from './base.entity';
import { Character } from './character.entity';
import { GenerationSession } from './generation-session.entity';
import { Collection } from './collection.entity';
import { CreditTransaction } from './credit-transaction.entity';
import { Subscription } from './subscription.entity';
import { UserPreference } from './user-preference.entity';
import { ActivityLog } from './activity-log.entity';
import { SharedImage } from './shared-image.entity';

@Entity('users')
export class User extends BaseEntity {

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  username!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  oauth_provider?: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  oauth_provider_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image_url?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'enum', enum: SubscriptionTier, default: SubscriptionTier.FREE })
  subscription_tier!: SubscriptionTier;

  @Column({ type: 'int', default: 0 })
  credits!: number;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  reset_token?: string | null;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  // Relations
  @OneToMany(() => Character, (character) => character.user)
  characters?: Character[];

  @OneToMany(() => GenerationSession, (session) => session.user)
  generation_sessions?: GenerationSession[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections?: Collection[];

  @OneToMany(() => CreditTransaction, (transaction) => transaction.user)
  credit_transactions?: CreditTransaction[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions?: Subscription[];

  @OneToOne(() => UserPreference, (preference) => preference.user)
  user_preference?: UserPreference;

  @OneToMany(() => ActivityLog, (log) => log.user)
  activity_logs?: ActivityLog[];

  @OneToMany(() => SharedImage, (sharedImage) => sharedImage.user)
  shared_images?: SharedImage[];
}
