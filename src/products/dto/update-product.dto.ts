import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  value?: number;

  @IsNumber()
  userId?: number;
}
