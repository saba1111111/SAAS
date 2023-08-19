import { subscriptionTokenStatuses } from '@app/common';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { SubscriptionModel } from './subscription.entity';

@Table({
  tableName: 'subscription_token',
})
export class SubscriptionTokenModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expireDate: Date;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(subscriptionTokenStatuses)],
    },
    defaultValue: subscriptionTokenStatuses.ACTIVE,
  })
  status: string;

  @BelongsTo(() => SubscriptionModel, { foreignKey: 'subscriptionId' })
  subscriptionModels: SubscriptionModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  subscriptionId: number;
}
