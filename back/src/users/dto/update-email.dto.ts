import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  newEmail!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}