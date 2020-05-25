import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { CustomRedisStore } from './auth/custom-redis-store.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const redisStore = app.get(CustomRedisStore);

    app.use(session({
        store: redisStore,
        secret: 'example',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 120, // 2 min
            sameSite: true,
            secure: false
        },
        unset: 'destroy',
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(3000);
}

bootstrap();
