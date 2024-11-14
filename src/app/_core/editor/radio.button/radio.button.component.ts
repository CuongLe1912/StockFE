declare var $;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { StoreHelper } from '../../helpers/store.helper';
import { ResultApi } from '../../domains/data/result.api';
import { LookupData } from '../../domains/data/lookup.data';
import { OptionItem } from '../../domains/data/option.item';
import { BooleanType } from '../../domains/enums/data.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { BooleanEx } from '../../decorators/boolean.decorator';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-radio-button',
    templateUrl: 'radio.button.component.html',
    styleUrls: ['radio.button.component.scss']
})
export class RadioButtonComponent implements OnInit, OnDestroy, OnChanges {
    group: string;
    loading: boolean;
    @Input() value: any;
    BooleanType = BooleanType;
    checkChange: boolean = true;
    @Input() items: OptionItem[];
    @Input() decorator: BooleanEx;
    subscribeRefreshItems: Subscription;
    @Output() valueChange = new EventEmitter<any>();
    @Output() loaded = new EventEmitter<OptionItem[]>();

    constructor(
        public router: Router,
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new BooleanEx();
        this.group = UtilityExHelper.randomText(8);
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        await this.render();

        // subscribe refreshItems
        if (!this.subscribeRefreshItems) {
            this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: { property: string, value: any }) => {
                this.loadByDependcy(obj.property, obj.value);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (this.checkChange) {
                    if (changes.value.currentValue != changes.value.previousValue) {
                        this.setValue();
                    }
                }
            }
        }
    }

    inputChange(item: OptionItem) {
        if (this.checkChange) {
            let selected = item.selected;
            if (this.items && this.items.length > 0) {
                this.items.forEach((item: OptionItem) => {
                    item.selected = false;
                });
            }
            this.value = item.value;
            item.selected = !selected;
            this.valueChange.emit(this.value);
        }
    }

    radioClick(item: OptionItem) {
        if (item.selected && this.decorator.allowUncheck) {
            this.checkChange = false;
            if (this.items && this.items.length > 0) {
                this.items.forEach((item: OptionItem) => {
                    item.selected = false;
                });
            }
            this.value = null;
            this.valueChange.emit(this.value);
            setTimeout(() => this.checkChange = true, 500);
            setTimeout(() => {
                $('input[name="' + this.group + '"]').removeAttr('checked').prop('checked', false);
            }, 300);
        }
    }

    private setValue() {
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: OptionItem) => {
                if (this.value == item.value) {
                    item.selected = true;
                    this.valueChange.emit(this.value);
                } else item.selected = false;
            });
        }
    }

    private async render() {
        let items: OptionItem[];
        if (this.decorator.type == BooleanType.RadioButton) {
            if (!this.items) {
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
                        items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                        });
                    }

                    // cache
                    if (this.decorator.lookup.cached && items && items.length > 0) {
                        let ttl = this.decorator.lookup.cached;
                        StoreHelper.storeItem(key, items, ttl);
                    }
                    this.loading = false;
                }
                this.items = items;
            }
            if ((this.value == null || this.value == undefined) && this.decorator.autoSelect) {
                let selectItem = this.items.find(c => c.value);
                this.value = selectItem.value;
                selectItem.selected = true;
                this.setValue();
            } else if (this.value == null || this.value == undefined) {
                setTimeout(() => {
                    let selectItem = this.items.find(c => c.selected);
                    if (selectItem) {
                        this.value = selectItem.value;
                        selectItem.selected = true;
                        this.setValue();
                    }
                }, 500);
            } else {
                let selectItem = this.items.find(c => c.value == this.value);
                if (selectItem) {
                    this.value = selectItem.value;
                    selectItem.selected = true;
                    this.setValue();
                }
            }
            this.loaded.emit(this.items);
        } else if (this.decorator.type == BooleanType.Star) {
            items = [];
            for (let i = 1; i <= 5; i++) {
                items.push({
                    value: i,
                    label: i.toString(),
                    selected: i == this.value,
                });
            }
            this.items = items.reverse();

            if ((this.value == null || this.value == undefined) && this.decorator.autoSelect) {
                let selectItem = this.items.find(c => c.value);
                this.value = selectItem.value;
                selectItem.selected = true;
                this.setValue();
            } else if (this.value == null || this.value == undefined) {
                setTimeout(() => {
                    let selectItem = this.items.find(c => c.selected);
                    if (selectItem) {
                        this.value = selectItem.value;
                        selectItem.selected = true;
                        this.setValue();
                    }
                }, 500);
            } else {
                let selectItem = this.items.find(c => c.value == this.value);
                if (selectItem) {
                    this.value = selectItem.value;
                    selectItem.selected = true;
                    this.setValue();
                }
            }
            this.loaded.emit(this.items);
        }
    }
    private formatUrl(url: string): string {
        if (url) {
            if (url.indexOf('[id]') >= 0) {
                let id = this.router?.routerState?.snapshot?.root?.queryParams["id"];
                if (id) url = url.replace('[id]', id);
            }
        }
        return url;
    }
    private async loadByDependcy(property: string, value: any) {
        let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, property);
        if (this.decorator.lookup &&
            this.decorator.lookup.dependId &&
            this.decorator.lookup.dependId == property) {
            let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
            columns.unshift(this.decorator.lookup.propertyValue || 'Id');
            if (this.decorator.lookup.propertyGroup)
                columns.push(this.decorator.lookup.propertyGroup);
            let items = await this.service.lookup(this.decorator.lookup.url, columns, value).then((result: ResultApi) => {
                return OptionItem.createOptionItems(result, targetProperty);
            });
            this.items = this.decorator.type == BooleanType.Star
                ? items.reverse()
                : items;
            this.setValue();
        }
    }
}
