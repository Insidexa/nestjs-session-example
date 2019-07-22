import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersService } from './users-service';
import { CookieSerializer } from './auth/cookie-serializer';
import { SessionGuard } from './auth/session-guard';
import { SessionAuthGuard } from './auth/session-auth-guard';
import { AuthService } from './auth-service';
import { LocalStrategy } from './auth/local-strategy';
import { SessionStore } from './auth/session-store';

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
        SessionStore,
    ],
})
export class AppModule {
}
