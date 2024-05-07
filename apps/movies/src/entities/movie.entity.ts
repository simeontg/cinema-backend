import { AbstractEntity } from "@app/common";
import { Entity } from "typeorm";

@Entity()
export class Movie extends AbstractEntity<Movie> {

}
