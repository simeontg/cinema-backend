import { Expose } from "class-transformer";
import { IsArray } from "class-validator";
import { PaginationMetaDto } from "./pagination-meta.dto";
import { PaginationLinksDto } from "./pagination-links.dto";

export class PaginationResponseDto<T> {
    @Expose()
    @IsArray()
    items: T[];

    @Expose()
    meta: PaginationMetaDto

    @Expose()
    links: PaginationLinksDto
}
