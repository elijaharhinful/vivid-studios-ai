import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Collection } from './collection.entity';
import { GeneratedImage } from './generated-image.entity';

@Entity('collection_images')
export class CollectionImage extends BaseEntity {

  @Column({ type: 'uuid' })
  collection_id!: string;

  @Column({ type: 'uuid' })
  generated_image_id!: string;

  @Column({ type: 'int', nullable: true })
  sort_order?: number;

  // Relations
  @ManyToOne(() => Collection, (collection) => collection.collection_images)
  @JoinColumn({ name: 'collection_id' })
  collection!: Collection;

  @ManyToOne(() => GeneratedImage, (image) => image.collection_images)
  @JoinColumn({ name: 'generated_image_id' })
  generated_image!: GeneratedImage;
}
