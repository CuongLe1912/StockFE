import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'editor-textarea',
    templateUrl: 'textarea.component.html',
    styleUrls: ['textarea.component.scss']
})
export class TextAreaComponent {
    StringType = StringType;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();
    @Output() keyPressEnter = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator) 
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.max) this.decorator.max = 250;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = StringType.MultiText;
    }

    clear() {
        this.value = '';
        this.valueChange.emit(this.value);
    }

    inputChange() {
        if (this.value) {
            while (this.value.indexOf('  ') >= 0)
                this.value = this.value.replace('  ', ' ');
        }
        this.valueChange.emit(this.value);
    }

    onGenerate() {
        if (this.decorator.type == StringType.AutoGenerate) {
            let max = this.decorator.max || 10,
                value = UtilityExHelper.randomText(max);
            this.value = value;
            this.valueChange.emit(this.value);
        }
    }

    onKeyPressEnter() {
        this.keyPressEnter.emit();
    }

    onTextBoxBlur() {
        if (this.value) {
            let temp = this.value;
            this.value = this.value.trim();
            while (this.value.indexOf('  ') >= 0)
                this.value = this.value.replace('  ', ' ');
            if (temp != this.value) this.valueChange.emit(this.value);
        }
    }

    onTextBoxKeypress(e: any) {
        let input = e.target,
            val = input.value,
            end = input.selectionEnd;
        if (e.keyCode == 32 && (val[end - 1] == " " || val[end] == " ")) {
            return false;
        }
    }
}
