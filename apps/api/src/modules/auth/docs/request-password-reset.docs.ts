import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RequestPasswordResetDto } from '@vivid-studios-ai/shared-types';

export function RequestPasswordResetDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request password reset',
      description: 'Send a password reset email to the user. For security, always returns success even if email does not exist.',
    }),
    ApiBody({
      type: RequestPasswordResetDto,
      description: 'Email address for password reset',
      examples: {
        example1: {
          summary: 'Request reset',
          value: {
            email: 'user@example.com',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Password reset email sent (if email exists)',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'If the email exists, a password reset link has been sent',
          },
        },
      },
    })
  );
}
