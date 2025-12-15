import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  User,
  IPaginationParams,
  IPaginatedResponse,
  IUserStatistics,
  UserRole,
} from '@vivid-studios-ai/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  FindAllUsersDocs,
  GetMeDocs,
  GetMyStatisticsDocs,
  FindOneUserDocs,
  UpdateMeDocs,
  UpdateUserDocs,
  DeleteUserDocs,
} from './docs';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @FindAllUsersDocs()
  async findAll(
    @Query() paginationParams: IPaginationParams
  ): Promise<IPaginatedResponse<User>> {
    return this.usersService.findAll(paginationParams);
  }

  @Get('me')
  @GetMeDocs()
  async getMe(@Request() req: { user: { id: string } }): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Get('me/statistics')
  @GetMyStatisticsDocs()
  async getMyStatistics(
    @Request() req: { user: { id: string } }
  ): Promise<IUserStatistics> {
    return this.usersService.getStatistics(req.user.id);
  }

  @Get(':id')
  @FindOneUserDocs()
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @UpdateMeDocs()
  async updateMe(
    @Request() req: { user: { id: string } },
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UpdateUserDocs()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @DeleteUserDocs()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
