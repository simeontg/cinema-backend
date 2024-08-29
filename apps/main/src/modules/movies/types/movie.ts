export interface MovieDetails {
    title: string;
    description: string;
    genre: string;
    releaseDate: Date;
    duration: number;
    imageUrl?: string;
    trended?: boolean;
}

export interface MovieSearchParams {
    releaseType: 'current' | 'upcoming' | 'all';
    title: string;
    genre: string;
}