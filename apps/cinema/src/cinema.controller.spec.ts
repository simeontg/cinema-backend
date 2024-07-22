import { Test, TestingModule } from '@nestjs/testing';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';

describe('CinemaController', () => {
    let cinemaController: CinemaController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CinemaController],
            providers: [CinemaService]
        }).compile();

        cinemaController = app.get<CinemaController>(CinemaController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(cinemaController.getHello()).toBe('Hello World!');
        });
    });
});
