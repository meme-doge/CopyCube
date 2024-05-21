import { IsEmail, IsNotEmpty, IsPassportNumber, IsString, MinLength } from 'class-validator';
export class RemoveUserDto {
    @MinLength(8, {message:"Password must be at least 8 characters"})
    password:string
}