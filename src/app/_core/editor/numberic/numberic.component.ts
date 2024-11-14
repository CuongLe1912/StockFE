declare var $;
import * as _ from 'lodash';
import { NumberType } from '../../domains/enums/data.type';
import { OptionItem } from '../../domains/data/option.item';
import { NumberEx } from '../../decorators/number.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-numberic',
    templateUrl: 'numberic.component.html',
    styleUrls: ['numberic.component.scss']
})
export class NumbericComponent implements OnInit, OnChanges {
    type: string;
    touch: boolean;
    valueTo: number;
    valueFrom: number;
    @Input() value: any;
    NumberType = NumberType;
    @Input() items: OptionItem[];
    @Input() decorator: NumberEx;
    activeChangeEvent: boolean = false;
    @Output() onBlur = new EventEmitter<number>();
    @Output() valueChange = new EventEmitter<any>();
    keyNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    ngOnInit() {
        this.type = 'text';
        if (!this.decorator)
            this.decorator = new NumberEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.step) this.decorator.step = 1;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.max) this.decorator.max = 1000000;
        if (!this.decorator.decimals) this.decorator.decimals = 0;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        this.touch = this.decorator.type && this.decorator.type == NumberType.Numberic;
        this.render();
        setTimeout(() => this.activeChangeEvent = true, 500);
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue && this.activeChangeEvent) {
                    this.setValue();
                    if (changes.value.currentValue) {
                        this.event.Validate.emit({
                            key: this.decorator.key,
                            target: this.decorator.target,
                        });
                    }
                }
            }
        }
    }


    plus() {
        this.activeChangeEvent = false;
        let num = this.value ? this.formatNumber(this.value) : 0,
            step = this.decorator.step,
            value = num + step;
        if (value <= this.decorator.max) {
            this.value = value;
            setTimeout(() => {
                let valueText = this.formatString(value);
                $('#' + this.decorator.id).val(valueText);
            }, 10);
            this.valueChange.emit(value);
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    minus() {
        this.activeChangeEvent = false;
        let num = this.formatNumber(this.value),
            step = this.decorator.step,
            value = num - step;
        if (value >= this.decorator.min) {
            this.value = value;
            setTimeout(() => {
                let valueText = this.formatString(value);
                $('#' + this.decorator.id).val(valueText);
            }, 10);
            this.valueChange.emit(value);
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }

    clear() {
        this.value = null;
        this.valueChange.emit(this.value);
    }
    clearTo() {
        this.valueTo = null;
        this.updateValue();
    }
    clearFrom() {
        this.valueFrom = null;
        this.updateValue();
    }

    inputChange() {
        this.activeChangeEvent = false;
        let num = this.formatNumber(this.value);
        if (this.value) {
            if (num > this.decorator.max) {
                this.value = this.decorator.max;
                num = this.formatNumber(this.value);
            }
            if (this.decorator.allowNegative) {
                if (this.value.toString() != '-') {
                    if (num < this.decorator.min) {
                        this.value = this.decorator.min;
                        num = this.formatNumber(this.value);
                    }
                }
            } else {
                if (this.value.toString().indexOf('-') >= 0) {
                    this.value = this.decorator.min;
                    num = this.formatNumber(this.value);
                }
            }

            if (!this.decorator.decimals) {
                if (this.value.toString().indexOf(',') >= 0) {
                    this.value = this.decorator.min;
                    num = this.formatNumber(this.value);
                }
            }
            if (this.value.toString() == '-' && this.decorator.allowNegative) {
            } else {
                if (this.value &&
                    !this.value.toString().endsWith(',') &&
                    !this.value.toString().endsWith(',0')) {
                    setTimeout(() => {
                        let valueText = this.formatString(num);
                        if (valueText && valueText == 'NaN')
                            $('#' + this.decorator.id).val('');
                        else
                            $('#' + this.decorator.id).val(valueText);
                    }, 10);
                }
            }
        }
        if (this.value != '' && this.value == 0) $('#' + this.decorator.id).val('0');
        if (!isNaN(num)) this.valueChange.emit(this.value ? num : this.value);
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    onNumberBlur() {
        if (this.value) {
            if (this.value.toString() == '-') {
                this.value = null;
                this.activeChangeEvent = false;
                this.valueChange.emit(this.value);
                setTimeout(() => this.activeChangeEvent = true, 500);
            } else if (this.value.toString().indexOf('-') >= 0) {
                if (!this.decorator.allowNegative) {
                    this.value = null;
                    this.activeChangeEvent = false;
                    this.valueChange.emit(this.value);
                    setTimeout(() => this.activeChangeEvent = true, 500);
                }
            }
            this.onBlur.emit(this.value);
        } else {
            if (this.value != null && this.value != undefined) {
                if (this.value.toString() == '0') {
                    if (!this.decorator.allowZero) {
                        this.value = null;
                        this.onBlur.emit(this.value);
                        this.activeChangeEvent = false;
                        this.valueChange.emit(this.value);
                        setTimeout(() => this.activeChangeEvent = true, 500);
                    }
                }
            }
        }
    }

    inputFromToBlur(type: string) {
        setTimeout(() => {
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
                        }, 10);
                        this.updateValue();
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
                        }, 10);
                        this.updateValue();
                    }
                }
            }
        }, 300);
    }
    inputFromToChange(type: string) {
        this.activeChangeEvent = false;
        if (type == 'from') {
            let num = this.formatNumber(this.valueFrom);
            if (num > this.decorator.max) {
                this.valueFrom = this.decorator.max;
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
                }, 10);
            }
        } else {
            let num = this.formatNumber(this.valueTo);
            if (num > this.decorator.max) {
                this.valueTo = this.decorator.max;
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
                }, 10);
            }
        }
        this.updateValue();
        setTimeout(() => this.activeChangeEvent = true, 500);
    }

    onNumberKeypress(e: any) {
        this.activeChangeEvent = false;
        setTimeout(() => this.activeChangeEvent = true, 2000);
        let key = e.key,
            val = e.target.value;
        if (e.ctrlKey && (key == 'c' || key == 'a' || key == 'v'))
            return true;
        if (!this.decorator.decimals) {
            if (key == ',') return false;
            if (!val && key == '0') {
                if (!this.decorator.allowZero) return false;
                else return true;
            }
            if (!val && key == '-') {
                if (!this.decorator.allowNegative) return false;
                else return true;
            }
        } else {
            if (key == ',') {
                if (!val || val.indexOf(',') >= 0)
                    return false;
                else
                    return true;
            }
            if (!val && key == '0') {
                if (!this.decorator.allowZero) return false;
                else return true;
            }
            if (!val && key == '-') {
                if (!this.decorator.allowNegative) return false;
                else return true;
            }
        }
        if (this.keys.indexOf(key) < 0) return false;
        if (val && this.decorator.decimals && this.keyNumbers.indexOf(key) >= 0) {
            const [, decimal] = val.toString().split(',');
            const precision = decimal ? decimal.length : 0;
            if (precision >= this.decorator.decimals)
                return false;
        }
        return true;
    }

    onNumberKeydown(e: any) {
        let key = e.key,
            val = e.target.value;
        if (this.decorator.decimals) {
            if (key == ',') {
                if (!val || val.indexOf(',') >= 0)
                    return false;
            }
        } else {
            if (key == ',') return false;
        }
        if (!this.decorator.allowNegative) {
            if (key == '-') return false;
        }
        if (!this.decorator.allowZero) {
            if (!val && key == '0') return false;
        }
        return true;
    }

    private render() {
        if (!this.decorator.readonly) {
            if (this.decorator.type == NumberType.Text) {
                if (this.value) {
                    let valueNumber = UtilityExHelper.formatStringtoNumber(this.value)
                    let valueText = this.formatString(valueNumber);
                    setTimeout(() => {
                        $('#' + this.decorator.id).val(valueText);
                    }, 10);
                }
            } else if (this.decorator.type == NumberType.Between) {
                if (this.value) {
                    let values = Array.isArray(this.value)
                        ? this.value as []
                        : this.value.toString().split('-');

                    let value1 = values && values[0],
                        valueText1 = this.formatString(value1);
                    this.valueFrom = UtilityExHelper.formatStringtoNumber(value1);
                    setTimeout(() => $('#from-' + this.decorator.id).val(valueText1), 300);

                    let value2 = values && values[1],
                        valueText2 = this.formatString(value2);
                    this.valueTo = UtilityExHelper.formatStringtoNumber(value2);
                    setTimeout(() => $('#to-' + this.decorator.id).val(valueText2), 300);
                }
            }
        } else {
            if (this.value) {
                if (this.decorator.type == NumberType.Between) {
                    let values = Array.isArray(this.value)
                        ? this.value as []
                        : this.value.toString().split('-');

                    let value1 = values && values[0],
                        valueText1 = this.formatString(value1);
                    $('#from-' + this.decorator.id).val(valueText1);

                    let value2 = values && values[1],
                        valueText2 = this.formatString(value2);
                    $('#to-' + this.decorator.id).val(valueText2);
                } else {
                    let valueNumber = UtilityExHelper.formatStringtoNumber(this.value)
                    let valueText = this.formatString(valueNumber);
                    setTimeout(() => {
                        $('#' + this.decorator.id).val(valueText);
                    }, 10);
                }
            }
        }
    }
    private setValue() {
        if (this.value != null) {
            if (this.decorator.type == NumberType.Between) {
                let values = Array.isArray(this.value)
                    ? this.value as []
                    : this.value.toString().split('-');

                let value1 = values && values[0],
                    valueText1 = this.formatString(value1);
                $('#from-' + this.decorator.id).val(valueText1);

                let value2 = values && values[1],
                    valueText2 = this.formatString(value2);
                $('#to-' + this.decorator.id).val(valueText2);
            } else {
                let valueNumber = UtilityExHelper.formatStringtoNumber(this.value)
                let valueText = this.formatString(valueNumber);
                setTimeout(() => {
                    $('#' + this.decorator.id).val(valueText);
                }, 10);
            }
        }
    }
    private updateValue() {
        let valueFrom = this.valueFrom == null || this.valueFrom == undefined || this.valueFrom.toString() == ''
            ? null
            : this.formatNumber(this.valueFrom);
        let valueTo = this.valueTo == null || this.valueTo == undefined || this.valueTo.toString() == ''
            ? null
            : this.formatNumber(this.valueTo);
        this.value = [valueFrom, valueTo];
        this.valueChange.emit(this.value);
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
    private formatString(value: number) {
        if (value == null || value == undefined)
            return '';
        if (value.toString() == '-' && this.decorator.allowNegative)
            return value;
        if (value % 1 == 0) return value.toLocaleString('vi-VN');
        return this.decorator.decimals
            ? value.toLocaleString('vi-VN', { maximumFractionDigits: this.decorator.decimals })
            : value.toLocaleString('vi-VN');
    }
}
