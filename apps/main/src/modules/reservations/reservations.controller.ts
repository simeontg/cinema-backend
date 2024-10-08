import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservations.service';
import { UserDto } from '@app/common/dto/user.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { GetReservationParamDto } from './dto/get-reservations-param.dto';

@Controller('main/reservation')
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
    @Get('user')
    async getUserReservations(
        @CurrentUser() user: UserDto,
        @Query() { expired }: GetReservationParamDto
    ) {
        console.log(user)
        return this.reservationService.getUserReservations(user.profile.id, expired);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@CurrentUser() user: UserDto, @Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
        return this.reservationService.update(user, id, updateReservationDto);
    }
}
