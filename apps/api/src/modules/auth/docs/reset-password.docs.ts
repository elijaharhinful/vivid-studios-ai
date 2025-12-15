import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResetPasswordDto } from '@vivid-studios-ai/shared-types';

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset password with token',
      description: 'Reset user password using the reset token received via email.',
    }),
    ApiBody({
      type: ResetPasswordDto,
      description: 'Reset token and new password',
      examples: {
        example1: {
          summary: 'Reset password',
          value: {
            reset_token: 'abc123def456',
            new_password: 'NewSecurePassword123!',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Password successfully reset',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Password successfully reset',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid or expired reset token',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'number', example: 400 },
          error: { type: 'string', example: 'Bad Request' },
          message: { type: 'string', example: 'Invalid or expired reset token' },
        },
      },
    })
  );
}
