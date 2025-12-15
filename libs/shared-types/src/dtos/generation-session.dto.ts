import { IsString, IsOptional, IsInt, IsEnum, IsUUID, Min, Max, IsNumber } from 'class-validator';
import { GenerationStatus } from '../enums';

export class CreateGenerationSessionDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  negative_prompt?: string;

  @IsOptional()
  @IsUUID()
  character_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  num_images?: number;

  @IsOptional()
  @IsInt()
  @Min(256)
  @Max(2048)
  resolution_width?: number;

  @IsOptional()
  @IsInt()
  @Min(256)
  @Max(2048)
  resolution_height?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(150)
  num_steps?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  guidance_scale?: number;

  @IsOptional()
  @IsString()
  sampler?: string;

  @IsOptional()
  @IsInt()
  seed?: number;

  @IsOptional()
  @IsString()
  lora_model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  lora_strength?: number;

  @IsOptional()
  @IsString()
  controlnet_model?: string;

  @IsOptional()
  @IsString()
  controlnet_image_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  controlnet_strength?: number;
}

export class UpdateGenerationSessionDto {
  @IsOptional()
  @IsEnum(GenerationStatus)
  status?: GenerationStatus;

  @IsOptional()
  @IsInt()
  credits_used?: number;
}
