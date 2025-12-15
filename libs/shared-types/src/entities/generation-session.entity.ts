import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { GenerationStatus } from '../enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Character } from './character.entity';
import { GeneratedImage } from './generated-image.entity';
import { GenerationSettings } from './generation-settings.entity';

@Entity('generation_sessions')
export class GenerationSession extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  character_id?: string;

  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'text', nullable: true })
  negative_prompt?: string;

  @Column({ type: 'enum', enum: GenerationStatus, default: GenerationStatus.PENDING })
  status!: GenerationStatus;

  @Column({ type: 'int', default: 1 })
  num_images!: number;

  @Column({ type: 'int', nullable: true })
  credits_used?: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.generation_sessions)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Character, (character) => character.generation_sessions, { nullable: true })
  @JoinColumn({ name: 'character_id' })
  character?: Character;

  @OneToMany(() => GeneratedImage, (image) => image.generation_session)
  generated_images?: GeneratedImage[];

  @OneToOne(() => GenerationSettings, (settings) => settings.generation_session)
  generation_settings?: GenerationSettings;
}
