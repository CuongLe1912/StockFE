declare var Coloris;
import * as _ from 'lodash';
import Tagify from '@yaireo/tagify';
import 'rxjs/add/observable/fromEvent';
import { Subscription, fromEvent } from 'rxjs';
import { StoreHelper } from '../../helpers/store.helper';
import { ResultApi } from '../../domains/data/result.api';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { DependData } from '../../domains/data/depend.data';
import { OptionItem } from '../../domains/data/option.item';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { ValidatorHelper } from '../../helpers/validator.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { debounceTime, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { TextTransformType, StringType, DropdownLoadType, ColorType } from '../../domains/enums/data.type';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'editor-textbox',
    templateUrl: 'textbox.component.html',
    styleUrls: ['textbox.component.scss']
})
export class TextBoxComponent implements OnInit, OnChanges, OnDestroy {
    url: string;
    tagify: any;
    type: string;
    loading: boolean;
    tags: string[] = [];
    keyupSub: Subscription;
    StringType = StringType;
    loadingDependcy: boolean;
    panelOpening: boolean = false;
    subscribeRefreshItems: Subscription;
    keyNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    @Input() value: string;
    @Input() items: OptionItem[];
    @Input() decorator: StringEx;
    @Input() filterItems: OptionItem[];
    @ViewChild('input') inputElRef: ElementRef;
    @Output() onBlur = new EventEmitter<string>();
    @Output() clearValue = new EventEmitter<string>();
    @Output() valueChange = new EventEmitter<string>();
    @Output() keyPressEnter = new EventEmitter<string>();

    constructor(
        private event: AdminEventService,
        private service: AdminApiService) {
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.max) this.decorator.max = 250;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.type) this.decorator.type = StringType.Text;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        switch (this.decorator.type) {
            case StringType.Link: this.type = 'url'; break;
            case StringType.Email: this.type = 'text'; break;
            case StringType.Search: this.type = 'search'; break;
            case StringType.PhoneText: this.type = 'tel'; break;
            case StringType.Password: this.type = 'password'; break;
            default: this.type = 'text'; break;
        }

        // Color-Picker
        if (this.decorator.type == StringType.Color) {
            setTimeout(() => this.renderColorPicker(), 300);
        }

        // AutoComplete
        if (this.decorator.type == StringType.AutoComplete) {
            let loadAll = this.decorator.lookup && this.decorator.lookup.loadType == DropdownLoadType.All;
            if (loadAll && (!this.items || this.items.length == 0)) {
                await this.renderAndLoadItems();
            }

            setTimeout(() => {

                fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
                    // get value
                    map((event: any) => {
                        return event.target.value;
                    })
                    // if character length greater then 1
                    , filter(res => loadAll ? res.length >= 1 : res.length > 1)

                    // Time in milliseconds between key events
                    , debounceTime(loadAll ? 1 : 500)

                    // If previous query is diffent from current   
                    , distinctUntilChanged()

                    // subscription for response
                ).subscribe(async (text: string) => {
                    this.panelOpening = true;
                    if (loadAll) {
                        this.loading = false;
                        this.filterLoadItems(text);
                    } else {
                        await this.renderAndLoadItems(text);
                    }
                });
            }, 1000);

            // subscribe refreshItems
            if (!this.subscribeRefreshItems) {
                this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: { property: string, value: any, index: number }) => {
                    if (!this.loadingDependcy) {
                        if (this.decorator.target &&
                            this.decorator.lookup &&
                            this.decorator.lookup.dependId) {
                            let dependIds: DependData[] = Array.isArray(this.decorator.lookup.dependId)
                                ? this.decorator.lookup.dependId
                                : [{ Property: this.decorator.lookup.dependId, Url: this.decorator.lookup.url }];
                            if (dependIds.findIndex(c => c.Property == obj.property) >= 0) {
                                if (this.decorator.index != null && this.decorator.index != undefined) {
                                    if (this.decorator.index == obj.index) {
                                        this.loadingDependcy = true;
                                        this.loadByDependcy(obj.property, obj.value);
                                    }
                                } else {
                                    if (obj.index == null || obj.index == undefined) {
                                        this.loadingDependcy = true;
                                        this.loadByDependcy(obj.property, obj.value);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // Tag || TagEmail
        if (this.decorator.type == StringType.Tag || this.decorator.type == StringType.TagEmail) {
            setTimeout(() => this.renderTagify(), 300);
        }
    }

    ngOnDestroy(): void {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue) {
                    if (changes.value.currentValue) {
                        this.event.Validate.emit({
                            key: this.decorator.key,
                            target: this.decorator.target,
                        });
                    } else {
                        if (this.decorator.type == StringType.Tag || this.decorator.type == StringType.TagEmail) {
                            this.clear();
                        }
                    }
                }
            }
        }
    }

    clear() {
        this.value = '';
        this.valueChange.emit(this.value);
        setTimeout(() => { this.clearValue.emit() }, 300);
        if (this.decorator.type == StringType.Tag || this.decorator.type == StringType.TagEmail) {
            this.tags = [];
            if (this.tagify) this.tagify.removeAllTags();
        }
    }
    openPanel() {
        if (this.decorator.type == StringType.AutoComplete) {
            if (this.filterItems && this.filterItems.length > 0) {
                this.panelOpening = true;
            }
        }
    }
    hidePanel() {
        setTimeout(() => this.panelOpening = false, 100);
    }
    onGenerate() {
        if (this.decorator.generateFunction) {
            let value = this.decorator.generateFunction();
            this.value = value;
            this.valueChange.emit(this.value);
        } else if (this.decorator.type == StringType.AutoGenerate) {
            let max = this.decorator.max || 10,
                value = UtilityExHelper.randomText(max);
            this.value = value;
            this.valueChange.emit(this.value);
        }
    }
    inputChange() {
        try {
            if (this.decorator.textTransform == TextTransformType.LowerCase) {
                this.value = this.value.toLowerCase();
            } else if (this.decorator.textTransform == TextTransformType.UpperCase) {
                this.value = this.value.toUpperCase();
            }
            this.valueChange.emit(this.value);
        } catch { }
        if (!this.value) {
            this.loading = false;
            this.panelOpening = false;
            this.filterLoadItems(this.value);
        }
    }
    selectItem(item: OptionItem) {
        if (this.filterItems && this.filterItems.length > 0) {
            this.filterItems.forEach((item: OptionItem) => {
                item.selected = false;
            });
        }
        item.selected = true;
        this.panelOpening = false;
        this.value = item && item.label;
        this.valueChange.emit(this.value);
    }

    onTextBoxBlur() {
        try {
            if (this.value) {
                if (this.decorator.type == StringType.PhoneText) {
                    if (!this.decorator.readonly) {
                        if (this.value.indexOf('0') != 0) {
                            this.value = '';
                            this.valueChange.emit(this.value);
                        } else {
                            let valid = ValidatorHelper.validPhone(this.value);
                            if (!valid) {
                                this.value = '';
                                this.valueChange.emit(this.value);
                            }
                        }
                    }
                } else {
                    let temp = this.value;
                    this.value = this.value.trim();
                    while (this.value.indexOf('  ') >= 0)
                        this.value = this.value.replace('  ', ' ');
                    if (temp != this.value) this.valueChange.emit(this.value);
                }
            }
            this.onBlur.emit(this.value);
        } catch { }
    }
    onPhoneKeypress(e: any) {
        try {
            if (e.key == 'Enter') this.keyPressEnter.emit();
            let key = e.key,
                val = e.target.value;
            if (e.ctrlKey && (key == 'v' || key == 'c' || key == 'a'))
                return true;
            if (!val) if (key != '0') return false;
            if (this.keys.indexOf(key) < 0) return false;
            return true;
        } catch {
            return false;
        }
    }
    onTextBoxKeypress(e: any) {
        try {
            if (e.key == 'Enter') this.keyPressEnter.emit();
            if (this.decorator.type == StringType.Email && e.key == '+')
                return false;
            else if (this.decorator.type == StringType.Number) {
                let key = e.key;
                if (this.keyNumbers.indexOf(key) < 0)
                    return false;
            } else if (this.decorator.type == StringType.Link) {
                if (e.key == ' ') return false;
            }
        } catch { }
    }

    private renderTagify() {
        let delimiters = this.decorator.delimiters || ',',
            input = document.getElementById(this.decorator.id);
        if (input) {
            let tagify = new Tagify(input, {
                delimiters: delimiters,
                maxTags: this.decorator.maxTags,
                pattern: new RegExp('^.{0,' + this.decorator.max + '}$'),
            });
            if (this.value) {
                this.tags = this.value.split(delimiters);
            }
            tagify.on('add', (e: any) => {
                let value = e.detail.data.value.trim();
                if (this.tags.indexOf(value) < 0) {
                    this.tags.push(value);
                }
                this.value = this.tags && this.tags.length > 0
                    ? this.tags.join(delimiters)
                    : null;
                this.valueChange.emit(this.value);
            });
            tagify.on('remove', (e: any) => {
                let value = e.detail.data.value.trim();
                if (this.tags.indexOf(value) >= 0) {
                    this.tags.splice(this.tags.indexOf(value), 1);
                }
                this.value = this.tags && this.tags.length > 0
                    ? this.tags.join(delimiters)
                    : null;
                this.valueChange.emit(this.value);
            });
            tagify.on('invalid', (e: any) => {
                let message = e.detail.message;
                let value = e.detail.data.value;
                if (message == 'pattern mismatch') {
                    if (value.length > this.decorator.max) {
                        ToastrHelper.Error(this.decorator.titleTags + ': "' + value.trim() + '" không được vượt quá ' + this.decorator.max + ' ký tự');
                    } else
                        ToastrHelper.Error(this.decorator.titleTags + ': "' + value.trim() + '" không hợp lệ');
                } else if (message == 'already exists') {
                    ToastrHelper.Error(this.decorator.titleTags + ': "' + value.trim() + '" đã tồn tại');
                } else if (message == 'number of tags exceeded') {
                    ToastrHelper.Error('Tối đa cho phép ' + this.decorator.maxTags + ' ' + this.decorator.titleTags);
                } else {
                    ToastrHelper.Error(this.decorator.titleTags + ': "' + value.trim() + '" không hợp lệ');
                }
            });
            this.tagify = tagify;
        }
    }
    private renderColorPicker() {
        let format = null;
        if (this.decorator.colorType) {
            switch (this.decorator.colorType) {
                case ColorType.Hex: format = 'hex'; break;
                case ColorType.Rgb: format = 'rgb'; break;
                case ColorType.Hsl: format = 'hsl'; break;
            }
        }
        Coloris({
            el: '#' + this.decorator.id,
            themeMode: 'dark',
            clearButton: true,
            closeButton: true,
            formatToggle: true,
            swatches: [
                '#067bc2',
                '#84bcda',
                '#80e377',
                '#ecc30b',
                '#f37748',
                '#d56062'
            ],
            theme: 'pill',
            format: format,
            clearLabel: 'Xóa',
            closeLabel: 'Đóng',
            defaultColor: this.value,
        });
    }
    private filterLoadItems(value: string) {
        if (!this.items || this.items.length == 0) {
            this.filterItems = [];
            return;
        }
        if (value) {
            let text = value.toLowerCase();
            this.filterItems = _.cloneDeep(this.items).filter(c => c.label.toLowerCase().indexOf(text) >= 0);
        }
        else
            this.filterItems = _.cloneDeep(this.items);
    }
    private reloadItems(items: OptionItem[], value: any) {
        this.items = items;
        this.loading = false;
        this.filterLoadItems(value);
    }
    private formatUrl(url: string, value: string): string {
        if (url && url.indexOf('[id]') >= 0) {
            let searchParams = new URLSearchParams(location.search);
            if (searchParams.has('id')) {
                let id = searchParams.get("id");
                if (id) url = url.replace('[id]', id);
            }
        }
        if (value) url += '?q=' + value;
        return url;
    }
    private async renderAndLoadItems(value: string = null) {
        let items: OptionItem[];
        if (this.decorator.lookup.items) {
            items = _.cloneDeep(this.decorator.lookup.items);
        } else if (this.decorator.lookup.url) {
            let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
            columns.unshift(this.decorator.lookup.propertyValue || 'Id');
            if (this.decorator.lookup.propertyGroup)
                columns.push(this.decorator.lookup.propertyGroup);
            this.loading = true;
            let url = this.formatUrl(this.decorator.lookup.url, value),
                key = this.decorator.lookup.url;
            while (key.indexOf('/') >= 0)
                key = key.replace('/', '_');

            // get from cache
            items = StoreHelper.loadStoreItemWithExpiry(key);

            // get from api
            if (!items || items.length == 0) {
                items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                    return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                });
            }

            // cache
            if (this.decorator.lookup.cached && items && items.length > 0) {
                let ttl = this.decorator.lookup.cached;
                StoreHelper.storeItem(key, items, ttl);
            }
        }
        this.items = items;
        this.loading = false;
        this.filterLoadItems(value);
    }
    private async loadByDependcy(property: string, value: any) {
        if (this.decorator.lookup.loadType == DropdownLoadType.All) {
            if (value) {
                let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, this.decorator.property);
                let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
                columns.unshift(this.decorator.lookup.propertyValue || 'Id');
                this.loading = true;
                if (this.decorator.lookup.propertyGroup)
                    columns.push(this.decorator.lookup.propertyGroup);
                let items = await this.service.lookup(this.decorator.lookup.url, columns, value).then((result: ResultApi) => {
                    if (value) this.url = this.decorator.lookup.url + '/' + value;
                    return OptionItem.createOptionItems(result, targetProperty);
                });
                this.reloadItems(items, this.value);
                this.loading = false;
            }
        } else {
            let dependIds: DependData[] = Array.isArray(this.decorator.lookup.dependId)
                ? this.decorator.lookup.dependId
                : [{ Property: this.decorator.lookup.dependId, Url: this.decorator.lookup.url }];
            let depend = dependIds.find(c => c.Property == property);
            if (depend) {
                if (value) this.url = '/admin' + depend.Url + '/' + value;
                else this.url = '/admin' + depend.Url;
            } else this.url = '/admin' + this.decorator.lookup.url;
        }
        setTimeout(() => this.loadingDependcy = false, 1000);
    }
}
