import { IsEnum, IsUUID, IsOptional, IsObject } from 'class-validator';
import { RefinementType } from '../enums';

export class CreateRefinementJobDto {
  @IsUUID()
  original_image_id!: string;

  @IsEnum(RefinementType)
  refinement_type!: RefinementType;

  @IsOptional()
  @IsObject()
  refinement_parameters?: Record<string, unknown>;
}

export class UpdateRefinementJobDto {
  @IsOptional()
  status?: string;

  @IsOptional()
  refined_image_url?: string;

  @IsOptional()
  credits_used?: number;
}
