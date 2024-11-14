import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { LookupData } from "../domains/data/lookup.data";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { DataType, DropdownLoadType, DropdownType } from "../domains/enums/data.type";

export class DropDownEx extends ObjectEx {
    public max?: number;
    public text?: string;
    public autoHide?: boolean;
    public multiple?: boolean;
    public lookup?: LookupData;
    public type?: DropdownType;
    public selectAll?: boolean;
    public autoSelect?: boolean;
}

export function DropDownDecorator(options?: DropDownEx) {
    if (!options)
        options = new DropDownEx();
    options.dataType = DataType.DropDown;
    if (!options.max) options.max = 100;
    if (!options.autoHide) options.autoHide = false;
    if (!options.type) options.type = DropdownType.Normal;
    if (!options.allowSearch) options.allowSearch = false;
    if (options.multiple == null) options.multiple = false;
    if (!options.lookup) options.lookup = new LookupData();
    if (options.lookup.cached == null) options.lookup.cached = 0;
    if (!options.lookup.numberMax) options.lookup.numberMax = 1000;
    if (!options.lookup.propertyValue) options.lookup.propertyValue = 'Id';
    if (!options.lookup.loadType) options.lookup.loadType = DropdownLoadType.All;
    if (!options.lookup.propertyDisplay) options.lookup.propertyDisplay = ['Name'];
    if (options.allowClear === undefined || options.allowClear === null) options.allowClear = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;

    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.key) options.key = options.target + '_' + propertyKey + '_' + UtilityExHelper.randomText(8);
        if (!options.placeholder) options.placeholder = options.label || label;
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