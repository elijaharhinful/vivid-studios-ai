import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  CreateUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  GoogleAuthDto,
  IAuthTokens,
  IAuthUser,
} from '@vivid-studios-ai/shared-types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  SignupDocs,
  LoginDocs,
  RefreshTokenDocs,
  RequestPasswordResetDocs,
  ResetPasswordDocs,
  GetProfileDocs,
  GoogleAuthDocs,
} from './docs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @SignupDocs()
  async signup(@Body() createUserDto: CreateUserDto): Promise<IAuthTokens> {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(@Body() loginDto: LoginDto): Promise<IAuthTokens> {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @GoogleAuthDocs()
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto): Promise<IAuthTokens> {
    return this.authService.googleAuth(googleAuthDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @RefreshTokenDocs()
  async refreshToken(@Request() req: { user: { userId: string } }): Promise<IAuthTokens> {
    return this.authService.refreshToken(req.user.userId);
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @RequestPasswordResetDocs()
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto);
    return { message: 'If the email exists, a password reset link has been sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResetPasswordDocs()
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: 'Password successfully reset' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @GetProfileDocs()
  async getProfile(@Request() req: { user: IAuthUser }): Promise<IAuthUser> {
    return req.user;
  }
}
