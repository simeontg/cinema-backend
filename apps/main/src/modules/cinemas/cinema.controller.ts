import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { JwtAuthGuard } from '@app/common';
import { AdminGuard } from '@app/common/guards/AdminGuard';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Controller('cinema')
export class CinemaController {
    constructor(private readonly cinemaService: CinemaService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async create(@Body() createCinemaDto: CreateCinemaDto) {
        return this.cinemaService.create(createCinemaDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
        return this.cinemaService.update(id, updateCinemaDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.cinemaService.findAll();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    deleteMovie(@Param('id') id: string) {
        return this.cinemaService.remove(id);
    }
}
