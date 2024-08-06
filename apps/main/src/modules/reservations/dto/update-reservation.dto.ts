import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateReservationDto {
    @IsNotEmpty()
    @IsNumber()
    total_price: number;
}
