import {Category} from "../enum"
import {IsBase64, IsEnum, IsNotEmpty, IsString} from "class-validator";
export class CreatePostDto {
    @IsString()
    @IsBase64()
    buffer: string // the TITLE and the MAIN PART of the text will be stored in the buffer

    @IsEnum(Category)
    @IsNotEmpty()
    category: Category // Private = 0
                       // Public = 1
}
