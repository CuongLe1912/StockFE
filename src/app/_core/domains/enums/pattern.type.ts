export enum PatternType {
    Min = 'min', 
    Max = 'max',
    CardCvc = 'cvc',
    Unique = 'unique',
    CardNumber = 'card',
    Required = 'required',
    Duplicate = 'duplicate',
    RequiredMatch = 'match',
    RequiredMin = 'minDepend',
    RequiredMax = 'maxDepend'
}
export function PatternTypeAware(constructor: Function) {
    constructor.prototype.PatternType = PatternType;
}
