import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('cinema')
export class CinemaController {
    constructor(private readonly cinemaService: CinemaService) {}

    @Post()
    async create(@Body() createCinemaDto: CreateCinemaDto) {
        return this.cinemaService.create(createCinemaDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.cinemaService.findAll();
    }
}
