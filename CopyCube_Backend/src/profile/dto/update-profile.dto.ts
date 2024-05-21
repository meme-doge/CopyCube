import { PartialType } from '@nestjs/mapped-types';
import {IsBase64, IsString, MinLength} from "class-validator";


export class UpdateProfileDto {
    @IsString()
    @MinLength(1, {message:"Сontent cannot be empty"})
    @IsBase64()
    avatar?: string
}
