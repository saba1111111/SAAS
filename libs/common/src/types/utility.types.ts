export type FindOptions<T> = {
  [K in keyof T]?: T[K];
};
