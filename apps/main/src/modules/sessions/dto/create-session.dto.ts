import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDateString, IsObject, ValidateNested } from 'class-validator';

class SeatPricesDto {
    [key: string]: number;
}

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

    @IsNotEmpty()
    @IsString()
    cinema: string;

    @IsNotEmpty()
    @IsString()
    hall: string;

    @IsNotEmpty()
    @IsObject()
    seatPrices: SeatPricesDto;
}
