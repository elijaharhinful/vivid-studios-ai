import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleAuthDto } from '@vivid-studios-ai/shared-types';

export function GoogleAuthDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Authenticate with Google',
      description: 'Authenticate using Google OAuth. Provide the Google ID token obtained from the frontend Google Sign-In flow.',
    }),
    ApiBody({
      type: GoogleAuthDto,
      description: 'Google ID token',
      examples: {
        example1: {
          summary: 'Google authentication',
          value: {
            id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0NTBhMzVhMjA4MWZhYTFkOWFlMWQzZjBjZTk1MjVmZTNhYjMiLCJ0eXAiOiJKV1QifQ...',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Google authentication successful',
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
      description: 'Invalid Google ID token',
    })
  );
}
