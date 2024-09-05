import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Session } from '../../entities/session.entity';
import { HallSeat } from '../../../hall/hallSeat/entities/hallSeat.entity';

@Entity()
export class SessionHallSeat extends AbstractEntity<SessionHallSeat> {
    @ManyToOne(() => Session, (session) => session.sessionHallSeats)
    @JoinColumn({ name: 'session_id' })
    session: Session;

    @ManyToOne(() => HallSeat, (hallSeat) => hallSeat.sessionHallSeats)
    @JoinColumn({ name: 'hall_seat_id' })
    hallSeat: HallSeat;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
