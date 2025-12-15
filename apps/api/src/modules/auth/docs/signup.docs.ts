import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '@vivid-studios-ai/shared-types';

export function SignupDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Create a new user account with email, username, and password. Returns JWT access and refresh tokens.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User registration details',
      examples: {
        example1: {
          summary: 'Standard signup',
          value: {
            email: 'user@example.com',
            username: 'johndoe',
            password: 'SecurePassword123!',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
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
      status: 409,
      description: 'User with this email or username already exists',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'number', example: 409 },
          error: { type: 'string', example: 'Conflict' },
          message: { type: 'string', example: 'User with this email or username already exists' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
    })
  );
}
