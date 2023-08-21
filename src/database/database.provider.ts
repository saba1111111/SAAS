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
        dialect: config.get('POSTGRES_DIALECT') as Dialect,
        host: config.get('POSTGRES_HOST'),
        port: config.get('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
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
