import sequelize from 'sequelize';

export interface transactionConfig {
  transaction: sequelize.Transaction;
  lock?: sequelize.LOCK;
}
