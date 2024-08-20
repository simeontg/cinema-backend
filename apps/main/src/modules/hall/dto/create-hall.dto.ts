import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { HallPlan } from '../types/hallPlan';

export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  cinema: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsObject()
  plan: HallPlan;
}
