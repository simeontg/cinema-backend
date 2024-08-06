import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReservationService } from './reservations.service';

@Processor('reservation')
export class ReservationProcessor {
    constructor(private readonly reservationService: ReservationService) {}

    @Process('expire')
    async handleExpiration(job: Job) {
        const { id } = job.data;
        await this.reservationService.deleteIfExpired(id);
    }
}
