import { Expose } from "class-transformer";

export class PaginationLinksDto {
    @Expose()
    first?: string;

    @Expose()
    previous?: string;

    @Expose()
    next?: string;

    @Expose()
    last?: string;
}