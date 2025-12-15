import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function GetProfileDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get current user profile',
      description: 'Retrieve the authenticated user\'s profile information.',
    }),
    ApiResponse({
      status: 200,
      description: 'User profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'user@example.com' },
          username: { type: 'string', example: 'johndoe' },
          role: { type: 'string', example: 'user', enum: ['user', 'admin', 'moderator'] },
          subscription_tier: { type: 'string', example: 'free', enum: ['free', 'basic', 'pro', 'enterprise'] },
          credits: { type: 'number', example: 100 },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    })
  );
}
