import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { GeneratedImage } from './generated-image.entity';

@Entity('shared_images')
export class SharedImage extends BaseEntity {

  @Column({ type: 'uuid' })
  generated_image_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  share_token!: string;

  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expires_at?: Date;

  @Column({ type: 'int', default: 0 })
  view_count!: number;

  // Relations
  @ManyToOne(() => GeneratedImage, (image) => image.shared_images)
  @JoinColumn({ name: 'generated_image_id' })
  generated_image!: GeneratedImage;

  @ManyToOne(() => User, (user) => user.shared_images)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
