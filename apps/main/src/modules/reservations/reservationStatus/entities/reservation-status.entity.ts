import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';
import { ReservationStatuses } from '../types/reservation-status.enum';

@Entity()
export class ReservationStatus extends AbstractEntity<ReservationStatus> {
    @Column({
        type: 'enum',
        enum: ReservationStatuses
    })
    status: ReservationStatuses;
}
