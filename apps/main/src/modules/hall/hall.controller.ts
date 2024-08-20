import { Body, Controller, Post, Get, UseGuards, Query, Param } from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { JwtAuthGuard } from '@app/common';
import { HallPlanResponseDto } from './dto/hallPlan-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('hall')
export class HallController {
    constructor(
        private readonly hallService: HallService,
    ) {}

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
        @Query() { sessionId }: { sessionId: string },
        @Param() { id }: { id: string }
    ): Promise<HallPlanResponseDto> {
        const hall = await this.hallService.findOne({ id: id });
        const hallPlan = this.hallService.mapHallPlan(hall.hall_plan, sessionId);
        return plainToInstance(HallPlanResponseDto, hallPlan);
    }
}
