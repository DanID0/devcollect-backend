import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import session from 'express-session';
import passport from 'passport';

config();
async function bootstrap() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not defined in environment variables');
}
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 
      }
    }),
  );
  app.use(passport.initialize())
  app.use(passport.session()) 
  await app.listen(3000)
}

bootstrap();

