import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { DateTimeType, DataType } from "../domains/enums/data.type";

export enum DateTimeFormat {
    HM = 'hh:ii',
    MY = 'mm/yyyy',
    DMY = 'dd/mm/yyyy',
    MDY = 'mm/dd/yyyy',
    YMD = 'yyyy/mm/dd',
    DMYHM = 'dd/mm/yyyy hh:ii',
    MDYHM = 'mm/dd/yyyy hh:ii',
    DMYHMS = 'dd/mm/yyyy hh:ii:ss',
}

export class DateTimeEx extends ObjectEx {
    public min?: Date;
    public max?: Date;
    public view?: string;
    public format?: string;
    public inline?: boolean;
    public maxRange?: number;                // ngày có thể chọn cho datetimerangepicker
    public multiple?: number;
    public type?: DateTimeType;
    public minCurent?: boolean;
    public maxCurent?: boolean;
    public minDepend?: string | string[];
    public maxDepend?: string | string[];
}

export function DateTimeDecorator(options?: DateTimeEx) {
    if (!options)
        options = new DateTimeEx();
    options.dataType = DataType.DateTime;
    if (!options.inline) options.inline = false;
    if (!options.icon) options.icon = 'la la-calendar';
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.type) options.type = DateTimeType.DateTime;
    if (!options.min) options.min = new Date(1900, 1, 1, 0, 0, 0, 0);
    if (options.allowClear === undefined || options.allowClear === null) options.allowClear = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    if (!options.max) {
        let now = new Date(),
            day = now.getDate(),
            month = now.getMonth() + 1,
            year = now.getFullYear() + 100;
        options.max = new Date(year, month, day);
    }
    if (!options.format) {
        switch (options.type) {
            case DateTimeType.Time: options.format = DateTimeFormat.HM; break;
            case DateTimeType.Date: options.format = DateTimeFormat.DMY; break;
            case DateTimeType.DateRange: options.format = DateTimeFormat.DMY; break;
            case DateTimeType.DateTime: options.format = DateTimeFormat.DMYHM; break;
            case DateTimeType.DateMonth: options.format = DateTimeFormat.MY; break;
        }
    }
    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.placeholder) options.placeholder = options.label || label;
        if (!options.key) options.key = options.target + '_' + propertyKey + '_' + UtilityExHelper.randomText(8);
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' không được rỗng' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' đã tồn tại' });
        }
        if (options.max || options.maxCurent) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Max });
        }
        if (options.min || options.minCurent) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Min });
        }
        if (options.customValidators && options.customValidators.length > 0) {
            if (!options.validators) options.validators = [];
            options.customValidators.forEach((item: Validator) => {
                if (!item.message)
                    item.message = label + ' không đúng định dạng';
                options.validators.push(item);
            });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}