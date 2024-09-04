import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '@app/common';
import { AdminGuard } from '@app/common/guards/AdminGuard';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionService.create(createSessionDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query('movieId') movieId: string) {
        return this.sessionService.findMany({ movie: { id: movieId } });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sessionService.findOne(id, ['movie']);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
        return this.sessionService.update(id, updateSessionDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.sessionService.delete(id);
    }
}
