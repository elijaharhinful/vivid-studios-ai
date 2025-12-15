import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateUserPreferenceDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  push_notifications?: boolean;

  @IsOptional()
  @IsString()
  default_resolution?: string;

  @IsOptional()
  @IsString()
  default_model?: string;

  @IsOptional()
  @IsBoolean()
  nsfw_filter?: boolean;

  @IsOptional()
  @IsBoolean()
  show_in_gallery?: boolean;
}
