import { IsString, IsNumber, Min, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  'name': string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  'price': number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  'stock': number;
}
