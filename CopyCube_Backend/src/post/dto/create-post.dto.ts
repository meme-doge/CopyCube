import {Category} from "../enum"
import {IsBase64, IsEnum, IsNotEmpty, IsString, MinLength} from "class-validator";
export class CreatePostDto {
    @IsString()
    title?: string

    @IsString()
    @MinLength(1, {message:"Сontent cannot be empty"})
    @IsBase64()
    buffer: string

    @IsEnum(Category)
    @IsNotEmpty()
    category: Category
}
