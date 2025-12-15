import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '@vivid-studios-ai/shared-types';

export function LoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticate an existing user with email and password. Returns JWT access and refresh tokens.',
    }),
    ApiBody({
      type: LoginDto,
      description: 'User login credentials',
      examples: {
        example1: {
          summary: 'Standard login',
          value: {
            email: 'user@example.com',
            password: 'SecurePassword123!',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'number', example: 401 },
          error: { type: 'string', example: 'Unauthorized' },
          message: { type: 'string', example: 'Invalid credentials' },
        },
      },
    })
  );
}
