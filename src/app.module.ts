import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersService } from './users-service';
import { CookieSerializer } from './auth/cookie-serializer';
import { SessionGuard } from './auth/session-guard';
import { SessionAuthGuard } from './auth/session-auth-guard';
import { AuthService } from './auth-service';
import { LocalStrategy } from './auth/local-strategy';
import { CustomRedisStore } from './auth/custom-redis-store.service';

@Module({
    imports: [],
    controllers: [
        AppController,
    ],
    providers: [
        SessionAuthGuard,
        AuthService,
        UsersService,
        CookieSerializer,
        SessionGuard,
        LocalStrategy,
        CustomRedisStore,
    ],
})
export class AppModule {
}
