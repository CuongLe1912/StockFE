export enum DataType {
    String = 1,
    File,
    Image,
    Video,
    Number,
    Boolean,
    DateTime,
    DropDown
}
export function DataTypeAware(constructor: Function) {
    constructor.prototype.DataType = DataType;
}

export enum StoreType {
    Cloud,
    DatabaseByte,
    DatabaseBase64,
}
export function StoreTypeAware(constructor: Function) {
    constructor.prototype.StoreType = StoreType;
}

export enum NumberType {
    Text = 1,
    Range,
    Between,
    Numberic,
}
export function NumberTypeAware(constructor: Function) {
    constructor.prototype.NumberType = NumberType;
}

export enum BooleanType {
    RadioButton = 1,
    Checkbox,
    Toggle,
    Star
}
export function BooleanTypeAware(constructor: Function) {
    constructor.prototype.BooleanType = BooleanType;
}

export enum DateTimeType {
    Date = 1,
    Time,
    DateTime,
    DateRange,
    DateMonth
}
export function DateTimeTypeAware(constructor: Function) {
    constructor.prototype.DateTimeType = DateTimeType;
}

export enum StringType {
    Cvc = 1,
    Otp,
    Tag,
    Text,
    Code,
    Link,
    Card,
    Html,
    Json,
    Phone,
    Email,
    Skype,
    Color,
    Search,
    Number,
    Account,
    Address,
    TagEmail,
    Password,
    MultiText,
    PhoneText,
    LinkYoutube,
    AutoGenerate,
    AutoComplete,
}
export function StringTypeAware(constructor: Function) {
    constructor.prototype.StringType = StringType;
}

export enum DropdownType {
    Normal = 1,
    Between,
    BetweenArea,
    BetweenPrice,
}
export function DropdownTypeAware(constructor: Function) {
    constructor.prototype.DropdownType = DropdownType;
}

export enum DropdownLoadType {
    All = 1,
    Ajax
}
export function DropdownLoadTypeAware(constructor: Function) {
    constructor.prototype.DropdownLoadType = DropdownLoadType;
}

export enum TextTransformType {
    None = 1,
    LowerCase,
    UpperCase
}
export function TextTransformTypeAware(constructor: Function) {
    constructor.prototype.TextTransformType = TextTransformType;
}

export enum ColorType {
    All = 0,
    Hex,
    Rgb,
    Hsl
}