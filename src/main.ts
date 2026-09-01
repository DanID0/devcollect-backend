import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import session from 'express-session';
import passport from 'passport';
import connectPgSimple from 'connect-pg-simple';
config();
async function bootstrap() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined in environment variables');
  }
  const app = await NestFactory.create(AppModule);
  const pgSession = connectPgSimple(session);
  // app.useGlobalGuards(new AdminGuard());
  app.use(
    session({
      store: new pgSession({
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  (app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  }),
    await app.listen(3000));
}

bootstrap();
