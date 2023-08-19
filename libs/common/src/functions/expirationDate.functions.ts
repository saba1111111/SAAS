export function expirationDate(durationInSeconds: number): Date {
  return new Date(Date.now() + durationInSeconds * 1000);
}
