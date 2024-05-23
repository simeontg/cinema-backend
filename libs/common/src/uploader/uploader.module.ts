import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot({})],
    providers: [UploaderService],
    exports: [UploaderService]
})

export class UploaderModule {}
