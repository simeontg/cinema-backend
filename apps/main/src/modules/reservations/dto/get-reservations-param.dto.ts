import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class GetReservationParamDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value == 'true' || value == true)
    expired: boolean;
}
