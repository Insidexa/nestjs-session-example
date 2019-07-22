import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { SessionStore } from './auth/session-store';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const sessionStore = app.get(SessionStore);

    app.use(session({
        store: sessionStore,
        secret: 'example',
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(3000);
}

bootstrap();
