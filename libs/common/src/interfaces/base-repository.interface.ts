export interface BaseRepository<T> {
  create(entity: unknown, transactionConfig?: object): Promise<T>;
  find(findOptions?: Partial<T>, transactionConfig?: object): Promise<T[] | []>;
  findOne(findOptions: Partial<T>, transactionConfig?: object): Promise<T>;
  update(
    whereClause: Partial<T>,
    updateObject: Partial<T>,
    transactionConfig?: object,
  ): Promise<unknown>;
  remove(id: number, transactionConfig?: object): Promise<number>;
}
