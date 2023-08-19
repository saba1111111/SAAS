import { AccountModel } from '@app/account';
import { RefreshTokenModel } from '@app/auth';
import { SEQUELIZE_TOKEN } from '@app/common';
import { PlanModel } from '@app/plan';
import { SubscriptionModel } from '@app/subscription';
import { SubscriptionTokenModel } from '@app/subscription';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: SEQUELIZE_TOKEN,
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: config.get('DB_DIALECT') as Dialect,
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
      });
      sequelize.addModels([
        AccountModel,
        RefreshTokenModel,
        PlanModel,
        SubscriptionModel,
        SubscriptionTokenModel,
      ]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
