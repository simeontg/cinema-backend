import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    duration: number;

    image: File;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    releaseDate: Date
    
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value == 'true' || value == true)
    trended?: boolean
}
