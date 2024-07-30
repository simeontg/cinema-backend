import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
    imports: [
        ConfigModule.forRoot({}),
        JwtModule.registerAsync({
            imports: [ConfigModule.forRoot()],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION')}s`
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [TokenService],
    exports: [TokenService]
})

export class TokenModule {}
