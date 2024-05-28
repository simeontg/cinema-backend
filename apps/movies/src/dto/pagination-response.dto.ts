import { Expose } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

export class PaginationResponseDto<T> {
    @Expose()
    @IsArray()
    data: T[];

    @Expose()
    @IsNumber()
    totalCount: number;

    @Expose()
    @IsNumber()
    limit: number;

    @Expose()
    @IsNumber()
    offset: number;
}