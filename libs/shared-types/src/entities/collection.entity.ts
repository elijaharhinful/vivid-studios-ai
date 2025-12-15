import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CollectionImage } from './collection-image.entity';

@Entity('collections')
export class Collection extends BaseEntity {

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => CollectionImage, (collectionImage) => collectionImage.collection)
  collection_images?: CollectionImage[];
}
