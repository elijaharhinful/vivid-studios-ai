import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from '@vivid-studios-ai/shared-types';

export function UpdateMeDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Update current user profile',
      description: 'Update the authenticated user\'s profile information.',
    }),
    ApiBody({
      type: UpdateUserDto,
      description: 'User update data',
      examples: {
        example1: {
          summary: 'Update username',
          value: {
            username: 'newusername',
          },
        },
        example2: {
          summary: 'Update profile image',
          value: {
            profile_image_url: 'https://example.com/avatar.jpg',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 409,
      description: 'Username already taken',
    })
  );
}
