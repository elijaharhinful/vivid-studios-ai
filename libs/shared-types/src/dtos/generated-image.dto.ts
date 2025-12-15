import { IsString, IsOptional, IsInt, IsBoolean, IsUUID } from 'class-validator';

export class CreateGeneratedImageDto {
  @IsUUID()
  session_id!: string;

  @IsString()
  image_url!: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsString()
  file_size?: string;

  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsInt()
  seed?: number;

  @IsOptional()
  @IsString()
  generation_model?: string;
}

export class UpdateGeneratedImageDto {
  @IsOptional()
  @IsBoolean()
  is_favorited?: boolean;
}

export class AddImageTagDto {
  @IsUUID()
  generated_image_id!: string;

  @IsUUID()
  tag_id!: string;
}
