import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference extends BaseEntity {

  @Column({ type: 'uuid', unique: true })
  user_id!: string;

  @Column({ type: 'varchar', length: 100, default: 'en' })
  language!: string;

  @Column({ type: 'varchar', length: 50, default: 'light' })
  theme!: string;

  @Column({ type: 'boolean', default: true })
  email_notifications!: boolean;

  @Column({ type: 'boolean', default: false })
  push_notifications!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  default_resolution?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  default_model?: string;

  @Column({ type: 'boolean', default: false })
  nsfw_filter!: boolean;

  @Column({ type: 'boolean', default: false })
  show_in_gallery!: boolean;

  // Relations
  @OneToOne(() => User, (user) => user.user_preference)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
