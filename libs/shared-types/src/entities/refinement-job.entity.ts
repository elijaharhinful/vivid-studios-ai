import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefinementStatus, RefinementType } from '../enums';
import { BaseEntity } from './base.entity';
import { GeneratedImage } from './generated-image.entity';

@Entity('refinement_jobs')
export class RefinementJob extends BaseEntity {

  @Column({ type: 'uuid' })
  original_image_id!: string;

  @Column({ type: 'enum', enum: RefinementType })
  refinement_type!: RefinementType;

  @Column({ type: 'enum', enum: RefinementStatus, default: RefinementStatus.PENDING })
  status!: RefinementStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refined_image_url?: string;

  @Column({ type: 'jsonb', nullable: true })
  refinement_parameters?: Record<string, unknown>;

  @Column({ type: 'int', nullable: true })
  credits_used?: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  // Relations
  @ManyToOne(() => GeneratedImage, (image) => image.refinement_jobs)
  @JoinColumn({ name: 'original_image_id' })
  generated_image!: GeneratedImage;
}
