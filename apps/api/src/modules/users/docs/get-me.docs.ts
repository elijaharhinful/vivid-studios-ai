import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function GetMeDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get current user profile',
      description: 'Retrieve the authenticated user\'s complete profile information.',
    }),
    ApiResponse({
      status: 200,
      description: 'User profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', example: 'user@example.com' },
          username: { type: 'string', example: 'johndoe' },
          profile_image_url: { type: 'string', nullable: true },
          role: { type: 'string', example: 'user' },
          subscription_tier: { type: 'string', example: 'free' },
          credits: { type: 'number', example: 100 },
          last_login_at: { type: 'string', format: 'date-time', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    })
  );
}
