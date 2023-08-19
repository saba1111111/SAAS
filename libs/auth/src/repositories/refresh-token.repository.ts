import { Injectable } from '@nestjs/common';
import { RefreshToken, RefreshTokenRepository } from '../interfaces';
import { RefreshTokenModel } from '../entities/refresh-token.entity';
import { FindOptions } from '@app/common';

@Injectable()
export class RefreshTokenSequilizeRepositoy implements RefreshTokenRepository {
  public async create(data: RefreshToken) {
    const refreshToken = new RefreshTokenModel();
    refreshToken.token = data.token;
    refreshToken.accountId = +data.accountId;
    refreshToken.expiresAt = data.expiresAt;

    return refreshToken.save();
  }

  public findOne(
    findOptions: FindOptions<RefreshTokenModel>,
  ): Promise<RefreshTokenModel> {
    return RefreshTokenModel.findOne({ where: findOptions });
  }

  public find() {
    return RefreshTokenModel.findAll();
  }

  public remove(accountId: number): Promise<number> {
    return RefreshTokenModel.destroy({ where: { accountId } });
  }

  public update(
    whereClause: FindOptions<RefreshToken>,
    updateObject: FindOptions<RefreshToken>,
  ): Promise<unknown> {
    return RefreshTokenModel.update(updateObject, { where: whereClause });
  }
}
