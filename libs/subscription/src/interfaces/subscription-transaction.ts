export interface SubscriptionTransaction {
  accountId: number;
  planId: number;
  amount: number;
  subscriptionExpirationDate: Date;
  tokenExpirationDate: Date;
}
