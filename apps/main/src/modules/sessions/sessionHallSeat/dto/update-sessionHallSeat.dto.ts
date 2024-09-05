import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSessionHallSeatDto {
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
