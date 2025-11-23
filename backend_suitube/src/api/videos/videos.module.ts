import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { SuiGraphQLService } from '../../services/blockchain/suigraphql.service';
import { WalrusSealService } from '../../services/storage/walrus-seal.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, SuiGraphQLService, WalrusSealService],
})
export class VideosModule {}

