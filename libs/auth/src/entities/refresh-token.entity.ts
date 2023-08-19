import { AccountModel } from '@app/account';
import {
  BelongsTo,
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'refresh_tokens',
})
export class RefreshTokenModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt: Date;

  @BelongsTo(() => AccountModel, {
    foreignKey: 'accountId',
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  accountModel: AccountModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  accountId: number;
}
