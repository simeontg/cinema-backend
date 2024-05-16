import { Expose } from "class-transformer";

export class MovieResponseDto {
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

    @Expose()
    releaseDate: Date
    
    @Expose()
    trended?: boolean

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}
