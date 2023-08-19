import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CompressionService {
  public constructor() {}

  public async compressImage() {
    try {
      return 'Ilias compression logic';
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
