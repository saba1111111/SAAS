import { AccountModel } from '@app/account';
import { SubscriptionStatuses } from '@app/common';
import { PlanModel } from 'libs/plan/src';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { SubscriptionTokenModel } from './subscriptionToken.entity';

@Table({
  tableName: 'subscriptions',
})
export class SubscriptionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(SubscriptionStatuses)],
    },
    defaultValue: SubscriptionStatuses.ACTIVE,
  })
  status: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expireDate: Date;

  @BelongsTo(() => PlanModel, { foreignKey: 'planId' })
  planEntity: PlanModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  planId: number;

  @BelongsTo(() => AccountModel, { foreignKey: 'subscriberId' })
  accountEntity: AccountModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  subscriberId: number;

  @HasMany(() => SubscriptionTokenModel, { foreignKey: 'subscriptionId' })
  subscriptionModels: SubscriptionTokenModel[];
}
