import { IsEmail, IsNotEmpty, IsPassportNumber, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name:string
  @MinLength(8, {message:"Password must be at least 8 characters"})
  password:string
}
