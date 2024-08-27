import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateReservationDto {
    @IsNotEmpty()
    @IsNumber()
    total_price: number;

    @IsOptional()
    hallSeats: hallSeat[];
}

interface hallSeat {
    id: string;
    location: string;
}
