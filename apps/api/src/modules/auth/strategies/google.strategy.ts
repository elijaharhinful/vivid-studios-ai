import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { SYSTEM_MESSAGES } from '@vivid-studios-ai/shared-types';

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getOrThrow<string>('google.clientId'),
      clientSecret: configService.getOrThrow<string>('google.clientSecret'),
      callbackURL: configService.getOrThrow<string>('google.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile
  ): Promise<{ userId: string; email: string; role: string }> {
    try {
      const email = profile.emails[0]?.value;
      const profileImage = profile.photos[0]?.value;

      if (!email) {
        throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.GOOGLE_AUTH_FAILED);
      }

      const user = await this.authService.validateGoogleUser({
        email,
        username: profile.displayName || email.split('@')[0],
        oauth_provider: 'google',
        oauth_provider_id: profile.id,
        profile_image_url: profileImage,
      });

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new UnauthorizedException(SYSTEM_MESSAGES.AUTH.ERROR.GOOGLE_AUTH_FAILED);
    }
  }
}
