import { IsNotEmpty, IsString } from "class-validator";

export class CreateCinemaDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    city: string;
}
