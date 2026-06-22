import { IsInt, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNumber()
  @Min(1)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;


  @IsInt()
  @Min(1)
  categoryId!: number;
}