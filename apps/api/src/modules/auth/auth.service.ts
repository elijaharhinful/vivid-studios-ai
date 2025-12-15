import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  User,
  LoginDto,
  CreateUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  IAuthTokens,
  IJwtPayload,
  SYSTEM_MESSAGES,
} from '@vivid-studios-ai/shared-types';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<IAuthTokens> {
    const { email, username, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(SYSTEM_MESSAGES.AUTH.ERROR.USER_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password_hash: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<IAuthTokens> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS);
    }

    // Check if user has a password (not OAuth user)
    if (!user.password_hash) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS);
    }

    // Update last login
    user.last_login_at = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    return this.generateTokens(user);
  }

  async refreshToken(userId: string): Promise<IAuthTokens> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.USER_NOT_FOUND);
    }

    return this.generateTokens(user);
  }

  async requestPasswordReset(dto: RequestPasswordResetDto): Promise<void> {
    const { email } = dto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    user.reset_token = resetToken;
    user.reset_token_expires_at = resetTokenExpiry;

    await this.userRepository.save(user);

    // TODO: Send email with reset token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { reset_token, new_password } = dto;

    const user = await this.userRepository.findOne({
      where: { reset_token },
    });

    if (!user || !user.reset_token_expires_at) {
      throw new BadRequestException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_RESET_TOKEN);
    }

    // Check if token is expired
    if (user.reset_token_expires_at < new Date()) {
      throw new BadRequestException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_RESET_TOKEN);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password and clear reset token
    user.password_hash = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires_at = null;

    await this.userRepository.save(user);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.USER_NOT_FOUND);
    }

    return user;
  }

  async validateGoogleUser(googleData: {
    email: string;
    username: string;
    oauth_provider: string;
    oauth_provider_id: string;
    profile_image_url?: string;
  }): Promise<User> {
    // Check if user exists with this Google ID
    let user = await this.userRepository.findOne({
      where: {
        oauth_provider: googleData.oauth_provider,
        oauth_provider_id: googleData.oauth_provider_id,
      },
    });

    if (user) {
      // Update last login
      user.last_login_at = new Date();
      return this.userRepository.save(user);
    }

    // Check if user exists with this email
    user = await this.userRepository.findOne({
      where: { email: googleData.email },
    });

    if (user) {
      // Link Google account to existing user
      user.oauth_provider = googleData.oauth_provider;
      user.oauth_provider_id = googleData.oauth_provider_id;
      if (googleData.profile_image_url && !user.profile_image_url) {
        user.profile_image_url = googleData.profile_image_url;
      }
      user.last_login_at = new Date();
      return this.userRepository.save(user);
    }

    // Create new user
    const newUser = this.userRepository.create({
      email: googleData.email,
      username: googleData.username,
      oauth_provider: googleData.oauth_provider,
      oauth_provider_id: googleData.oauth_provider_id,
      profile_image_url: googleData.profile_image_url,
      last_login_at: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  async googleAuth(idToken: string): Promise<IAuthTokens> {
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(
      this.configService.getOrThrow<string>('google.clientId')
    );

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.getOrThrow<string>('google.clientId'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.INVALID_GOOGLE_TOKEN);
      }

      const user = await this.validateGoogleUser({
        email: payload.email,
        username: payload.name || payload.email.split('@')[0],
        oauth_provider: 'google',
        oauth_provider_id: payload.sub,
        profile_image_url: payload.picture,
      });

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.GOOGLE_AUTH_FAILED);
    }
  }

  private generateTokens(user: User): IAuthTokens {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: ms(this.configService.getOrThrow<string>('jwt.refreshExpiresIn') as StringValue) / 1000,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}
