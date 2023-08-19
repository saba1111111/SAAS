import { AccountModel } from '@app/account';
import { PlanLevels } from '@app/common';
import { SubscriptionModel } from '@app/subscription';
import {
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Table,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'plans',
})
export class PlanModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  price: number;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  planDuration: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(PlanLevels)],
    },
  })
  level: string;

  @BelongsTo(() => AccountModel, {
    foreignKey: 'creatorId',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  accountModule: AccountModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  creatorId: number;

  @HasMany(() => SubscriptionModel, { foreignKey: 'planId' })
  subscriptionModules: SubscriptionModel[];
}
