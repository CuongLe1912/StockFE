import "reflect-metadata";
import * as _ from "lodash";
import { KeyValue } from "../domains/data/key.value";
import { FileData } from "../domains/data/file.data";
import { FileEx } from "../decorators/file.decorator";
import { ResultApi } from "../domains/data/result.api";
import { ImageEx } from "../decorators/image.decorator";
import { VideoEx } from "../decorators/video.decorator";
import { LookupData } from "../domains/data/lookup.data";
import { OptionItem } from "../domains/data/option.item";
import { NumberEx } from "../decorators/number.decorator";
import { ObjectEx } from "../decorators/object.decorator";
import { StringEx } from "../decorators/string.decorator";
import { Subscription } from "rxjs/internal/Subscription";
import { AddressData } from "../domains/data/address.data";
import { BooleanEx } from "../decorators/boolean.decorator";
import { UtilityExHelper } from "../helpers/utility.helper";
import { DropDownEx } from "../decorators/dropdown.decorator";
import { DateTimeEx } from "../decorators/datetime.decorator";
import { DecoratorHelper } from "../helpers/decorator.helper";
import { AdminApiService } from "../services/admin.api.service";
import { ComboBoxComponent } from "./combobox/combobox.component";
import { AdminEventService } from "../services/admin.event.service";
import { UploadFileComponent } from "./upload.file/upload.file.component";
import { UploadImageComponent } from "./upload.image/upload.image.component";
import { UploadVideoComponent } from "./upload.video/upload.video.component";
import { BooleanType, DataType, DateTimeType, DropdownLoadType, NumberType, StringType } from "../domains/enums/data.type";
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, OnChanges, DoCheck } from "@angular/core";

@Component({
    selector: 'editor',
    styleUrls: ['./editor.component.scss'],
    templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit, OnChanges, DoCheck {
    DataType = DataType;
    StringType = StringType;
    NumberType = NumberType;
    BooleanType = BooleanType;
    DateTimeType = DateTimeType;

    hide: boolean = false;
    private objectDiffer: any;
    changing: boolean = false;
    subscribeValidation: Subscription;
    textType: StringType = StringType.Text;
    address: AddressData = new AddressData();
    dateType: DateTimeType = DateTimeType.Date;
    boolType: BooleanType = BooleanType.Checkbox;
    @ViewChild('combobox') combobox: ComboBoxComponent;
    @ViewChild('uploadFile') file: UploadFileComponent;
    @ViewChild('uploadImage') image: UploadImageComponent;
    @ViewChild('uploadVideo') video: UploadVideoComponent;

    @Input() params: any;
    @Input() object: any;
    @Input() html: boolean;
    @Input() label: string;
    @Input() viewer: boolean;
    @Input() property: string;
    @Input() readonly: boolean;
    @Input() className: string;
    @Input() decorator: ObjectEx;
    @Input() labelInline: boolean;
    @Output() onBlur = new EventEmitter<string>();
    @Output('clearValue') clearValue = new EventEmitter<any>();
    @Output('loaded') loaded = new EventEmitter<OptionItem[]>();
    @Output('valueChange') valueChange = new EventEmitter<any>();
    @Output('keyPressEnter') keyPressEnter = new EventEmitter<any>();
    @Output('captureChange') captureChange = new EventEmitter<string>();
    @Output('optionChange') optionChange = new EventEmitter<OptionItem | OptionItem[]>();

    constructor(
        public cd: ChangeDetectorRef,
        public event: AdminEventService,
        public service: AdminApiService) {

    }

    ngOnInit() {
        let decorator: ObjectEx;
        if (this.property.indexOf('.') >= 0) {
            let className = this.property.split('.')[0],
                propertyName = this.property.split('.')[1],
                tempDecorator = DecoratorHelper.decoratorProperty(className, propertyName);
            decorator = _.cloneDeep(tempDecorator || new ObjectEx());
        } else {
            let propertyName = this.property,
                className = this.object.constructor.name,
                tempDecorator = DecoratorHelper.decoratorProperty(className, propertyName);
            decorator = _.cloneDeep(tempDecorator || new ObjectEx());
        }
        if (this.decorator) {
            if (this.label) decorator.label = this.label;            
            if (this.readonly == true || this.readonly == false)
                this.decorator.readonly = this.readonly;
            if (this.decorator.id) decorator.id = this.decorator.id;
            if (this.decorator.icon) decorator.icon = this.decorator.icon;
            if (this.decorator.key != null) decorator.key = this.decorator.key;
            if (this.decorator.label != null) decorator.label = this.decorator.label;
            if (this.decorator.dataType) decorator.dataType = this.decorator.dataType;
            if (this.decorator.subfix != null) decorator.subfix = this.decorator.subfix;
            if (this.decorator.readonly != null) decorator.readonly = this.decorator.readonly;
            if (this.decorator.required != null) decorator.required = this.decorator.required;
            if (this.decorator.placeholder) decorator.placeholder = this.decorator.placeholder;
            if (this.decorator.description != null) decorator.description = this.decorator.description;
            if (this.decorator.index != null && this.decorator.index != undefined) decorator.index = this.decorator.index;
            if (this.decorator.allowClear == true || this.decorator.allowClear == false) decorator.allowClear = this.decorator.allowClear;
            switch (decorator.dataType) {
                case DataType.Number: {
                    let temp = <NumberEx>this.decorator;

                    // Set default value
                    if (!(<NumberEx>decorator).type) (<NumberEx>decorator).type = NumberType.Numberic;

                    // Set other value
                    if (temp.min) (<NumberEx>decorator).min = temp.min || 0;
                    if (temp.step) (<NumberEx>decorator).step = temp.step || 1;
                    if (temp.max) (<NumberEx>decorator).max = temp.max || 10000;
                    if (temp.unit) (<NumberEx>decorator).unit = temp.unit || '';
                    if (temp.decimals) (<NumberEx>decorator).decimals = temp.decimals;
                    if (temp.type) (<NumberEx>decorator).type = temp.type || NumberType.Numberic;
                }
                    break;
                case DataType.String: {
                    let temp = <StringEx>this.decorator;
                    // Set default value
                    if (!(<StringEx>decorator).type) (<StringEx>decorator).type = StringType.Text;

                    // Set other value
                    if (temp.min) (<StringEx>decorator).min = temp.min || 0;
                    if (temp.max) (<StringEx>decorator).max = temp.max || 250;
                    if (temp.rows) (<StringEx>decorator).rows = temp.rows || 3;
                    if (temp.maxTags) (<StringEx>decorator).maxTags = temp.maxTags;
                    if (temp.popupFile) (<StringEx>decorator).popupFile = temp.popupFile;
                    if (temp.popupImage) (<StringEx>decorator).popupImage = temp.popupImage;
                    if (temp.delimiters) (<StringEx>decorator).delimiters = temp.delimiters;
                    if (temp.type) (<StringEx>decorator).type = temp.type || StringType.Text;
                }
                    break;
                case DataType.Boolean: {
                    let temp = <BooleanEx>this.decorator;

                    // Set default value
                    if (this.params) {
                        if (!(<BooleanEx>decorator).lookup)
                            (<BooleanEx>decorator).lookup = new LookupData();
                        (<DropDownEx>decorator).lookup.params = this.params;
                    }
                    if (temp.description) (<BooleanEx>decorator).description = temp.description || '';
                    if (temp.autoSelect == true || temp.autoSelect == false) (<DropDownEx>decorator).autoSelect = temp.autoSelect;
                    if (temp.lookup) {
                        if (!(<BooleanEx>decorator).lookup)
                            (<BooleanEx>decorator).lookup = new LookupData();
                        if (temp.lookup && temp.lookup.url) (<BooleanEx>decorator).lookup.url = temp.lookup.url;
                        if (temp.lookup && temp.lookup.items) (<BooleanEx>decorator).lookup.items = temp.lookup.items;
                        if (temp.lookup && temp.lookup.params) (<DropDownEx>decorator).lookup.params = temp.lookup.params;
                        if (temp.lookup && temp.lookup.cached) (<DropDownEx>decorator).lookup.cached = temp.lookup.cached;
                        if (temp.lookup && temp.lookup.selected) (<DropDownEx>decorator).lookup.selected = temp.lookup.selected;
                        if (temp.lookup && temp.lookup.emptyItem) (<DropDownEx>decorator).lookup.emptyItem = temp.lookup.emptyItem;
                    }
                }
                    break;
                case DataType.DateTime: {
                    let temp = <DateTimeEx>this.decorator;
                    let now = new Date(),
                        day = now.getDate(),
                        month = now.getMonth() + 1,
                        year = now.getFullYear() + 100,
                        maxDate = new Date(year, month, day);
                    // Set default value
                    if (!(<DateTimeEx>decorator).type)
                        (<DateTimeEx>decorator).type = DateTimeType.Date;
                    if (temp.format) (<DateTimeEx>decorator).format = temp.format;
                    if (temp.max) (<DateTimeEx>decorator).max = temp.max || maxDate;
                    if (temp.inline) (<DateTimeEx>decorator).inline = temp.inline || false;
                    if (temp.multiple) (<DateTimeEx>decorator).multiple = temp.multiple || 90;
                    if (temp.type) (<DateTimeEx>decorator).type = temp.type || DateTimeType.Date;
                    if (temp.min) (<DateTimeEx>decorator).min = temp.min || new Date(1900, 1, 1, 0, 0, 0, 0);
                }
                    break;
                case DataType.DropDown: {
                    let temp = <DropDownEx>this.decorator;

                    // Set default value
                    if (temp.max) (<DropDownEx>decorator).max = temp.max;
                    if (temp.text) (<DropDownEx>decorator).text = temp.text;
                    if (temp.multiple != null) (<DropDownEx>decorator).multiple = temp.multiple;
                    if (!(<DropDownEx>decorator).lookup)
                        (<DropDownEx>decorator).lookup = new LookupData();
                    if (this.params) (<DropDownEx>decorator).lookup.params = this.params;
                    if (temp.lookup && temp.lookup.url) (<DropDownEx>decorator).lookup.url = temp.lookup.url;
                    if (temp.lookup && temp.lookup.items) (<DropDownEx>decorator).lookup.items = temp.lookup.items;
                    if (temp.lookup && temp.lookup.cached) (<DropDownEx>decorator).lookup.cached = temp.lookup.cached;
                    if (temp.lookup && temp.lookup.params) (<DropDownEx>decorator).lookup.params = temp.lookup.params;
                    if (temp.autoHide == true || temp.autoHide == false) (<DropDownEx>decorator).autoHide = temp.autoHide;
                    if (temp.lookup && temp.lookup.loadType) (<DropDownEx>decorator).lookup.loadType = temp.lookup.loadType;
                    if (temp.lookup && temp.lookup.selected) (<DropDownEx>decorator).lookup.selected = temp.lookup.selected;
                    if (temp.lookup && temp.lookup.emptyItem) (<DropDownEx>decorator).lookup.emptyItem = temp.lookup.emptyItem;
                    if (temp.autoSelect == true || temp.autoSelect == false) (<DropDownEx>decorator).autoSelect = temp.autoSelect;
                    if (temp.allowSearch == true || temp.allowSearch == false) (<DropDownEx>decorator).allowSearch = temp.allowSearch;
                }
                    break;
                case DataType.File: {
                    let temp = <FileEx>this.decorator;

                    // Set default value
                    if (temp.url) (<FileEx>decorator).url = temp.url;
                    if (temp.size) (<FileEx>decorator).size = temp.size;
                    if (temp.accept) (<FileEx>decorator).accept = temp.accept;
                    if (temp.dragable) (<FileEx>decorator).dragable = temp.dragable;
                    if (temp.totalSize) (<ImageEx>decorator).totalSize = temp.totalSize;
                    if (temp.multiple != null) (<FileEx>decorator).multiple = temp.multiple;
                    if (temp.popupArchive != null) (<ImageEx>decorator).popupArchive = temp.popupArchive;
                }
                    break;
                case DataType.Image: {
                    let temp = <ImageEx>this.decorator;

                    // Set default value
                    if (temp.url) (<ImageEx>decorator).url = temp.url;
                    if (temp.note) (<ImageEx>decorator).note = temp.note;
                    if (temp.size) (<ImageEx>decorator).size = temp.size;
                    if (temp.choice) (<ImageEx>decorator).choice = temp.choice;
                    if (temp.accept) (<ImageEx>decorator).accept = temp.accept;
                    if (temp.dragable) (<FileEx>decorator).dragable = temp.dragable;
                    if (temp.totalSize) (<ImageEx>decorator).totalSize = temp.totalSize;
                    if (temp.multiple != null) (<ImageEx>decorator).multiple = temp.multiple;
                    if (temp.dimension != null) (<ImageEx>decorator).dimension = temp.dimension;
                    if (temp.popupArchive != null) (<ImageEx>decorator).popupArchive = temp.popupArchive;
                }
                    break;
                case DataType.Video: {
                    let temp = <VideoEx>this.decorator;

                    // Set default value
                    if (temp.url) (<VideoEx>decorator).url = temp.url;
                    if (temp.size) (<VideoEx>decorator).size = temp.size;
                    if (temp.accept) (<VideoEx>decorator).accept = temp.accept;
                    if (temp.dragable) (<FileEx>decorator).dragable = temp.dragable;
                    if (temp.multiple != null) (<VideoEx>decorator).multiple = temp.multiple;
                }
                    break;
            }
        }
        this.decorator = _.cloneDeep(decorator || this.decorator);
        if (!this.label) this.label = this.decorator.label;
        this.decorator.error = null;
        switch (this.decorator.dataType) {
            case DataType.String: this.textType = (<StringEx>this.decorator).type; break;
            case DataType.Boolean: this.boolType = (<BooleanEx>this.decorator).type; break;
            case DataType.DateTime: this.dateType = (<DateTimeEx>this.decorator).type; break;
            case DataType.DropDown: {
                // auto hide
                if ((<DropDownEx>this.decorator).autoHide) this.hide = true;
            } break;
        }

        // address data
        if (this.object &&
            this.decorator.dataType == DataType.String &&
            (<StringEx>this.decorator).type == StringType.Address) {
            this.address = {
                lat: this.object['Lat'],
                lng: this.object['Lng'],
                address: this.object[this.property],
            };
        }

        // subscribe validate
        if (!this.subscribeValidation) {
            this.subscribeValidation = this.event.Validate.subscribe((item: ObjectEx) => {
                if (item.key == this.decorator.key &&
                    item.target == this.decorator.target) {
                    if (item.index != null) {
                        if (this.decorator.index == item.index) {
                            let targetCurrentObject = JSON.stringify(this.object);
                            if (item.targetObject) {
                                if (targetCurrentObject == item.targetObject) {
                                    this.decorator.error = item.error;
                                }
                            } else this.decorator.error = item.error;
                        }
                    } else {
                        let targetCurrentObject = JSON.stringify(this.object);
                        if (item.targetObject) {
                            if (targetCurrentObject == item.targetObject) {
                                this.decorator.error = item.error;
                            }
                        } else this.decorator.error = item.error;
                    }
                    this.cd.detectChanges();
                }
            })
        }
        this.objectDiffer = _.cloneDeep(this.object);
        this.renderItem();
    }

    ngOnChanges() {
        this.renderItem();
        if (this.decorator) {
            if (this.label) {
                this.decorator.label = this.label;
                if (!this.decorator.placeholder)
                    this.decorator.placeholder = this.label;
            }
            if (this.readonly == true || this.readonly == false)
                this.decorator.readonly = this.readonly;
        }
    }

    async ngDoCheck(): Promise<void> {
        if (this.viewer && this.decorator) {
            if (this.decorator.dataType == DataType.DropDown ||
                this.decorator.dataType == DataType.Boolean) {
                if (this.object[this.property] != this.objectDiffer[this.property]) {
                    this.objectDiffer = _.cloneDeep(this.object);
                    await this.renderItem();
                }
            }
        }
    }

    public clear() {
        this.clearValue.emit();
    }

    private async renderItem() {
        if (!this.changing && this.decorator) {
            this.changing = true;
            if (this.decorator.dataType == DataType.DropDown) {
                if ((this.viewer && this.decorator) || (this.decorator && this.decorator.readonly)) {
                    let propertyDropDown = <DropDownEx>this.decorator;
                    if (propertyDropDown.lookup && propertyDropDown.lookup.items) {
                        let optionItem = propertyDropDown.lookup.items.find(c => c.value == this.object[propertyDropDown.property]);
                        if (optionItem) {
                            if (optionItem.color)
                                this.object[propertyDropDown.property + '_Color'] = optionItem.color;
                            this.object[propertyDropDown.property + '_Text'] = UtilityExHelper.createLabel(optionItem.label);
                        }
                    } else {
                        if (propertyDropDown.lookup) {
                            let url = propertyDropDown.lookup.url,
                                key = propertyDropDown.lookup.propertyValue,
                                value = this.object[propertyDropDown.property],
                                columns = propertyDropDown.lookup.propertyDisplay;
                            if (value) {
                                await this.service.lookupItem(url, value, key, columns).then((result: ResultApi) => {
                                    let optionItems: OptionItem[] = OptionItem.createOptionItems(result, propertyDropDown);
                                    if (optionItems && optionItems.length > 0) {
                                        let optionItem = optionItems.find(c => c.value == value) || optionItems[0];
                                        if (optionItem.color)
                                            this.object[propertyDropDown.property + '_Color'] = optionItem.color;
                                        this.object[propertyDropDown.property + '_Text'] = optionItem.label;
                                        if (propertyDropDown.lookup.loadType == DropdownLoadType.Ajax) {
                                            if (!propertyDropDown.lookup.selected) {
                                                propertyDropDown.lookup.selected = {
                                                    value: value,
                                                    label: optionItem.label,
                                                };
                                            }
                                        }
                                    }
                                });
                            } else this.object[propertyDropDown.property + '_Text'] = null;
                        }
                    }
                }
            } else if (this.decorator.dataType == DataType.String) {
                let stringEx: StringEx = this.decorator;
                if (stringEx.type == StringType.AutoComplete) {
                    if ((this.viewer && this.decorator) || (this.decorator && this.decorator.readonly)) {
                        let propertyAutocomplete = <StringEx>this.decorator;
                        if (propertyAutocomplete.lookup && propertyAutocomplete.lookup.items) {
                            let optionItem = propertyAutocomplete.lookup.items.find(c => c.value == this.object[propertyAutocomplete.property]);
                            if (optionItem) {
                                if (optionItem.color)
                                    this.object[propertyAutocomplete.property + '_Color'] = optionItem.color;
                                this.object[propertyAutocomplete.property + '_Text'] = UtilityExHelper.createLabel(optionItem.label);
                            }
                        } else {
                            if (propertyAutocomplete.lookup) {
                                let url = propertyAutocomplete.lookup.url,
                                    key = propertyAutocomplete.lookup.propertyValue,
                                    value = this.object[propertyAutocomplete.property],
                                    columns = propertyAutocomplete.lookup.propertyDisplay;
                                if (value) {
                                    await this.service.lookupItem(url, value, key, columns).then((result: ResultApi) => {
                                        let optionItems: OptionItem[] = OptionItem.createOptionItems(result, propertyAutocomplete);
                                        if (optionItems && optionItems.length > 0) {
                                            let optionItem = optionItems.find(c => c.value == value) || optionItems[0];
                                            if (optionItem.color)
                                                this.object[propertyAutocomplete.property + '_Color'] = optionItem.color;
                                            this.object[propertyAutocomplete.property + '_Text'] = optionItem.label;
                                            if (propertyAutocomplete.lookup.loadType == DropdownLoadType.Ajax) {
                                                if (!propertyAutocomplete.lookup.selected) {
                                                    propertyAutocomplete.lookup.selected = {
                                                        value: value,
                                                        label: optionItem.label,
                                                    };
                                                }
                                            }
                                        }
                                    });
                                } else this.object[propertyAutocomplete.property + '_Text'] = null;
                            }
                        }
                    }
                }
            } else if (this.decorator.dataType == DataType.Boolean) {
                if (this.viewer && this.decorator) {
                    let propertyBoolean = <BooleanEx>this.decorator;
                    if (propertyBoolean.lookup && propertyBoolean.lookup.items) {
                        this.decorator.dataType = DataType.String;
                        let values = this.object[propertyBoolean.property] && JSON.parse(this.object[propertyBoolean.property]) as any[];
                        if (Array.isArray(values)) {
                            if (values && values.length > 0) {
                                let valueString: string = '';
                                values.forEach((value: any) => {
                                    let optionItem = propertyBoolean.lookup.items.find(c => c.value == value);
                                    if (optionItem) {
                                        valueString += valueString ? ', ' + optionItem.label : optionItem.label;
                                    }
                                    this.object[propertyBoolean.property] = valueString;
                                });
                            }
                        } else {
                            let optionItem = propertyBoolean.lookup.items.find(c => c.value == this.object[propertyBoolean.property]);
                            if (optionItem) {
                                this.object[propertyBoolean.property + '_Color'] = optionItem.color;
                                this.object[propertyBoolean.property] = UtilityExHelper.createLabel(optionItem.label);
                            }
                        }
                    }
                }
            }
            this.changing = false;
        }
    }

    public blur(value: any) {
        this.onBlur.emit(value);
    }

    public loadCompleted(value: any) {
        if (this.decorator && this.decorator.dataType == DataType.DropDown) {
            let decorator = <DropDownEx>this.decorator;
            if (decorator.autoHide) {
                if (value && value.length > 0)
                    this.hide = false;
                else
                    this.hide = true;
            }
        }
        this.loaded.emit(value);
    }

    public valueChanged(value: any) {
        this.decorator.error = null;
        this.valueChange.emit(value);
    }

    public optionChanged(value: any) {
        this.decorator.error = null;
        this.optionChange.emit(value);
    }

    public captureChanged(value: any) {
        this.decorator.error = null;
        this.captureChange.emit(value);
    }

    public onKeyPressEnter(value: any) {
        this.keyPressEnter.emit(value);
    }

    public addressChange(value: AddressData) {
        this.address = value;
        this.decorator.error = null;
        this.object['Lat'] = value && value.lat;
        this.object['Lng'] = value && value.lng;
        this.valueChange.emit(value && value.address);
        this.object[this.property] = value && value.address;
    }

    public refreshData(items?: OptionItem[]) {
        this.combobox.refreshData(items);
    }

    public async upload(keyValues: KeyValue[] = null, url: string = null): Promise<FileData[]> {
        if (this.file) return await this.file.upload(keyValues, url);
        else if (this.image) return await this.image.upload(keyValues, url);
        else if (this.video) return await this.video.upload(keyValues, url);
        return null;
    }
}
