import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function GetMyStatisticsDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Get current user statistics',
      description: 'Retrieve usage statistics for the authenticated user.',
    }),
    ApiResponse({
      status: 200,
      description: 'Statistics retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          total_generations: { type: 'number', example: 25 },
          total_images: { type: 'number', example: 100 },
          total_characters: { type: 'number', example: 5 },
          total_collections: { type: 'number', example: 3 },
          credits_remaining: { type: 'number', example: 150 },
          credits_used_this_month: { type: 'number', example: 50 },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    })
  );
}
