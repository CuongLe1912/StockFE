import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { LookupData } from "../domains/data/lookup.data";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { BooleanType, DataType } from "../domains/enums/data.type";

export class BooleanEx extends ObjectEx {
    public type?: BooleanType;
    public lookup?: LookupData;
    public autoSelect?: boolean;
    public allowUncheck?: boolean;
}

export function BooleanDecorator(options?: BooleanEx) {
    if (!options)
        options = new BooleanEx();
    options.dataType = DataType.Boolean;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.type) options.type = BooleanType.Checkbox;
    if (options.lookup && options.lookup.cached == null) options.lookup.cached = 0;
    if (options.allowClear === undefined || options.allowClear === null) options.allowClear = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    if (options.allowUncheck === undefined || options.allowUncheck === null) options.allowUncheck = false;
    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.placeholder) options.placeholder = options.label || label;
        if (!options.description) options.description = options.label || label;
        if (!options.key) options.key = options.target + '_' +  propertyKey + '_' + UtilityExHelper.randomText(8);
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' không được rỗng' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' đã tồn tại' });
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
