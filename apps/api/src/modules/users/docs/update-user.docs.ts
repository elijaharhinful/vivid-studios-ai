import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from '@vivid-studios-ai/shared-types';

export function UpdateUserDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Update user (Admin only)',
      description: 'Update any user\'s information. Requires admin role.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      description: 'User ID',
    }),
    ApiBody({
      type: UpdateUserDto,
      description: 'User update data',
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Admin role required',
    })
  );
}
