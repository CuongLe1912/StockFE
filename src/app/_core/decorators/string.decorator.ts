import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { LookupData } from "../domains/data/lookup.data";
import { DialogData } from "../domains/data/dialog.data";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { EditorParamData } from "../domains/data/editor.param.data";
import { StringType, DataType, TextTransformType, DropdownLoadType, ColorType } from "../domains/enums/data.type";
import { CustomUploadData } from "../domains/data/upload.data";

export class StringEx extends ObjectEx {
    public min?: number;
    public max?: number;
    public rows?: number;
    public maxTags?: number;
    public type?: StringType;
    public titleTags?: string;
    public delimiters?: string;                             // Dùng để phân tách các tags
    public lookup?: LookupData;
    public htmlToolbar?: string;
    public htmlMenubar?: boolean;
    public duplicates?: string[];
    public colorType?: ColorType;                           // Loại color cho control color-picker
    public requiredMatch?: string;
    public popupFile?: DialogData;                          // Kho tài liệu
    public popupImage?: DialogData;                         // Kho ảnh
    public requiredHashTag?: boolean;
    public variables?: EditorParamData[];                   // ẩn hiện tool bar trên editor
    public generateFunction?: () => string;
    public customUpload?: CustomUploadData;
    public textTransform?: TextTransformType;
}

export function StringDecorator(options?: StringEx) {
    if (!options)
        options = new StringEx();
    options.dataType = DataType.String;
    if (options.lookup)
        options.type = StringType.AutoComplete;
    if (!options.min) options.min = 0;
    if (!options.rows) options.rows = 5;
    if (!options.maxTags) options.maxTags = 10;
    if (!options.titleTags) options.titleTags = 'Tags';
    if (!options.delimiters) options.delimiters = ',';
    if (!options.type) options.type = StringType.Text;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.lookup) options.lookup = new LookupData();
    if (options.lookup.cached == null) options.lookup.cached = 0;
    if (!options.lookup.numberMax) options.lookup.numberMax = 1000;
    if (!options.lookup.propertyValue) options.lookup.propertyValue = 'Id';
    if (!options.lookup.loadType) options.lookup.loadType = DropdownLoadType.All;
    if (!options.lookup.propertyDisplay) options.lookup.propertyDisplay = ['Name'];
    if (options.allowClear === undefined || options.allowClear === null) options.allowClear = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    if (options.type == StringType.Html) {
        if (!options.htmlToolbar) options.htmlToolbar = 'uploadFile | uploadImage | undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';
        if (!options.htmlMenubar == null || !options.htmlMenubar == undefined) options.htmlMenubar = true;
    }
    if (!options.max) {
        switch (options.type) {
            case StringType.Tag: options.max = 100; break;
            case StringType.Code: options.max = 50; break;
            case StringType.Text: options.max = 250; break;
            case StringType.Phone: options.max = 15; break;
            case StringType.Email: options.max = 50; break;
            case StringType.Skype: options.max = 50; break;
            case StringType.Search: options.max = 50; break;
            case StringType.Link: options.max = 1000; break;
            case StringType.Account: options.max = 100; break;
            case StringType.Password: options.max = 20; break;
            case StringType.PhoneText: options.max = 15; break;
            case StringType.MultiText: options.max = 2000; break;
            case StringType.AutoComplete: options.max = 250; break;
        }
    }
    if (!options.icon) {
        switch (options.type) {
            case StringType.Code: options.icon = 'la la-code'; break;
            case StringType.Link: options.icon = 'la la-link'; break;
            case StringType.Phone: options.icon = 'la la-phone'; break;
            case StringType.Skype: options.icon = 'la la-skype'; break;
            case StringType.Account: options.icon = 'la la-user'; break;
            case StringType.Password: options.icon = 'la la-key'; break;
            case StringType.Search: options.icon = 'la la-search'; break;
            case StringType.Email: options.icon = 'la la-envelope'; break;
            case StringType.PhoneText: options.icon = 'la la-phone'; break;
        }
    }
    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.validators) options.validators = [];
        if (!options.placeholder) options.placeholder = options.label || label;
        if (!options.textTransform) options.textTransform = TextTransformType.None;
        if (!options.key) options.key = options.target + '_' + propertyKey + '_' + UtilityExHelper.randomText(8);
        if (options.type && options.type == StringType.LinkYoutube) options.placeholder = 'https://www.youtube.com/watch…';
        switch (options.type) {
            case StringType.Card: {
                options.validators.push({
                    pattern: PatternType.CardNumber,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.Link: {
                options.validators.push({
                    pattern: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.Email: {
                options.validators.push({
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.TagEmail: {
                options.validators.push({
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.Phone: {
                options.validators.push({
                    pattern: /^[\+]*\d+$/,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.PhoneText: {
                options.validators.push({
                    pattern: /^[\+]*\d+$/,
                    message: label + ' không đúng định dạng'
                });
            }
                break;
            case StringType.LinkYoutube: {
                options.validators.push({
                    pattern: /^http(?:s?):\/\/(?:www\.)?(youtube.com|youtu.be)\/(watch|shorts)[a-zA-z0-9_=#\?\&\/]*/,
                    message: label + ' không đúng định dạng Youtube'
                });
            }
                break;
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' đã tồn tại' });
        }
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' không được rỗng' });
        }
        if (options.max > 0) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Max, message: label + ' độ dài tối đa là ' + options.max + ' ký tự' });
        }
        if (options.min > 0) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Min, message: label + ' phải có tối thiểu là ' + options.min + ' ký tự' });
        }
        if (options.requiredMatch) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.RequiredMatch, message: label + ' không giống với ' + UtilityExHelper.createLabel(options.requiredMatch) });
        }
        if (options.duplicates && options.duplicates.length > 0) {
            if (!options.validators) options.validators = [];
            let message = options.duplicates.map(c => { return UtilityExHelper.createLabel(c) }).join(', ');
            options.validators.push({ pattern: PatternType.Duplicate, message: label + ' trùng với một trong các trường: ' + message });
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