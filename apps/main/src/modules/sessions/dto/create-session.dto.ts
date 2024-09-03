import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateSessionDto {
    @IsNotEmpty()
    @IsString()
    movie: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    time: string;

    // @IsNotEmpty()
    // @IsNumber()
    // ticket_price: number;

    @IsNotEmpty()
    @IsString()
    cinema: string;

    @IsNotEmpty()
    @IsString()
    hall: string;
}
