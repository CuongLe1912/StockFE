import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { DialogData } from "../domains/data/dialog.data";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { CustomUploadData } from "../domains/data/upload.data";
import { DataType, StoreType } from "../domains/enums/data.type";

export class FileEx extends ObjectEx {
    public url?: string;
    public max?: number;
    public min?: number;
    public size?: number;
    public accept?: string;
    public store?: StoreType;
    public totalSize?: number; // tổng size upload 1 lần
    public dragable?: boolean;
    public multiple?: boolean;
    public regexTypes?: RegExp;
    public duplicate?: boolean; // Kiểm tra trùng nội dung ảnh
    public popupArchive?: DialogData // Kho tài liệu
    public customUpload?: CustomUploadData;
}

export function FileDecorator(options?: FileEx) {
    if (!options)
        options = new FileEx();
    options.dataType = DataType.File;
    if (!options.min) options.min = 0;
    if (!options.size) options.size = 100;
    if (!options.dragable) options.dragable = false;
    if (!options.totalSize) options.totalSize = 1000;
    if (!options.url) options.url = 'upload/uploadfile';
    if (!options.store) options.store = StoreType.Cloud;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.max) options.max = options.multiple ? 50 : 1;
    if (!options.description) options.description = 'Định dạng: pdf, doc, xls, zip...';
    if (options.duplicate === undefined || options.duplicate === null) options.duplicate = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = false;
    if (options.store == StoreType.DatabaseByte || options.store == StoreType.DatabaseBase64) options.multiple = false;
    if (!options.accept) options.accept = 'image/jpg,image/jpeg,image/png,image/gif,image/svg+xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,application/xml,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed';
    if (options.accept && !options.regexTypes) {
        let types = options.accept;
        types = types.replace('image/jpg', 'jpg');
        types = types.replace('image/png', 'png');
        types = types.replace('image/gif', 'gif');
        types = types.replace('video/mp4', 'mp4');
        types = types.replace('video/avi', 'avi');
        types = types.replace('video/wmv', 'wmv');
        types = types.replace('video/vob', 'vob');
        types = types.replace('video/mkv', 'mkv');
        types = types.replace('video/flv', 'flv');
        types = types.replace('video/ogg', 'ogg');
        types = types.replace('text/plain', 'txt');
        types = types.replace('image/jpeg', 'jpeg');       
        types = types.replace('video/mpeg', 'mpeg');
        types = types.replace('video/webm', 'webm');
        types = types.replace('video/wmv9', 'wmv9'); 
        types = types.replace('image/svg+xml', 'svg'); 
        types = types.replace('application/xml', 'xml');
        types = types.replace('application/x-zip,', '');
        types = types.replace('application/zip', 'zip');
        types = types.replace('application/pdf', 'pdf');
        types = types.replace('application/msword', 'doc');
        types = types.replace('application/octet-stream,', '');
        types = types.replace('application/vnd.ms-excel', 'xls');
        types = types.replace('application/x-zip-compressed', 'rar');
        types = types.replace('application/vnd.ms-powerpoint', 'ppt');
        types = types.replace('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx');
        types = types.replace('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx');
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