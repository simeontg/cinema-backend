import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Cinema } from '../../cinemas/entities/cinema.entity';

@Entity({
    name: 'cities'
})
export class City extends AbstractEntity<City> {
    @Column()
    name: string;

    @OneToMany(() => Cinema, (cinema) => cinema.city)
    cinemas: Cinema[];
}
