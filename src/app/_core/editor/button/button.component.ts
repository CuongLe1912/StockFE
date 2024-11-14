import * as _ from 'lodash';
import { EnumHelper } from '../../helpers/enum.helper';
import { ButtonType } from '../../domains/enums/button.type';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'editor-button',
    templateUrl: 'button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() icon: string;
    @Input() label: string;
    @Input() type: ButtonType;
    @Input() process: boolean;
    @Input() disabled: boolean;
    @Input() className: string;
    @Output() click = new EventEmitter();
    @Output() processChange = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
        if (!this.type) this.type = ButtonType.Primary;
        if (!this.className) this.className = 'btn btn-' + EnumHelper.exportName(ButtonType, this.type).toLowerCase();
    }

    buttonClick() {
        this.click.emit();
    }
}
