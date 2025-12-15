import {
  Entity,
  Column,
} from 'typeorm';
import { NotificationStatus, NotificationType } from '../enums';
import { BaseEntity } from './base.entity';

@Entity('notification_queue')
export class NotificationQueue extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'enum', enum: NotificationType })
  notification_type!: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status!: NotificationStatus;

  @Column({ type: 'int', default: 0 })
  retry_count!: number;

  @Column({ type: 'timestamp', nullable: true })
  sent_at?: Date;

  @Column({ type: 'text', nullable: true })
  error_message?: string;
}
