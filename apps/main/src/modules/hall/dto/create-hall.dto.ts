import { IsNotEmpty, IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class SeatDto {
  @IsString()
  seatType: string;

  @IsNumber()
  seatCount: number;
}

class RowDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}


export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  cinemaId: string;

  @IsNotEmpty()
  @IsString()
  hallName: string;

  @IsNotEmpty()
  hallPlan: RowDto[];
}
