import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('hall')
export class HallController {
    constructor(private readonly hallService: HallService) {}

    @Post()
    async create(@Body() createHallDto: CreateHallDto) {
        return this.hallService.create(createHallDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.hallService.findAll();
    }
}
