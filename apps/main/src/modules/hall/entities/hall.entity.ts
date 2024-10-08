import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cinema } from '../../cinemas/entities/cinema.entity';
import { Session } from '../../sessions/entities/session.entity';
import { AbstractEntity } from '@app/common';
import { HallSeat } from '../hallSeat/entities/hallSeat.entity';

@Entity({
    name: 'halls'
})
export class Hall extends AbstractEntity<Hall> {
    @ManyToOne(() => Cinema, (cinema) => cinema.halls, {
        eager: true
    })
    @JoinColumn()
    cinema: Cinema;

    @Column()
    hall_name: string;

    @Column('jsonb', { nullable: true })
    hall_plan: any;

    @OneToMany(() => Session, (session) => session.hall)
    sessions: Session[];

    @OneToMany(() => HallSeat, (hallSeat) => hallSeat.hall, { cascade: ['remove'] })
    hallSeats?: HallSeat[];
}
