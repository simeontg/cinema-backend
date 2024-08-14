import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post()
    async create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionService.create(createSessionDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.sessionService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.sessionService.findOne(id, ['movie']);
    }
}
