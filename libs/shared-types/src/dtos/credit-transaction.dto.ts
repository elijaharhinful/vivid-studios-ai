import { IsEnum, IsInt, IsString, IsOptional, IsUUID } from 'class-validator';
import { TransactionType } from '../enums';

export class CreateCreditTransactionDto {
  @IsUUID()
  user_id!: string;

  @IsEnum(TransactionType)
  transaction_type!: TransactionType;

  @IsInt()
  amount!: number;

  @IsInt()
  balance_after!: number;

  @IsOptional()
  @IsString()
  reference_id?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class PurchaseCreditsDto {
  @IsInt()
  amount!: number;
}
