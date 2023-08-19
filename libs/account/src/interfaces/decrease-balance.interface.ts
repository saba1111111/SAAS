import sequelize from 'sequelize';

export interface DecreaceBalance {
  accountId: number;
  amount: number;
  transaction?: sequelize.Transaction;
  lock?: string;
}
