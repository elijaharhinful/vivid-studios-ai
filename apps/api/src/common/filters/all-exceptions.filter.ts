import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { SYSTEM_MESSAGES } from '@vivid-studios-ai/shared-types';

interface IErrorResponse {
  success: boolean;
  status_code: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = SYSTEM_MESSAGES.GENERAL.ERROR.INTERNAL_SERVER;
    let error = 'Internal Server Error';

    // Handle different exception types
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string | string[]) || message;
        error = (responseObj.error as string) || error;
      }
    } else if (exception instanceof QueryFailedError) {
      // Database query errors
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      error = 'Bad Request';

      // Handle specific database errors
      const dbError = exception as QueryFailedError & { code?: string };
      
      if (dbError.code === '23505') {
        // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = SYSTEM_MESSAGES.GENERAL.ERROR.CONFLICT;
        error = 'Conflict';
      } else if (dbError.code === '23503') {
        // Foreign key constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Referenced resource not found';
        error = 'Bad Request';
      }

      this.logger.error(`Database error: ${exception.message}`, exception.stack);
    } else if (exception instanceof EntityNotFoundError) {
      // TypeORM entity not found
      status = HttpStatus.NOT_FOUND;
      message = SYSTEM_MESSAGES.GENERAL.ERROR.NOT_FOUND;
      error = 'Not Found';
      
      this.logger.warn(`Entity not found: ${exception.message}`);
    } else if (exception instanceof Error) {
      // Generic error
      message = exception.message || SYSTEM_MESSAGES.GENERAL.ERROR.INTERNAL_SERVER;
      
      // Check for specific error types
      if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        error = 'Validation Error';
      } else if (exception.name === 'UnauthorizedError') {
        status = HttpStatus.UNAUTHORIZED;
        message = SYSTEM_MESSAGES.AUTH.ERROR.UNAUTHORIZED;
        error = 'Unauthorized';
      } else if (exception.name === 'ForbiddenError') {
        status = HttpStatus.FORBIDDEN;
        message = SYSTEM_MESSAGES.AUTH.ERROR.FORBIDDEN;
        error = 'Forbidden';
      }

      this.logger.error(exception.message, exception.stack);
    } else {
      // Unknown error type
      this.logger.error('Unknown error occurred', JSON.stringify(exception));
    }

    const errorResponse: IErrorResponse = {
      success: false,
      status_code: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    // Log error details
    const logMessage = `${request.method} ${request.url} - ${status} - ${
      Array.isArray(message) ? message.join(', ') : message
    }`;
    
    if (status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : ''
      );
    } else if (status >= 400) {
      this.logger.warn(logMessage);
    }

    response.status(status).json(errorResponse);
  }
}
