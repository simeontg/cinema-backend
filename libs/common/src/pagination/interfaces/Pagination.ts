import { Pagination as NestjsTypeormPagination } from "nestjs-typeorm-paginate";
import { PaginationMeta } from "./PaginationMeta";

export class Pagination<PaginationObject, T = PaginationMeta> extends NestjsTypeormPagination<PaginationObject, T> {

}