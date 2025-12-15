import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ReferenceImage } from './reference-image.entity';
import { CharacterTrainingImage } from './character-training-image.entity';
import { GenerationSession } from './generation-session.entity';

@Entity('characters')
export class Character extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  training_status?: string;

  @Column({ type: 'timestamp', nullable: true })
  training_completed_at?: Date;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.characters)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => ReferenceImage, (image) => image.character)
  reference_images?: ReferenceImage[];

  @OneToMany(() => CharacterTrainingImage, (image) => image.character)
  training_images?: CharacterTrainingImage[];

  @OneToMany(() => GenerationSession, (session) => session.character)
  generation_sessions?: GenerationSession[];
}
