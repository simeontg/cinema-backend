import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  cinema: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsObject()
  plan: {
    rows: {
      row: string;
      seats: {
        seat_number: string;
        reserved: boolean;
      }[];
    }[];
  };
}
