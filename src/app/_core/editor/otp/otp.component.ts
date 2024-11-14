import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'editor-otp',
    templateUrl: 'otp.component.html',
    styleUrls: ['otp.component.scss']
})
export class OtpComponent implements OnInit, OnChanges {
    StringType = StringType;
    
    @Input() value: string;
    @Input() decorator: StringEx;
    @ViewChild('ngOtpInput') ngOtpInputRef: any;
    @Output() valueChange = new EventEmitter<string>();


    constructor(public event: AdminEventService) {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.max) this.decorator.max = 6;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.type) this.decorator.type = StringType.Otp;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue) {
                    this.ngOtpInputRef.setValue(changes.value.currentValue);
                }
            }
        }
    }

    inputChange(e: any) {
        if (e && e.length == this.decorator.max) {
            this.value = e;
            this.valueChange.emit(this.value);
        }
    }
}
