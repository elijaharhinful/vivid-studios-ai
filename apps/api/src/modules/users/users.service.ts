import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  UpdateUserDto,
  IPaginationParams,
  IPaginatedResponse,
  IUserStatistics,
  SYSTEM_MESSAGES,
} from '@vivid-studios-ai/shared-types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(
    paginationParams: IPaginationParams
  ): Promise<IPaginatedResponse<User>> {
    const { page = 1, limit = 10, sort_by = 'created_at', sort_order = 'DESC' } = paginationParams;

    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort_by]: sort_order },
    });

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(SYSTEM_MESSAGES.USER.ERROR.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check for email/username conflicts
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new ConflictException(SYSTEM_MESSAGES.USER.ERROR.USERNAME_TAKEN);
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async updateCredits(userId: string, amount: number): Promise<User> {
    const user = await this.findOne(userId);
    user.credits += amount;
    return this.userRepository.save(user);
  }

  async getStatistics(userId: string): Promise<IUserStatistics> {
    const user = await this.findOne(userId);

    // TODO: Implement actual statistics queries
    // This is a placeholder implementation
    return {
      total_generations: 0,
      total_images: 0,
      total_characters: 0,
      total_collections: 0,
      credits_remaining: user.credits,
      credits_used_this_month: 0,
    };
  }
}
