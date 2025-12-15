import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}

export class AddImageToCollectionDto {
  @IsString()
  collection_id!: string;

  @IsString()
  generated_image_id!: string;

  @IsOptional()
  sort_order?: number;
}
