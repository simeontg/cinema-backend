import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservations.service';
import { UserDto } from '@app/common/dto/user.dto';

@Controller('reservation')
export class ReservationController {
    constructor(private reservationService: ReservationService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: UserDto) {
        return this.reservationService.create({
            ...createReservationDto,
            profileId: user.profile.id
        });
    }
}
