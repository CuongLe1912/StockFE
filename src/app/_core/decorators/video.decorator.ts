import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { CustomUploadData } from "../domains/data/upload.data";
import { DataType, StoreType } from "../domains/enums/data.type";

export class VideoEx extends ObjectEx {
    public url?: string;
    public min?: number;
    public max?: number;
    public size?: number;
    public accept?: string;
    public store?: StoreType;
    public totalSize?: number; // tổng size upload 1 lần
    public multiple?: boolean;
    public dragable?: boolean;
    public regexTypes?: RegExp;
    public customUpload?: CustomUploadData;
}

export function VideoDecorator(options?: VideoEx) {
    if (!options)
        options = new VideoEx();
    options.dataType = DataType.Video;
    if (!options.min) options.min = 0;
    if (!options.size) options.size = 100;
    if (!options.dragable) options.dragable = false;
    if (!options.totalSize) options.totalSize = 1000;
    if (!options.store) options.store = StoreType.Cloud;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.max) options.max = options.multiple ? 5 : 1;
    if (!options.description) options.description = 'Định dạng: mpeg, mp4, avi, webm...';
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = false;
    if (options.store == StoreType.DatabaseByte || options.store == StoreType.DatabaseBase64) options.multiple = false;
    if (!options.accept) options.accept = 'video/mpeg, video/ogg, video/webm, video/3gb, video/mp4, video/avi, video/wmv, video/vob, video/mkv, video/flv, video/wmv9';
    if (options.accept && !options.regexTypes) {
        let types = options.accept;
        types = types.replace('video/mpeg', 'mpeg');
        types = types.replace('video/ogg', 'ogg');
        types = types.replace('video/webm', 'webm');
        types = types.replace('video/mp4', 'mp4');
        types = types.replace('video/avi', 'avi');
        types = types.replace('video/wmv', 'wmv');
        types = types.replace('video/vob', 'vob');
        types = types.replace('video/mkv', 'mkv');
        types = types.replace('video/flv', 'flv');
        types = types.replace('video/wmv9', 'wmv9');        
        while (types.indexOf(',') >= 0)
            types = types.replace(',', '|');
        options.regexTypes = new RegExp('.(' + types + ')', 'i');
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
        if (options.min != null) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Min, message: label + ' không được nhỏ hơn ' + (options.unit ? UtilityExHelper.convertNumberMoney(options.min) : options.min) });
        }
        if (options.max != null) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Max, message: label + ' không được lớn hơn ' + (options.unit ? UtilityExHelper.convertNumberMoney(options.max) : options.max) });
        }
        if (options.customValidators && options.customValidators.length > 0) {
            options.customValidators.forEach((item: Validator) => {
                if (!item.message)
                    item.message = label + ' không đúng định dạng';
                options.validators.push(item);
            });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}