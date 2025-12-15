import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface GenerationJobData {
  sessionId: string;
  userId: string;
  prompt: string;
  negativePrompt?: string;
  characterId?: string;
  settings: Record<string, unknown>;
}

export interface TrainingJobData {
  characterId: string;
  userId: string;
  imageUrls: string[];
}

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export interface WebhookJobData {
  url: string;
  payload: Record<string, unknown>;
  headers?: Record<string, string>;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('image-generation')
    private readonly imageGenerationQueue: Queue<GenerationJobData>,
    @InjectQueue('training')
    private readonly trainingQueue: Queue<TrainingJobData>,
    @InjectQueue('email')
    private readonly emailQueue: Queue<EmailJobData>,
    @InjectQueue('webhooks')
    private readonly webhookQueue: Queue<WebhookJobData>
  ) {}

  async addImageGenerationJob(data: GenerationJobData): Promise<string> {
    const job = await this.imageGenerationQueue.add('generate', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    return job.id ? job.id.toString() : '';
  }

  async addTrainingJob(data: TrainingJobData): Promise<string> {
    const job = await this.trainingQueue.add('train', data, {
      attempts: 2,
      // timeout: 3600000, // 1 hour - timeout is not directly supported in BullMQ add options
    });
    return job.id ? job.id.toString() : '';
  }

  async addEmailJob(data: EmailJobData): Promise<string> {
    const job = await this.emailQueue.add('send', data, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    return job.id ? job.id.toString() : '';
  }

  async addWebhookJob(data: WebhookJobData): Promise<string> {
    const job = await this.webhookQueue.add('process', data, {
      attempts: 3,
    });
    return job.id ? job.id.toString() : '';
  }

  async getJobStatus(queueName: string, jobId: string): Promise<{
    status: string;
    progress: number;
    data?: unknown;
  }> {
    let queue: Queue;

    switch (queueName) {
      case 'image-generation':
        queue = this.imageGenerationQueue;
        break;
      case 'training':
        queue = this.trainingQueue;
        break;
      case 'email':
        queue = this.emailQueue;
        break;
      case 'webhooks':
        queue = this.webhookQueue;
        break;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }

    const job = await queue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    const state = await job.getState();
    const progress = job.progress as number;

    return {
      status: state,
      progress,
      data: job.returnvalue,
    };
  }

  async cancelJob(queueName: string, jobId: string): Promise<void> {
    let queue: Queue;

    switch (queueName) {
      case 'image-generation':
        queue = this.imageGenerationQueue;
        break;
      case 'training':
        queue = this.trainingQueue;
        break;
      default:
        throw new Error(`Cannot cancel jobs in queue: ${queueName}`);
    }

    const job = await queue.getJob(jobId);

    if (job) {
      await job.remove();
    }
  }
}
