import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GeneratedImageTag } from './generated-image-tag.entity';

@Entity('image_tags')
export class ImageTag extends BaseEntity {

  @Column({ type: 'varchar', length: 100, unique: true })
  tag_name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  // Relations
  @OneToMany(() => GeneratedImageTag, (generatedImageTag) => generatedImageTag.image_tag)
  generated_image_tags?: GeneratedImageTag[];
}
