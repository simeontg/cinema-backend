import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    duration: number;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date
    
    @IsBoolean()
    trending: boolean
}
