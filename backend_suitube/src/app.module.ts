import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuiGraphQLService } from './services/blockchain/suigraphql.service';
import { WalrusSealService } from './services/storage/walrus-seal.service';
import { VideosModule } from './api/videos/videos.module';
import appConfig from './config/app.config';
import suiConfig from './config/sui.config';
import walrusConfig from './config/walrus.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, suiConfig, walrusConfig],
      envFilePath: '.env',
    }),
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    // API Modules
    VideosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SuiGraphQLService,
    WalrusSealService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [SuiGraphQLService, WalrusSealService],
})
export class AppModule {}
