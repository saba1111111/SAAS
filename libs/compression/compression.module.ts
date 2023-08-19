import { Module } from '@nestjs/common';
import { CompressionService } from './src/services/compression.service';

@Module({
  providers: [CompressionService],
  exports: [CompressionService],
})
export class CompressionLibModule {}
