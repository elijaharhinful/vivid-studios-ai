import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('pose_library')
export class PoseLibrary extends BaseEntity {

  @Column({ type: 'varchar', length: 255 })
  pose_name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255 })
  pose_image_url!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  difficulty?: string;

  @Column({ type: 'jsonb', nullable: true })
  keypoints?: Record<string, unknown>;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}
