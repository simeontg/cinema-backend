import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsNumber()
  total_price: number;
}
