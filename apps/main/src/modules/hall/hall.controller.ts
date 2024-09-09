import { Body, Controller, Post, Get, UseGuards, Query, Param, Delete, Put } from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { JwtAuthGuard } from '@app/common';
import { HallPlanResponseDto } from './dto/hallPlan-response.dto';
import { plainToInstance } from 'class-transformer';
import { AdminGuard } from '@app/common/guards/AdminGuard';
import { UpdateHallDto } from './dto/update-hall.dto';

@Controller('hall')
export class HallController {
    constructor(private readonly hallService: HallService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async create(@Body() createHallDto: CreateHallDto) {
        return this.hallService.create(createHallDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.hallService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/plan')
    async getHallPlan(
        @Param('id') id: string,
        @Query('sessionId') sessionId?: string // Make sessionId optional
    ): Promise<HallPlanResponseDto> {
        const hallPlan = await this.hallService.getMappedHallPlan(id, sessionId);
        return plainToInstance(HallPlanResponseDto, hallPlan);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/seatTypes')
    async getSeatTypes(@Param() { id }: { id: string }) {
        return this.hallService.getTypesOfSeats(id);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateHallDto: UpdateHallDto) {
        return this.hallService.update(id, updateHallDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.hallService.delete(id);
    }
}
