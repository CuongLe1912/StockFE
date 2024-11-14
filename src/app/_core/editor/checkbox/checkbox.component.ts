import * as _ from 'lodash';
import { BooleanType } from '../../domains/enums/data.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { BooleanEx } from '../../decorators/boolean.decorator';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-checkbox',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['checkbox.component.scss']
})
export class CheckBoxComponent implements OnInit {
    label: string;
    BooleanType = BooleanType;
    
    @Input() value: boolean;
    @Input() decorator: BooleanEx;
    @Output() valueChange = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new BooleanEx();
        this.decorator.id = UtilityExHelper.randomText(8);
        this.label = this.decorator.label || this.decorator.description;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
    }

    inputChange() {
        this.value = !this.value;
        this.valueChange.emit(this.value);
    }
}
