export enum DecoratorType {
    String = 1,
    Number,
    Boolean,
    Datetime,
    DropDown,
    File,
    Image,
    Video,
    Object,
}

export enum SystemType {
    String = 'string',
    Int = 'int',
    Long = 'long',
    Double = 'double',
    Decimal = 'decimal',
    Boolean = 'boolean',
    Bool = 'bool',
    Datetime = 'datetime',
    Object = 'object',
}

export class DecoratorSystemType {
    public static DECORATOR_SYSTEM = [
        { label: DecoratorType.String, value: [SystemType.String] },
        { label: DecoratorType.Number, value: [SystemType.Int, SystemType.Long, SystemType.Double, SystemType.Decimal] },
        { label: DecoratorType.Boolean, value: [SystemType.Boolean, SystemType.Bool] },
        { label: DecoratorType.Datetime, value: [SystemType.Datetime] },
        { label: DecoratorType.Object, value: [SystemType.Object] },
    ];
}