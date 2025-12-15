import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { IFileUploadResult } from '@vivid-studios-ai/shared-types';
import 'multer';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;
  private readonly defaultBucket: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('minio.endPoint'),
      port: this.configService.getOrThrow<number>('minio.port'),
      useSSL: this.configService.getOrThrow<boolean>('minio.useSSL'),
      accessKey: this.configService.getOrThrow<string>('minio.accessKey'),
      secretKey: this.configService.getOrThrow<string>('minio.secretKey'),
    });

    this.defaultBucket = this.configService.getOrThrow<string>('minio.bucket');
    this.ensureBucket(this.defaultBucket);
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string = this.defaultBucket,
    folder: string = ''
  ): Promise<IFileUploadResult> {
    await this.ensureBucket(bucket);

    const timestamp = Date.now();
    const filename = `${folder}${folder ? '/' : ''}${timestamp}-${file.originalname}`;

    const metadata = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      bucket,
      filename,
      file.buffer,
      file.size,
      metadata
    );

    const url = await this.getFileUrl(bucket, filename);

    this.logger.log(`File uploaded: ${filename} to bucket: ${bucket}`);

    return {
      url,
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const { bucket, filename } = this.parseMinioUrl(url);
      await this.minioClient.removeObject(bucket, filename);
      this.logger.log(`File deleted: ${filename} from bucket: ${bucket}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${url}`, error);
      throw error;
    }
  }

  async getPresignedUrl(
    filename: string,
    bucket: string = this.defaultBucket,
    expiry: number = 3600
  ): Promise<string> {
    return this.minioClient.presignedGetObject(bucket, filename, expiry);
  }

  async ensureBucket(bucket: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucket);
      if (!exists) {
        await this.minioClient.makeBucket(bucket, 'us-east-1');
        this.logger.log(`Bucket created: ${bucket}`);

        // Set public read policy for the bucket
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          bucket,
          JSON.stringify(policy)
        );
      }
    } catch (error) {
      this.logger.error(`Failed to ensure bucket: ${bucket}`, error);
      throw error;
    }
  }

  private async getFileUrl(bucket: string, filename: string): Promise<string> {
    const endpoint = this.configService.getOrThrow<string>('minio.endPoint');
    const port = this.configService.getOrThrow<number>('minio.port');
    const useSSL = this.configService.getOrThrow<boolean>('minio.useSSL');
    const protocol = useSSL ? 'https' : 'http';
    
    return `${protocol}://${endpoint}:${port}/${bucket}/${filename}`;
  }

  private parseMinioUrl(url: string): { bucket: string; filename: string } {
    const urlParts = url.split('/');
    const bucket = urlParts[urlParts.length - 2];
    const filename = urlParts[urlParts.length - 1];
    return { bucket, filename };
  }
}
