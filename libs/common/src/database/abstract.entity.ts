import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class AbstractEntity<T> {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    createdAt?: Date;
    
    @UpdateDateColumn()
    updatedAt?: Date;

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    } 
}