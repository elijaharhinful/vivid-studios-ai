import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GeneratedImage } from './generated-image.entity';
import { ImageTag } from './image-tag.entity';

@Entity('generated_image_tags')
export class GeneratedImageTag extends BaseEntity {

  @Column({ type: 'uuid' })
  generated_image_id!: string;

  @Column({ type: 'uuid' })
  tag_id!: string;

  // Relations
  @ManyToOne(() => GeneratedImage, (image) => image.generated_image_tags)
  @JoinColumn({ name: 'generated_image_id' })
  generated_image!: GeneratedImage;

  @ManyToOne(() => ImageTag, (tag) => tag.generated_image_tags)
  @JoinColumn({ name: 'tag_id' })
  image_tag!: ImageTag;
}
