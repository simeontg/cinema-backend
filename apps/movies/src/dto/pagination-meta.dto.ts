import { Expose } from "class-transformer";

export class PaginationMetaDto {
    @Expose()
    itemCount: number;

    @Expose()
    totalItems?: number;

    @Expose()
    itemsPerPage: number;

    @Expose()
    totalPages?: number;

    @Expose()
    currentPage: number;
}