import { CreateReservationDto } from './create-reservation.dto';

export interface ExtendedReservationDto extends CreateReservationDto {
  profileId: string;
}