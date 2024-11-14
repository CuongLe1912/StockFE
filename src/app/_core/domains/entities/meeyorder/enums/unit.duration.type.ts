
export enum UnitDurationType {
  Day = 1,
  Month,
  Year,
  Minutes,
  Unlimited,
}

export function UnitDurationTypeAware(constructor: Function) {
  constructor.prototype.UnitDurationType = UnitDurationType;
}
