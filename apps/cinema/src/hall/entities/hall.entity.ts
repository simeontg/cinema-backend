import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cinema } from '../../entities/cinema.entity';
import { Session } from '../../session/entities/session.entity';
import { AbstractEntity } from '@app/common';

@Entity({
    name: 'halls'
})
export class Hall extends AbstractEntity<Hall> {
    @ManyToOne(() => Cinema, (cinema) => cinema.halls)
    cinema: Cinema;

    @Column()
    hall_name: string;

    @Column('jsonb')
    hall_plan: any;

    @OneToMany(() => Session, (session) => session.hall)
    sessions: Session[];
}
