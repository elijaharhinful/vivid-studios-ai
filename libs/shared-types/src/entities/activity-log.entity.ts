import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entity_type?: string;

  @Column({ type: 'uuid', nullable: true })
  entity_id?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.activity_logs)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
