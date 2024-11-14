import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { NumberType, DataType } from "../domains/enums/data.type";

export class NumberEx extends ObjectEx {
    public min?: number;
    public max?: number;
    public step?: number;
    public unit?: string;
    public type?: NumberType;
    public decimals?: number;
    public allowZero?: boolean;
    public allowNegative?: boolean; // cho phép nhập số âm
    public minDepend?: string; // minDepend: property, không được nhỏ hơn property
    public maxDepend?: string; // maxDepend: property, không được lớn hơn property
}

export function NumberDecorator(options?: NumberEx) {
    if (!options)
        options = new NumberEx();
    options.dataType = DataType.Number;    
    if (!options.step) options.step = 1;
    if (!options.max) options.max = 1000000000;
    if (!options.decimals) {
        if (options.step.toString().indexOf('.') >= 0) {
            if (options.step.toString().indexOf('.00') >= 0) options.decimals = 3;
            else if (options.step.toString().indexOf('.0') >= 0) options.decimals = 2;
            else options.decimals = 1;
        } else options.decimals = 0;
    }
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.type) options.type = NumberType.Numberic;
    if (options.allowZero === undefined || options.allowZero === null) options.allowZero = false;
    if (options.allowClear === undefined || options.allowClear === null) options.allowClear = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    if (options.allowNegative === undefined || options.allowNegative === null) options.allowNegative = false;
    if (options.allowNegative) {
        options.allowZero = true;
        if (!options.min) options.min = -1000000000;
    } else {
        if (!options.min) options.min = 0;
    }
    if (options.min == 0) options.allowZero = true;
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
        if (options.min != null) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Min, message: label + ' không được nhỏ hơn ' + (options.unit ? UtilityExHelper.convertNumberMoney(options.min) : options.min)});
        }
        if (options.max != null) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Max, message: label + ' không được lớn hơn ' + (options.unit ? UtilityExHelper.convertNumberMoney(options.max) : options.max)});
        }
        if (options.minDepend) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.RequiredMin });
        }
        if (options.maxDepend) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.RequiredMax });
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