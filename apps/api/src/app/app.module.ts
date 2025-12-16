import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '../config/app.config';
import databaseConfig from '../config/database.config';
import jwtConfig from '../config/jwt.config';
import minioConfig from '../config/minio.config';
import redisConfig from '../config/redis.config';
import googleConfig from '../config/google.config';
import { validationSchema } from '../config/validation.schema';
import { winstonConfig } from '../config/winston.config';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { MinioModule } from '../common/services/minio/minio.module';
import { QueueModule } from '../common/queues/queue.module';
import {
  User,
  Character,
  ReferenceImage,
  CharacterTrainingImage,
  GenerationSession,
  GenerationSettings,
  GeneratedImage,
  RefinementJob,
  ImageTag,
  GeneratedImageTag,
  Collection,
  CollectionImage,
  Subscription,
  CreditTransaction,
  PaymentTransaction,
  SharedImage,
  UserPreference,
  PoseLibrary,
  ActivityLog,
  NotificationQueue,
} from '@vivid-studios-ai/shared-types';

@Module({
  imports: [
    // Config Module with validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, minioConfig, redisConfig, googleConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Winston Logger
    WinstonModule.forRoot(winstonConfig),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [
          User,
          Character,
          ReferenceImage,
          CharacterTrainingImage,
          GenerationSession,
          GenerationSettings,
          GeneratedImage,
          RefinementJob,
          ImageTag,
          GeneratedImageTag,
          Collection,
          CollectionImage,
          Subscription,
          CreditTransaction,
          PaymentTransaction,
          SharedImage,
          UserPreference,
          PoseLibrary,
          ActivityLog,
          NotificationQueue,
        ],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        ssl: configService.get('database.ssl'),
        autoLoadEntities: true,
      }),
    }),

    // Application Modules
    AuthModule,
    UsersModule,
    MinioModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
