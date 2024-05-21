import { IsEmail, IsNotEmpty, IsPassportNumber, IsString, MinLength } from 'class-validator';
export class PatchUserDto {
    @IsNotEmpty()
    @MinLength(8, {message:"Password must be at least 8 characters"})
    password:string

    @IsNotEmpty()
    @MinLength(8, {message:"Password must be at least 8 characters"})
    passwordNew:string
}