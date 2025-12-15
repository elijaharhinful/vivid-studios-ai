import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GenerationSession } from './generation-session.entity';
import { RefinementJob } from './refinement-job.entity';
import { GeneratedImageTag } from './generated-image-tag.entity';
import { CollectionImage } from './collection-image.entity';
import { SharedImage } from './shared-image.entity';

@Entity('generated_images')
export class GeneratedImage extends BaseEntity {

  @Column({ type: 'uuid' })
  session_id!: string;

  @Column({ type: 'varchar', length: 255 })
  image_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_size?: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'int', nullable: true })
  seed?: number;

  @Column({ type: 'boolean', default: false })
  is_favorited!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  generation_model?: string;

  // Relations
  @ManyToOne(() => GenerationSession, (session) => session.generated_images)
  @JoinColumn({ name: 'session_id' })
  generation_session!: GenerationSession;

  @OneToMany(() => RefinementJob, (job) => job.generated_image)
  refinement_jobs?: RefinementJob[];

  @OneToMany(() => GeneratedImageTag, (tag) => tag.generated_image)
  generated_image_tags?: GeneratedImageTag[];

  @OneToMany(() => CollectionImage, (collectionImage) => collectionImage.generated_image)
  collection_images?: CollectionImage[];

  @OneToMany(() => SharedImage, (sharedImage) => sharedImage.generated_image)
  shared_images?: SharedImage[];
}
