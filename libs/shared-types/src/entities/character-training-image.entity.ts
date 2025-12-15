import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Character } from './character.entity';

@Entity('character_training_images')
export class CharacterTrainingImage extends BaseEntity {

  @Column({ type: 'uuid' })
  character_id!: string;

  @Column({ type: 'varchar', length: 255 })
  image_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_size?: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  // Relations
  @ManyToOne(() => Character, (character) => character.training_images)
  @JoinColumn({ name: 'character_id' })
  character!: Character;
}
