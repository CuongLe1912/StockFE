export enum UseTimeType {
  Unlimited = 0,
  Day30 = 30,
  Day60 = 60,
  Day90 = 90,
  Month6 = 6,
  Year1 = 1,
  CustomUseTime = -1
}
export function UseTimeTypeAware(constructor: Function) {
  constructor.prototype.UseTimeType = UseTimeType;
}
