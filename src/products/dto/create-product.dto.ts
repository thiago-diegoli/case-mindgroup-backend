import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces: 2})
  value: number;
}
