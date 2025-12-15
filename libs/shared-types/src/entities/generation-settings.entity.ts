import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GenerationSession } from './generation-session.entity';

@Entity('generation_settings')
export class GenerationSettings extends BaseEntity {

  @Column({ type: 'uuid' })
  session_id!: string;

  @Column({ type: 'int', default: 512 })
  resolution_width!: number;

  @Column({ type: 'int', default: 512 })
  resolution_height!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model_version?: string;

  @Column({ type: 'int', default: 30 })
  num_steps!: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 7.5 })
  guidance_scale!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sampler?: string;

  @Column({ type: 'int', nullable: true })
  seed?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lora_model?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  lora_strength?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  controlnet_model?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  controlnet_image_url?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  controlnet_strength?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  background_prompt?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foreground_prompt?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lighting_direction?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  custom_strength?: string;

  @Column({ type: 'jsonb', nullable: true })
  misc?: Record<string, unknown>;

  // Relations
  @OneToOne(() => GenerationSession, (session) => session.generation_settings)
  @JoinColumn({ name: 'session_id' })
  generation_session!: GenerationSession;
}
