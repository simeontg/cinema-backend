import { Expose } from "class-transformer";

export class TrendedMovieResponseDto {
    @Expose()
    id: string;

    @Expose()
    title: string;
    
    @Expose()
    description: string;

    @Expose()
    duration: number;

    @Expose()
    imageUrl: string;

    @Expose()
    genre: string;
}
