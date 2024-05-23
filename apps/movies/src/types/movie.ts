export interface MovieDetails {
    title: string;
    description: string;
    genre: string;
    releaseDate: Date;
    duration: number;
    imageUrl: string;
    trended?: boolean;
}