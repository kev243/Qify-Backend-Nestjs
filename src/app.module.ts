import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './v1/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LinkModule } from './v1/link/link.module';
import { ProfileModule } from './v1/profile/profile.module';
import { PublicModule } from './v1/public/public.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { HealtService } from './healt/healt.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 seconde
        limit: 3, // Maximum 3 requêtes par seconde
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 20, // Maximum 20 requêtes par minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 100, // Maximum 100 requêtes par 15 minutes
      },
    ]),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // permet d’utiliser process.env partout
    }),
    PrismaModule,
    LinkModule,
    ProfileModule,
    PublicModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealtService],
})
export class AppModule {}
