import { CompressionAccessGuard } from '@app/compression/guards/compresion-access.guard';
import { CompressionService } from '@app/compression/services/compression.service';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('compression')
export class CompressionController {
  public constructor(private readonly compressionService: CompressionService) {}

  @UseGuards(CompressionAccessGuard)
  @Post('/')
  public async compressImage() {
    return this.compressionService.compressImage();
  }
}
