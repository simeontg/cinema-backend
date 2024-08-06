import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservations.service';
import { UserDto } from '@app/common/dto/user.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

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

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
        return this.reservationService.update(id, updateReservationDto);
    }
}
