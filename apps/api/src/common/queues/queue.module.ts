import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageGenerationProcessor } from './processors/image-generation.processor';
import { TrainingProcessor } from './processors/training.processor';
import { EmailProcessor } from './processors/email.processor';
import { WebhookProcessor } from './processors/webhook.processor';
import { QueueService } from './services/queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'image-generation' },
      { name: 'training' },
      { name: 'email' },
      { name: 'webhooks' }
    ),
  ],
  providers: [
    ImageGenerationProcessor,
    TrainingProcessor,
    EmailProcessor,
    WebhookProcessor,
    QueueService,
  ],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
