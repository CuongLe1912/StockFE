import { Validator } from "./validator";
import { AppConfig } from "../helpers/app.config";
import { DataType } from "../domains/enums/data.type";
import { registerProperty } from "./register.metadata";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { CompareType } from "../domains/enums/compare.type";
import { LookupUniqueData } from "../domains/data/lookup.data";

export enum ColumnClassFormat {
    Column2 = 'col-sm-2',
    Column3 = 'col-sm-3',
    Column4 = 'col-sm-4',
    Column6 = 'col-sm-6',
    Column8 = 'col-sm-8',
    Column9 = 'col-sm-9',
    Column10 = 'col-sm-10',
    Column12 = 'col-sm-12',
}

export class ObjectEx {
    public id?: string;
    public key?: string;
    public icon?: string;
    public unit?: string;
    public index?: number;
    public label?: string;
    public error?: string;
    public subfix?: string;
    public target?: string;
    public viewer?: boolean;
    public property?: string;
    public defaultValue?: any;
    public readonly?: boolean;
    public required?: boolean;
    public dataType?: DataType;
    public placeholder?: string;
    public description?: string;
    public allowClear?: boolean;
    public targetObject?: string;
    public allowSearch?: boolean;
    public allowFilter?: boolean;
    public validators?: Validator[];
    public unique?: LookupUniqueData;
    public compareType?: CompareType;
    public customValidators?: Validator[];
    public columnClass?: ColumnClassFormat;

    constructor() {
        if (!AppConfig.ApiUrl)
            AppConfig.setEnvironment();
    }
}

export function ObjectDecorator(options?: ObjectEx) {
    if (!options)
        options = new ObjectEx();
    options.dataType = DataType.String;
    if (!options.allowClear) options.allowClear = true;
    if (!options.allowSearch) options.allowSearch = false;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    return function (target: any, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.placeholder) options.placeholder = options.label || label;
        if (!options.id) options.id = options.target + '_' + propertyKey + '_' + UtilityExHelper.randomText(8);
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' không được rỗng' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' đã tồn tại' });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}