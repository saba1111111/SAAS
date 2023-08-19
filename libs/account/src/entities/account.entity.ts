import { RefreshTokenModel } from '@app/auth';
import { AccountRoles } from '@app/common';
import { PlanModel } from 'libs/plan/src';
import { SubscriptionModel } from '@app/subscription';
import {
  Table,
  Column,
  Model,
  HasOne,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'accounts',
})
export class AccountModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(AccountRoles)],
    },
    defaultValue: AccountRoles.USER,
  })
  role: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  public balance: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  public authorize: boolean;

  @HasOne(() => RefreshTokenModel, { foreignKey: 'accountId' })
  refreshTokenModel: RefreshTokenModel;

  @HasMany(() => PlanModel, { foreignKey: 'creatorId' })
  planModels: PlanModel[];

  @HasMany(() => SubscriptionModel, { foreignKey: 'subscriberId' })
  subscriptionModels: SubscriptionModel[];
}
