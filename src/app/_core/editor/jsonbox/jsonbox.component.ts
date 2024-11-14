declare var $;
import * as JSONEditor from 'jsoneditor';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-jsonbox',
    templateUrl: 'jsonbox.component.html',
    styleUrls: ['jsonbox.component.scss']
})
export class JsonBoxComponent implements OnInit, OnChanges {
    jsonEditor: any;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.max) this.decorator.max = 500000;
        if (!this.decorator.type) this.decorator.type = StringType.Json;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';

        setTimeout(() => {
            let elementId = 'div#' + this.decorator.id,
                $element = $(elementId);
            if ($element && $element.length > 0) {
                this.jsonEditor = new JSONEditor(document.getElementById(this.decorator.id), {
                    mode: 'code',
                    modes: ['code', 'form', 'text', 'tree', 'view', 'preview'],
                    onChange: () => {
                        let json = this.jsonEditor.get();
                        this.value = JSON.stringify(json);
                        this.valueChange.emit(this.value);
                    }
                });
                this.setValue();
            }
        }, 200);
    }

    ngOnChanges() {
        this.setValue();
    }

    private setValue() {
        if (this.value) {
            try {
                let json = JSON.parse(this.value);
                this.jsonEditor.set(json);
            } catch { }
        }
    }
}
