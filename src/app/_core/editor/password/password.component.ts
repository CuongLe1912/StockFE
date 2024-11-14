import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'editor-password',
    templateUrl: 'password.component.html',
    styleUrls: ['password.component.scss']
})
export class PasswordComponent {
    type = 'password';
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.max) this.decorator.max = 250;
        if (!this.decorator.type) this.decorator.type = StringType.Text;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
    }

    view() {
        this.type = this.type == 'text'
            ? 'password'
            : 'text';
    }

    inputChange() {
        this.valueChange.emit(this.value);
    }
}
