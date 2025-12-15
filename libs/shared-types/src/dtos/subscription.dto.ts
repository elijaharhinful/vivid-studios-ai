import { IsEnum, IsUUID, IsBoolean, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { SubscriptionTier, SubscriptionStatus } from '../enums';

export class CreateSubscriptionDto {
  @IsUUID()
  user_id!: string;

  @IsEnum(SubscriptionTier)
  tier!: SubscriptionTier;

  @IsDateString()
  start_date!: string;

  @IsOptional()
  @IsDateString()
  next_billing_date?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  auto_renew?: boolean;
}

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(SubscriptionTier)
  tier?: SubscriptionTier;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsDateString()
  next_billing_date?: string;

  @IsOptional()
  @IsBoolean()
  auto_renew?: boolean;
}

export class CancelSubscriptionDto {
  @IsUUID()
  subscription_id!: string;
}
