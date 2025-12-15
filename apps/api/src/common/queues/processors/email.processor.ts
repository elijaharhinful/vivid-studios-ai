import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailJobData } from '../services/queue.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    if (job.name !== 'send') {
      return;
    }
    this.logger.log(`Sending email to: ${job.data.to}`);

    try {
      // TODO: Implement actual email sending logic
      // 1. Load email template
      // 2. Compile template with data
      // 3. Send via email service (e.g., SendGrid, AWS SES)
      // 4. Log email sent

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.logger.log(`Email sent successfully to: ${job.data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to: ${job.data.to}`, error);
      throw error;
    }
  }
}
