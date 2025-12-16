import { Controller, Get, Head, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return {
      status: 'ok',
      message: 'Vivid Studios AI API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Head()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    // HEAD request for health checks
    return;
  }
}
