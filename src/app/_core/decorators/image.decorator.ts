import { Validator } from "./validator";
import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { DialogData } from "../domains/data/dialog.data";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { DimensionData } from "../domains/data/dimension.data";
import { CustomUploadData } from "../domains/data/upload.data";
import { StoreType, DataType } from "../domains/enums/data.type";

export class ImageEx extends ObjectEx {
    public url?: string;
    public max?: number;
    public min?: number;
    public size?: number;
    public note?: boolean;
    public accept?: string;
    public choice?: boolean;
    public store?: StoreType;
    public multiple?: boolean;
    public dragable?: boolean;
    public totalSize?: number; // tổng size upload 1 lần
    public duplicate?: boolean;                 // Kiểm tra trùng nội dung ảnh
    public regexTypes?: RegExp;
    public dimension?: DimensionData;
    public popupArchive?: DialogData; // Component kho
    public customUpload?: CustomUploadData;
}

export function ImageDecorator(options?: ImageEx) {
    if (!options)
        options = new ImageEx();
    options.dataType = DataType.Image;
    if (!options.size) options.size = 10;
    if (!options.note) options.note = false;
    if (!options.choice) options.choice = false;
    if (!options.dragable) options.dragable = false;
    if (!options.totalSize) options.totalSize = 1000;
    if (!options.store) options.store = StoreType.Cloud;
    if (!options.url) options.url = 'upload/uploadimage';
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.max) options.max = options.multiple ? 50 : 1;
    if (!options.accept) options.accept = 'image/jpg,image/jpeg,image/png';
    if (options.allowClear == null || options.allowClear == undefined) options.allowClear = true;
    if (options.store == StoreType.DatabaseByte || options.store == StoreType.DatabaseBase64) options.multiple = false;
    if (options.accept && !options.regexTypes) {
        let types = options.accept;
        types = types.replace('image/jpg', 'jpg');
        types = types.replace('image/png', 'png');
        types = types.replace('image/gif', 'gif');
        types = types.replace('image/jpeg', 'jpeg');
        while (types.indexOf(',') >= 0)
            types = types.replace(',', '|');
        options.regexTypes = new RegExp('.(' + types + ')', 'i');
    }
    if (!options.description) options.description = 'Định dạng: png, jpg, jpeg...';
    if (options.duplicate === undefined || options.duplicate === null) options.duplicate = true;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = false;
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