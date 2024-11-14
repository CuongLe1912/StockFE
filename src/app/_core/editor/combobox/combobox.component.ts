declare var $;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../helpers/api.url.helper';
import { StoreHelper } from '../../helpers/store.helper';
import { ResultApi } from '../../domains/data/result.api';
import { DependData } from '../../domains/data/depend.data';
import { OptionItem } from '../../domains/data/option.item';
import { LookupData } from '../../domains/data/lookup.data';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminEventService } from '../../services/admin.event.service';
import { RefreshOptionItem } from '../../domains/data/refresh.option.item';
import { DropdownLoadType, DropdownType } from '../../domains/enums/data.type';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-combobox',
    templateUrl: 'combobox.component.html',
    styleUrls: ['combobox.component.scss']
})
export class ComboBoxComponent implements OnInit, OnDestroy, OnChanges {
    url: string;
    type: string;
    prevValue: any;
    valueTo: number;
    loading: boolean;
    valueFrom: number;
    panelOpening: boolean;
    loadingDependcy: boolean;
    selectedItem: OptionItem;
    valueText: string = null;
    DropdownType = DropdownType;
    optionChanging: boolean = false;
    activeChangeEvent: boolean = false;
    subscribeRefreshItems: Subscription;
    subscribeHideCombobox: Subscription;
    keyNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: DropDownEx;
    @Input() allItems: OptionItem[] = [];
    @Output() clearValue = new EventEmitter<any>();
    @Output() valueChange = new EventEmitter<any>();
    @Output() loaded = new EventEmitter<OptionItem[]>();
    @Output() optionChange = new EventEmitter<OptionItem | OptionItem[]>();

    constructor(
        public data: AdminDataService,
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    ngOnDestroy() {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
        if (this.subscribeHideCombobox) {
            this.subscribeHideCombobox.unsubscribe();
            this.subscribeHideCombobox = null;
        }
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new DropDownEx();
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (this.value) this.prevValue = _.cloneDeep(this.value);
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = DropdownType.Normal;
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        if (!this.decorator.lookup.propertyValue) this.decorator.lookup.propertyValue = 'Id';
        if (this.decorator.multiple && this.value && this.value.length == 0) this.value = null;
        if (!this.decorator.lookup.loadType) this.decorator.lookup.loadType = DropdownLoadType.All;
        if (!this.decorator.lookup.propertyDisplay) this.decorator.lookup.propertyDisplay = ['Name'];
        if (this.items)
            setTimeout(() => { this.reloadItems(this.items); }, 100);
        else
            await this.renderAndLoadItems();

        // subscribe refreshItems
        if (!this.subscribeRefreshItems) {
            this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: RefreshOptionItem) => {
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
                                    this.loadByDependcy(obj.property, obj.value, obj.originalItems);
                                }
                            } else {
                                if (obj.index == null || obj.index == undefined) {
                                    this.loadingDependcy = true;
                                    this.loadByDependcy(obj.property, obj.value, obj.originalItems);
                                }
                            }
                        }
                    }
                }
            });
        }

        // subscribe refreshItems
        if (!this.subscribeHideCombobox) {
            this.subscribeHideCombobox = this.event.HideCombobox.subscribe(() => {
                let $combobox = $("#" + this.decorator.id);
                if ($combobox && $combobox.length > 0) {
                    $combobox.select2('close');
                }
            });
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                let currentValue = changes.value.currentValue || null,
                    previousValue = changes.value.previousValue || null;
                if (Array.isArray(currentValue) && currentValue?.filter((c: any) => c != null && c != undefined).length == 0)
                    currentValue = null;
                if (currentValue != previousValue && this.activeChangeEvent) {
                    if (!this.prevValue)
                        this.prevValue = _.cloneDeep(this.value);
                    this.setValue();
                }
            }
        }
    }

    clear() {
        this.activeChangeEvent = false;
        this.value = null; this.setValue();
        setTimeout(() => { this.clearValue.emit() }, 300);
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    clearTo() {
        this.valueTo = null;
        this.updateValueText();
    }
    selectAll() {
        this.activeChangeEvent = false;
        if (this.items && this.items.length > 0) {
            let $combobox = $("#" + this.decorator.id);
            if ($combobox && $combobox.length > 0) {
                this.value = this.items.map(c => c.value);
                $combobox.val(this.value);
                $combobox.trigger('change');
                this.valueChange.emit(this.value);
                this.optionChangeEmit(this.items);
            }
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    clearFrom() {
        this.valueFrom = null;
        this.updateValueText();
    }
    clearFromTo() {
        this.valueTo = null;
        this.valueFrom = null;
        this.updateValueText();
        this.selectedItem = null;
        $('#to-' + this.decorator.id).val('');
        $('#from-' + this.decorator.id).val('');
    }
    inputBlur(type: string) {
        setTimeout(() => {
            if (!this.panelOpening) {
                let valueFrom = this.formatNumber(this.valueFrom),
                    valueTo = this.formatNumber(this.valueTo);
                if (type == 'from') {
                    if (this.valueTo != null && this.valueTo != undefined) {
                        if (valueFrom && valueTo < valueFrom) {
                            this.valueTo = valueFrom;
                            let num = this.formatNumber(this.valueTo);
                            setTimeout(() => {
                                let valueText = this.formatString(num);
                                $('#to-' + this.decorator.id).val(valueText);
                            }, 100);
                            this.updateValueText();
                        }
                    }
                } else {
                    if (this.valueFrom != null && this.valueFrom != undefined) {
                        if (valueTo && valueFrom > valueTo) {
                            this.valueFrom = 0;
                            let num = this.formatNumber(this.valueFrom);
                            setTimeout(() => {
                                let valueText = this.formatString(num);
                                $('#from-' + this.decorator.id).val(valueText);
                            }, 100);
                            this.updateValueText();
                        }
                    }
                }
            }
        }, 300);
    }
    onNumberKeypress(e: any) {
        let key = e.key,
            val = e.target.value;
        if (e.ctrlKey && (key == 'c' || key == 'a'))
            return true;
        if (!this.decorator.lookup.decimals) {
            if (key == ',') return false;
            if (!val && key == '0') {
                return true;
            }
        } else {
            if (key == ',') {
                if (!val || val.indexOf(',') >= 0)
                    return false;
                else
                    return true;
            }
        }
        if (this.keys.indexOf(key) < 0) return false;
        if (val && this.decorator.lookup.decimals && this.keyNumbers.indexOf(key) >= 0) {
            const [, decimal] = val.toString().split(',');
            const precision = decimal ? decimal.length : 0;
            if (precision >= this.decorator.lookup.decimals)
                return false;
        }
        return true;
    }
    inputChange(type: string) {
        if (type == 'from') {
            let num = this.formatNumber(this.valueFrom);
            if (num > this.decorator.lookup?.numberMax) {
                this.valueFrom = this.decorator.lookup?.numberMax;
                num = this.formatNumber(this.valueFrom);
            }
            let numTo = this.formatNumber(this.valueTo);
            if (numTo && num > numTo) {
                this.valueFrom = 0;
                num = this.formatNumber(this.valueFrom);
            }
            if (this.valueFrom != null &&
                this.valueFrom != undefined &&
                this.valueFrom.toString() != '' &&
                !this.valueFrom.toString().endsWith(',') &&
                !this.valueFrom.toString().endsWith(',0')) {
                setTimeout(() => {
                    let valueText = this.formatString(num);
                    $('#from-' + this.decorator.id).val(valueText);
                }, 100);
            }
        } else {
            let num = this.formatNumber(this.valueTo);
            if (num > this.decorator.lookup?.numberMax) {
                this.valueTo = this.decorator.lookup?.numberMax;
                num = this.formatNumber(this.valueTo);
            }
            if (this.valueTo != null &&
                this.valueTo != undefined &&
                this.valueTo.toString() != '' &&
                !this.valueTo.toString().endsWith(',') &&
                !this.valueTo.toString().endsWith(',0')) {
                setTimeout(() => {
                    let valueText = this.formatString(num);
                    $('#to-' + this.decorator.id).val(valueText);
                }, 100);
            }
        }
        let itemDb = this.items && this.items.find(c => c.value == this.selectedItem?.value);
        if (itemDb) {
            itemDb.selected = false;
            this.selectedItem = null;
        }
        this.updateValueText();
    }
    selectItem(item: OptionItem) {
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: OptionItem) => {
                item.selected = false;
            });
        }
        let itemDb = this.items && this.items.find(c => c.value == item.value);
        if (itemDb) {
            itemDb.selected = true;
            this.selectedItem = itemDb;
        } else this.selectedItem = null;
        this.updateValueText();
    }
    public reloadItems(items: OptionItem[]) {
        this.activeChangeEvent = false;
        if (items) this.items = items;
        if (this.decorator.type == DropdownType.Normal) {
            let data: any[] = [];
            let group = this.items && this.items.find(c => c.group);
            let groupArray = this.items && _.uniqBy(this.items.map(c => c.group).filter(c => c != null), (c: string) => { return c });
            if (groupArray && groupArray.length > 0 && (group || this.decorator.lookup.propertyGroup)) {
                if (items && items.length > 0) {
                    let groups = _(items)
                        .groupBy((x: OptionItem) => x.group)
                        .map((value: OptionItem[], key: string) => ({ group: key, items: value }))
                        .value();
                    groups.forEach((item: any) => {
                        data.push({
                            id: item.group,
                            text: item.group,
                            children: item.items && item.items.map(c => {
                                return {
                                    id: c.value,
                                    icon: c.icon,
                                    text: c.label,
                                    original: c.originalItem
                                };
                            }) || [],
                        });
                    });
                    if (!this.value && this.decorator.autoSelect) {
                        let selectItem = data.find(c => c.id);
                        this.value = selectItem && selectItem.id;
                    }
                    else if (!this.decorator.multiple) data.unshift({ id: '', icon: null, text: this.decorator.placeholder });
                }
            } else {
                data = items && items.map(c => {
                    return {
                        id: c.value,
                        icon: c.icon,
                        text: c.label,
                        original: c.originalItem
                    };
                }) || [];
                if (!this.value && this.decorator.autoSelect) {
                    let selectItem = data.find(c => c.id);
                    this.value = selectItem && selectItem.id;
                }
                else if (!this.decorator.multiple) data.unshift({ id: '', icon: null, text: this.decorator.placeholder });
            }
            let $combobox = $("#" + this.decorator.id);
            if ($combobox && $combobox.length > 0) {
                if (this.decorator.lookup.loadType == DropdownLoadType.Ajax) {
                    this.renderEditorAjax($combobox, data);
                } else {
                    this.renderEditor($combobox, data);
                    if (this.value != null && this.value != undefined) {
                        if (this.decorator.multiple) {
                            if (this.value.length > 0) this.setValue();
                        } else
                            this.setValue();
                    } else if (this.decorator.text) {
                        let $render = $('#select2-' + this.decorator.id + '-container');
                        if ($render && $render.length > 0) {
                            $render.html(this.decorator.text);
                        }
                    }
                }
            }
        } else this.setValue();
        this.loaded.emit(items);
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    public async refreshData(items?: OptionItem[]) {
        if (items)
            setTimeout(() => { this.reloadItems(items); }, 100);
        else {
            await this.renderAndLoadItems();
        }
    }

    private setValue() {
        this.activeChangeEvent = false;
        if (this.decorator.lookup.loadType == DropdownLoadType.Ajax) {
            if (this.prevValue) {
                this.value = _.cloneDeep(this.prevValue);
                this.valueChange.emit(this.value);
                this.prevValue = null;
                return;
            }
        }
        if (this.decorator.type == DropdownType.Normal) {
            let $combobox = $("#" + this.decorator.id);
            if ($combobox && $combobox.length > 0) {
                if (this.value == null || this.value == undefined) {
                    this.value = null;
                    this.valueChange.emit(this.value);
                    this.event.RefreshItems.emit({
                        value: this.value,
                        index: this.decorator.index,
                        property: this.decorator.property,
                    });
                    $combobox.val(null).trigger('change');
                } else {
                    if (typeof (this.value) == 'string') {
                        if (this.decorator.multiple) {
                            this.value = this.value.indexOf(',') >= 0 || this.value.indexOf('[') >= 0
                                ? this.value.replace('[', '').replace(']', '').split(',')
                                : [this.value];
                        }
                    }
                    if (this.decorator.lookup.loadType == DropdownLoadType.All) {
                        if (this.decorator.multiple) {
                            if (this.value && this.value.length > 0) {
                                if (this.items && this.items.length > 0) {
                                    let arrayValues = this.value.filter((c: any) => this.items.findIndex(p => p.value == c) >= 0);
                                    if (!arrayValues || arrayValues.length == 0)
                                        this.value = null;
                                    else
                                        this.value = arrayValues;
                                } else return;
                                $combobox.val(this.value);
                                $combobox.trigger('change');
                                this.valueChange.emit(this.value);
                                this.event.RefreshItems.emit({
                                    value: this.value,
                                    index: this.decorator.index,
                                    property: this.decorator.property,
                                });
                            }
                        } else {
                            $combobox.val(this.value);
                            $combobox.trigger('change');
                            this.valueChange.emit(this.value);
                            this.event.RefreshItems.emit({
                                value: this.value,
                                index: this.decorator.index,
                                property: this.decorator.property,
                            });
                        }
                    } else {
                        let selected = {
                            id: this.value,
                            text: this.value,
                        };
                        if (this.items && this.items.length > 0) {
                            let item = this.items.find(c => c.value == this.value);
                            if (item)
                                selected = { id: item.value, text: item.label };
                            else {
                                if (this.value != null && this.value != undefined) {
                                    let item = this.items.find(c => c.value.toString() == this.value.toString());
                                    if (item)
                                        selected = { id: item.value, text: item.label };
                                }
                            }
                        }
                        let option = selected && selected.id
                            ? new Option(selected.text, selected.id, true, true)
                            : null;
                        if (option) {
                            $combobox.append(option).trigger('change');
                            $combobox.trigger({
                                type: 'select2:select',
                                params: {
                                    data: selected
                                }
                            });
                        } else {
                            this.value = null;
                            $combobox.val(null).trigger('change');
                        }
                        this.valueChange.emit(this.value);
                        this.event.RefreshItems.emit({
                            value: this.value,
                            index: this.decorator.index,
                            property: this.decorator.property,
                        });
                    }
                }
            }
        } else {
            if (typeof (this.value) == 'string') {
                let values = this.value.split('-');
                if (values.length >= 3) {
                    this.valueFrom = values[0] ? this.formatNumber(values[0]) : null;
                    this.valueTo = values[1] ? this.formatNumber(values[1]) : null;
                    this.updateValueText();
                } else {
                    if (this.items) {
                        let value = this.value;
                        if (value.indexOf('-null') >= 0)
                            value = value.replace('-null', '');
                        if (value.indexOf('null-') >= 0)
                            value = value.replace('null-', '');
                        let option = this.items && this.items.find(c => c.value == value);
                        if (option) {
                            option.selected = true;
                            this.selectedItem = option;
                            this.updateValueText();
                        } else if (values && values.length >= 2) {
                            this.valueFrom = values[0] ? this.formatNumber(values[0]) : null;
                            this.valueTo = values[1] ? this.formatNumber(values[1]) : null;
                            this.updateValueText();
                        }
                    }
                }
            }
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    private updateValueText() {
        this.activeChangeEvent = false;
        if (this.selectedItem) {
            this.valueTo = null;
            this.valueFrom = null;
            this.panelOpening = false;
            this.value = this.selectedItem?.value;
            this.valueText = this.selectedItem?.label;
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                index: this.decorator.index,
                property: this.decorator.property,
            });
        } else {
            let valueText = '';
            let valueNumber = '';
            if (this.valueFrom && this.valueTo) {
                let valueFrom = this.formatNumber(this.valueFrom),
                    valueTo = this.formatNumber(this.valueTo);
                valueNumber = valueFrom + '-' + valueTo + '-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueFrom);
                        valueText += ' - ';
                        valueText += this.formatString(valueTo);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        let unitFrom = UtilityExHelper.FormatUnitArea(valueFrom),
                            unitTo = UtilityExHelper.FormatUnitArea(valueTo);
                        valueText += UtilityExHelper.FormatNumberArea(valueFrom);
                        valueText += unitFrom != unitTo ? unitFrom : '';
                        valueText += ' - ';
                        valueText += UtilityExHelper.FormatNumberArea(valueTo);
                        valueText += unitTo;
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        let unitFrom = UtilityExHelper.FormatUnitPrice(valueFrom),
                            unitTo = UtilityExHelper.FormatUnitPrice(valueTo);
                        valueText += UtilityExHelper.FormatNumberPrice(valueFrom);
                        valueText += unitFrom != unitTo ? unitFrom : '';
                        valueText += ' - ';
                        valueText += UtilityExHelper.FormatNumberPrice(valueTo);
                        valueText += unitTo;
                    }
                        break;
                }
            } else if (this.valueFrom) {
                valueText += 'Trên ';
                let valueFrom = this.formatNumber(this.valueFrom);
                valueNumber = valueFrom + '-0-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueFrom);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        valueText += UtilityExHelper.FormatNumberArea(valueFrom);
                        valueText += UtilityExHelper.FormatUnitArea(valueFrom);
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        valueText += UtilityExHelper.FormatNumberPrice(valueFrom);
                        valueText += UtilityExHelper.FormatUnitPrice(valueFrom);
                    }
                        break;
                }
            } else if (this.valueTo) {
                valueText += 'Dưới ';
                let valueTo = this.formatNumber(this.valueTo);
                valueNumber = '0-' + valueTo + '-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueTo);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        valueText += UtilityExHelper.FormatNumberArea(valueTo);
                        valueText += UtilityExHelper.FormatUnitArea(valueTo);
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        valueText += UtilityExHelper.FormatNumberPrice(valueTo);
                        valueText += UtilityExHelper.FormatUnitPrice(valueTo);
                    }
                        break;
                }
            }
            this.value = valueNumber;
            this.valueText = valueText;
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                index: this.decorator.index,
                property: this.decorator.property,
            });
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    private setValueSelected() {
        this.activeChangeEvent = false;
        let $combobox = $("#" + this.decorator.id);
        if (this.decorator.lookup.selected) {
            if (Array.isArray(this.decorator.lookup.selected)) {
                let selecteds = this.decorator.lookup.selected.filter(c => c.value).map(c => {
                    return {
                        id: c.value,
                        text: c.label,
                        originalItem: c.originalItem,
                    }
                });
                if (selecteds && selecteds.length > 0) {
                    let options = selecteds.map(c => {
                        return new Option(c.text, c.id, true, true)
                    });
                    let optionItems = selecteds.map(c => {
                        return new OptionItem(c.id, c.text, c.originalItem);
                    });
                    $combobox.append(options).trigger('change');
                    $combobox.trigger({
                        type: 'select2:select',
                        params: {
                            data: selecteds
                        }
                    });
                    this.optionChangeEmit(optionItems);
                }
            } else {
                let selected = {
                    id: this.decorator.lookup.selected.value,
                    text: this.decorator.lookup.selected.label,
                    originalItem: this.decorator.lookup.selected.originalItem,
                };
                let option = new Option(selected.text, selected.id, true, true);
                $combobox.append(option).trigger('change');
                $combobox.trigger({
                    type: 'select2:select',
                    params: {
                        data: selected
                    }
                });
                this.optionChangeEmit(new OptionItem(selected.id, selected.text, selected.originalItem));
            }
        } else if (this.value) {
            if (this.data.ajaxItems && this.data.ajaxItems.length > 0) {
                if (Array.isArray(this.value)) {
                    let items = this.data.ajaxItems.filter(c => this.value.indexOf(c.value) >= 0);
                    if (items && items.length > 0) {
                        let selecteds = items.filter(c => c.value).map(c => {
                            return {
                                id: c.value,
                                text: c.label,
                                originalItem: c.originalItem
                            }
                        });
                        if (selecteds && selecteds.length > 0) {
                            let options = selecteds.map(c => {
                                return new Option(c.text, c.id, true, true)
                            });
                            let optionItems = selecteds.map(c => {
                                return new OptionItem(c.id, c.text, c.originalItem);
                            });
                            $combobox.append(options).trigger('change');
                            $combobox.trigger({
                                type: 'select2:select',
                                params: {
                                    data: selecteds
                                }
                            });
                            this.optionChangeEmit(optionItems);
                        }
                    }
                } else {
                    let item = this.data.ajaxItems.find(c => c.value == this.value);
                    if (item) {
                        let selected = {
                            id: item.value,
                            text: item.label,
                            originalItem: item.originalItem,
                        };
                        let option = new Option(selected.text, selected.id, true, true);
                        $combobox.append(option).trigger('change');
                        $combobox.trigger({
                            type: 'select2:select',
                            params: {
                                data: selected
                            }
                        });
                        this.optionChangeEmit(new OptionItem(selected.id, selected.text, selected.originalItem));
                    }
                }
            }
        } else {
            $combobox.val(null).trigger('change');
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    private formatNumber(value: any) {
        if (typeof value == 'string') {
            let val = (value || 0).toString();
            while (val.indexOf('.') >= 0) val = val.replace('.', '');
            while (val.indexOf(',') >= 0) val = val.replace(',', '.');
            let num = Number(val);
            return num;
        } return value;
    }
    private async renderAndLoadItems() {
        let items: OptionItem[];
        if (this.decorator.lookup.items) {
            items = _.cloneDeep(this.decorator.lookup.items);
        } else if (!this.decorator.lookup.dependId && this.decorator.lookup.url) {
            let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
            columns.unshift(this.decorator.lookup.propertyValue || 'Id');
            if (this.decorator.lookup.propertyGroup)
                columns.push(this.decorator.lookup.propertyGroup);
            this.loading = true;
            let url = this.formatUrl(this.decorator.lookup.url),
                key = this.decorator.lookup.url;
            while (key.indexOf('/') >= 0)
                key = key.replace('/', '_');
            if (this.decorator.lookup.params) {
                let keys = Object.keys(this.decorator.lookup.params);
                if (keys && keys.length > 0) {
                    keys.forEach((item: any) => {
                        url += url.indexOf('?') >= 0
                            ? '&' + item + '=' + this.decorator.lookup.params[item]
                            : '?' + item + '=' + this.decorator.lookup.params[item];
                    });
                }
            }

            // get from cache
            items = StoreHelper.loadStoreItemWithExpiry(key);

            // get from api
            if (!items || items.length == 0) {
                if (this.decorator.lookup.loadType == DropdownLoadType.All) {
                    items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                        return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                    });
                } else {
                    if (this.value) {
                        let valueKey = this.decorator.lookup.propertyValue;
                        items = await this.service.lookupItem(url, this.value, valueKey, columns).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                        });

                        let optionItem = items && items.find(c => c.value == this.value);
                        if (optionItem) {
                            this.decorator.lookup.selected = {
                                value: this.value,
                                label: optionItem.label,
                                originalItem: optionItem.originalItem,
                            };
                        }
                    } else {
                        items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                        });
                    }
                }
            }

            // cache
            if (this.decorator.lookup.cached && items && items.length > 0) {
                let ttl = this.decorator.lookup.cached;
                StoreHelper.storeItem(key, items, ttl);
            }
            this.loading = false;
        }
        setTimeout(() => { this.reloadItems(items); }, 100);
    }
    private formatString(value: number) {
        if (value == null || value == undefined)
            return '';
        return value.toLocaleString('vi-VN');
    }
    private formatUrl(url: string): string {
        if (url && url.indexOf('[id]') >= 0) {
            let searchParams = new URLSearchParams(location.search);
            if (searchParams.has('id')) {
                let id = searchParams.get("id");
                if (id) url = url.replace('[id]', id);
            }
        }
        return url;
    }
    private async renderEditor($combobox: any, data: any) {
        // destroy
        if ($combobox.hasClass("select2-hidden-accessible")) {
            $combobox.select2("destroy");
        }
        $combobox.empty().select2({
            data: data,
            multiple: this.decorator.multiple,
            placeholder: this.decorator.placeholder,
            maximumSelectionLength: this.decorator.max || 100,
            minimumResultsForSearch: data.length >= 10 || this.decorator.allowSearch ? 0 : Infinity,
            allowClear: this.decorator.readonly || this.decorator.multiple ? false : this.decorator.allowClear,
            matcher: (params: any, data: any) => {
                if (!params.term) return data;
                else {
                    let original_matcher = $.fn.select2.defaults.defaults.matcher;
                    let result = original_matcher(params, data);
                    if (result && data.children && result.children && data.children.length != result.children.length && data.text.toLowerCase().includes(params.term.toLowerCase())) {
                        result.children = data.children;
                    }
                    return result;
                }
            },
            templateResult: (state: any) => {
                if (state.icon) {
                    return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                }
                return state.text;
            },
            templateSelection: (state: any) => {
                if (state.icon) {
                    return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                }
                return state.text;
            },
        }).on('select2:select', (e: any) => {
            let items = $combobox.select2('data') || [];
            if (items) {
                items = items.map((c: any) => c.id) || [];
            }
            this.value = items.length == 0
                ? null
                : this.decorator.multiple ? items : items[0];
            this.valueChange.emit(this.value);
            if (this.decorator.multiple) {
                if (this.items && this.items.length > 0) {
                    let optionItems = this.items.filter(c => c.value).filter(c => items.indexOf(c.value.toString()) >= 0);
                    this.optionChangeEmit(optionItems);
                }
            } else {
                if (this.items && this.items.length > 0) {
                    let optionItem = this.items.filter(c => c.value).find(c => items.indexOf(c.value.toString()) >= 0);
                    this.optionChangeEmit(optionItem);
                }
            }
        }).on('select2:unselect', (e: any) => {
            let items = $combobox.select2('data') || [];
            if (items) {
                items = items.map((c: any) => c.id) || [];
            }
            this.value = items.length == 0
                ? null
                : this.decorator.multiple ? items : items[0];
            this.valueChange.emit(this.value);
            if (this.decorator.multiple) {
                if (this.items && this.items.length > 0) {
                    let optionItems = this.items.filter(c => c.value).filter(c => items.indexOf(c.value.toString()) >= 0);
                    this.optionChangeEmit(optionItems);
                }
            } else {
                if (this.items && this.items.length > 0) {
                    let optionItem = this.items.filter(c => c.value).find(c => items.indexOf(c.value.toString()) >= 0);
                    this.optionChangeEmit(optionItem);
                }
            }
        }).on('select2:clear', () => {
            this.value = null;
            this.valueChange.emit(this.value);
            this.optionChangeEmit(null);
            this.clearValue.emit();
        });
    }
    private async renderEditorAjax($combobox: any, data: any) {
        // destroy
        if ($combobox.hasClass("select2-hidden-accessible")) {
            $combobox.select2("destroy");
        }
        let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, this.decorator.property);
        $combobox.empty().select2({
            data: data,
            minimumInputLength: 0,
            multiple: this.decorator.multiple,
            placeholder: this.decorator.placeholder,
            maximumSelectionLength: this.decorator.max || 100,
            allowClear: this.decorator.readonly || this.decorator.multiple ? false : this.decorator.allowClear,
            ajax: {
                url: () => {
                    return ApiUrl.ToUrl(this.url || '/admin' + this.decorator.lookup.url);
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.service.getToken(),
                },
                delay: 250,
                cache: false,
                dataType: 'json',
                data: (params: any) => {
                    return {
                        q: params.term,
                        page: params.page || 1
                    };
                },
                processResults: (result: ResultApi, params: any) => {
                    let items = OptionItem.createOptionItems(result, targetProperty);
                    if (items && items.length > 0) {
                        this.items = items;
                        items.forEach((item: OptionItem) => {
                            let index = this.allItems.findIndex(c => c.value == item.value);
                            if (index < 0)
                                this.allItems.push(_.cloneDeep(item));
                        });
                    }
                    let data = items && items.map(c => {
                        return {
                            id: c.value,
                            icon: c.icon,
                            text: c.label,
                            original: c.originalItem
                        };
                    }) || [];
                    if (!this.value && this.decorator.autoSelect) {
                        let selectItem = data.find(c => c.id);
                        this.value = selectItem && selectItem.id;
                    }
                    else if (!this.decorator.multiple) data.unshift({ id: '', icon: null, text: this.decorator.placeholder, original: null });

                    params.page = params.page || 1;
                    return {
                        results: data,
                        pagination: {
                            more: items && items.length > 1
                        }
                    };
                },
            },
            matcher: (params: any, data: any) => {
                if (!params.term) return data;
                else {
                    let original_matcher = $.fn.select2.defaults.defaults.matcher;
                    let result = original_matcher(params, data);
                    if (result && data.children && result.children && data.children.length != result.children.length && data.text.toLowerCase().includes(params.term.toLowerCase())) {
                        result.children = data.children;
                    }
                    return result;
                }
            },
            templateResult: (state: any) => {
                if (state.icon) {
                    return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                }
                return state.text;
            },
            templateSelection: (state: any) => {
                if (state.icon) {
                    return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                }
                return state.text;
            },
        }).on('select2:select', (e: any) => {
            this.activeChangeEvent = false;
            let items = $combobox.select2('data') || [],
                selectedIds = items?.map((c: any) => c.id) || [];
            let value = items.length == 0
                ? null
                : this.decorator.multiple ? selectedIds : selectedIds[0];
            this.value = value;
            this.valueChange.emit(value);
            if (this.decorator.multiple) {
                if (this.allItems && this.allItems.length > 0) {
                    let optionItems = this.allItems.filter(c => selectedIds.indexOf(c.value) >= 0);
                    this.optionChangeEmit(optionItems);
                    this.updateAjaxItems(optionItems);
                }
            } else {
                if (this.allItems && this.allItems.length > 0) {
                    let optionItem = this.allItems.find(c => selectedIds.indexOf(c.value) >= 0);
                    this.optionChangeEmit(optionItem);
                    this.updateAjaxItems(optionItem);
                }
            }
            setTimeout(() => this.activeChangeEvent = true, 500);
        }).on('select2:unselect', (e: any) => {
            this.activeChangeEvent = false;
            let items = $combobox.select2('data') || [],
                selectedIds = items?.map((c: any) => c.id) || [];
            let value = items.length == 0
                ? null
                : this.decorator.multiple ? selectedIds : selectedIds[0];
            this.value = value;
            this.valueChange.emit(value);
            if (this.decorator.multiple) {
                if (this.items && this.items.length > 0) {
                    let optionItems = this.items.filter(c => selectedIds.indexOf(c.value) >= 0);
                    this.optionChangeEmit(optionItems);
                    this.updateAjaxItems(optionItems);
                }
            } else {
                if (this.items && this.items.length > 0) {
                    let optionItem = this.items.find(c => selectedIds.indexOf(c.value) >= 0);
                    this.optionChangeEmit(optionItem);
                    this.updateAjaxItems(optionItem);
                }
            }
            setTimeout(() => this.activeChangeEvent = true, 500);
        }).on('select2:clear', () => {
            this.activeChangeEvent = false;
            this.value = null;
            this.clearValue.emit();
            this.optionChangeEmit(null);
            this.valueChange.emit(this.value);
            $combobox.val(null).trigger('change');
            setTimeout(() => this.activeChangeEvent = true, 500);
        });

        this.setValueSelected();
    }
    private optionChangeEmit(items: OptionItem | OptionItem[]) {
        if (!this.optionChanging) {
            this.optionChanging = true;
            let originalItems: any[] = null;
            if (items) {
                originalItems = Array.isArray(items)
                    ? items.map((c: OptionItem) => { return c.originalItem })
                    : [items].map((c: OptionItem) => { return c.originalItem });
                originalItems = originalItems.filter(c => c != null && c != undefined);
            }
            this.optionChange.emit(items);
            this.event.RefreshItems.emit({
                value: this.value,
                index: this.decorator.index,
                originalItems: originalItems,
                property: this.decorator.property,
            });
            setTimeout(() => this.optionChanging = false, 300);
        }
    }
    private updateAjaxItems(optionItems: OptionItem[] | OptionItem) {
        if (Array.isArray(optionItems)) {
            let cloneItems: OptionItem[] = _.cloneDeep(optionItems);
            cloneItems.forEach((optionItem: OptionItem) => {
                if (optionItem) {
                    let index = this.data.ajaxItems.filter(c => c != null).findIndex(c => c.value == optionItem.value);
                    if (index < 0)
                        this.data.ajaxItems.push(optionItem);
                    else
                        this.data.ajaxItems[index] = optionItem;
                }
            });
        } else {
            let optionItem: OptionItem = _.cloneDeep(optionItems);
            if (optionItem) {
                let index = this.data.ajaxItems.filter(c => c != null).findIndex(c => c.value == optionItem.value);
                if (index < 0)
                    this.data.ajaxItems.push(optionItem);
                else
                    this.data.ajaxItems[index] = optionItem;
            }
        }
    }
    private async loadByDependcy(property: string, value: any, originalItems?: any[]) {
        if (this.decorator.lookup.loadType == DropdownLoadType.All) {
            if (value) {
                let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, this.decorator.property);
                let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
                columns.unshift(this.decorator.lookup.propertyValue || 'Id');
                this.loading = true;
                let items: OptionItem[];
                if (this.decorator.lookup.propertyGroup)
                    columns.push(this.decorator.lookup.propertyGroup);
                if (this.decorator.lookup.url) {
                    let url = this.decorator.lookup.url;
                    if (value) {
                        url += '/' + value;
                    }
                    if (this.decorator.lookup.dependId &&
                        Array.isArray(this.decorator.lookup.dependId)) {
                        for (let i = 0; i < this.decorator.lookup.dependId.length; i++) {
                            let depend = this.decorator.lookup.dependId[i],
                                originalItem = originalItems[i];
                            if (depend && originalItem) {
                                let propertyOption = depend.PropertyOption,
                                    valueOption = originalItem[depend.PropertyOption];
                                if (propertyOption && valueOption) {
                                    url += url.indexOf('?') >= 0
                                        ? '&' + propertyOption + '=' + valueOption
                                        : '?' + propertyOption + '=' + valueOption;
                                }
                            }
                        }
                    }
                    items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                        this.url = url;
                        return OptionItem.createOptionItems(result, targetProperty);
                    });
                } else {
                    let dependId: string = <string>this.decorator.lookup.dependId;
                    items = this.decorator.lookup.items.filter(c => c[dependId] == value);
                }
                this.loading = false;
                if (items && items.length > 0) {
                    if (!this.decorator.multiple) {
                        if (this.decorator.type == DropdownType.Normal) {
                            let option = items.find(c => c.value == this.value);
                            if (!option) {
                                this.value = null; this.setValue();
                            }
                        }
                    } else {
                        if (this.value) this.setValue();
                        else {
                            if (this.prevValue) {
                                this.value = _.cloneDeep(this.prevValue);
                                this.prevValue = null;
                                this.setValue();
                            } else {
                                this.value = null;
                                this.setValue();
                            }
                        }
                    }
                } else {
                    this.value = null; this.setValue();
                }
                this.reloadItems(items);
            } else {
                this.value = null; this.setValue();
                this.reloadItems([]);
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
