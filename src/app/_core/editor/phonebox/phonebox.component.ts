declare var $;
import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminDataService } from '../../services/admin.data.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-phonebox',
    templateUrl: 'phonebox.component.html',
    styleUrls: ['phonebox.component.scss']
})
export class PhoneBoxComponent implements OnInit, OnChanges {
    type: string;
    valueText: string;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor(public data: AdminDataService) {
    }

    ngOnInit() {
        this.type = 'tel';
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.max) this.decorator.max = 15;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = StringType.Phone;

        this.render();
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                let prev = changes.value && changes.value.previousValue
                    ? JSON.stringify(changes.value.previousValue)
                    : '';
                let current = changes.value && changes.value.currentValue
                    ? JSON.stringify(changes.value.currentValue)
                    : '';
                if (current != prev) {
                    this.setValue();
                }
            }
        }
    }

    clear() {
        this.value = null;
        this.valueChange.emit(this.value);
    }

    onKeyup() {
        if (!this.valueText) return;
        if (this.valueText.length == 0) return;

        if (/\D/g.test(this.valueText))
            this.valueText = this.valueText.replace(/\D/g, '');
        if (this.valueText.indexOf('0') == 0)
            this.valueText = this.valueText.replace('0', '');
    }

    inputChange() {
        let $item = <any>$('#' + this.decorator.id),
            number = $item && $item.length > 0 && $item.intlTelInput("getNumber");
        this.value = number;
        this.valueChange.emit(this.value);
    }

    onKeypress(event: any) {
        if (isNaN(event.key))
            event.preventDefault();
        else if (event.key == '0') {
            if (!this.valueText || this.valueText.length == 0) {
                event.preventDefault();
            }
        }
    }

    private render() {
        setTimeout(() => {
            let $element = <any>$('#' + this.decorator.id);
            if ($element && $element.length > 0) {
                $element.intlTelInput({
                    autoFormat: false,
                    customPlaceholder: '',
                    initialCountry: 'auto',
                    separateDialCode: true,
                    autoPlaceholder: false,
                    formatOnDisplay: false,
                    autoHideDialCode: false,
                    utilsScript: "../../../../../assets/plugins/bootstrap-phone/build/js/utils.js?" + (new Date()).getTime(),
                    geoIpLookup: (callback: any) => {
                        if (!this.value) {
                            let countryCode: string = this.data.countryIp && this.data.countryIp.Country || 'vn';
                            if (countryCode)
                                countryCode = countryCode.toLowerCase();
                            if (callback) callback(countryCode);
                        }
                    },
                    countrychange: () => { this.inputChange() }
                });
                this.setValue();
            }
        }, 300);
    }

    private setValue() {
        let $element = $("#" + this.decorator.id);
        if ($element && $element.length > 0) {
            if (this.value) {
                $element.intlTelInput("setNumber", this.value);
            }
        }
    }
}
