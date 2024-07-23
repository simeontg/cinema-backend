import { IsNumber, IsOptional, Min, Max, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPaginatedMoviesQueryParamsDto {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @Transform(({ value }) => {
        const limit = parseInt(value);
        return limit > 100 ? 20 : limit;
    })
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit: number = 20;

    @IsString()
    @IsOptional()
    releaseType: 'current' | 'upcoming';

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    genre: string;
}