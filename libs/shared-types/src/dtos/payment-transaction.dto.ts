import { IsEnum, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../enums';

export class CreatePaymentTransactionDto {
  @IsUUID()
  user_id!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsEnum(PaymentMethod)
  payment_method!: PaymentMethod;

  @IsOptional()
  @IsUUID()
  subscription_id?: string;

  @IsOptional()
  @IsString()
  stripe_payment_intent_id?: string;
}

export class UpdatePaymentTransactionDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  stripe_charge_id?: string;

  @IsOptional()
  @IsString()
  failure_reason?: string;
}
