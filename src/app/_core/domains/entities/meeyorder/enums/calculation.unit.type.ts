export enum CalculationUnitType {
  Round = 1,
  Package,
  MapDistrict,
  Day,
}
export function CalculationUnitTypeAware(constructor: Function) {
  constructor.prototype.CalculationUnitType = CalculationUnitType;
}
