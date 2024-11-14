import { ResultApi } from "./result.api";
import { StringEx } from "../../decorators/string.decorator";
import { BooleanEx } from "../../decorators/boolean.decorator";
import { DropDownEx } from "../../decorators/dropdown.decorator";

export class OptionItem {
    public value: any;
    public icon?: string;
    public label: string;
    public group?: string;
    public color?: string;
    public index?: number;
    public disabled?: boolean;
    public selected?: boolean;
    public originalItem?: any;

    constructor(value: any, label: string, originalItem: any = null) {
        this.value = value;
        this.label = label;
        this.selected = false;
        this.originalItem = originalItem;
    }

    public static createOptionItemsFromBoolean() {
        let options: OptionItem[] = [
            { value: true, label: 'True' },
            { value: false, label: 'False' }
        ];
        return options;
    }

    public static createOptionItemsFromArray(items: string[]) {
        let options: OptionItem[] = [];
        if (items) {
            items.forEach((item: string) => {
                let option: OptionItem = {
                    label: item,
                    value: item,
                    icon: item.indexOf('socicon') >= 0 || item.indexOf('la ') >= 0
                        ? item
                        : null,
                };
                options.push(option);
            });
        }
        return options;
    }

    public static createOptionItemsFromArrayNumber(items: number[]) {
        let options: OptionItem[] = [];
        if (items) {
            items.forEach((item: number) => {
                let option: OptionItem = {
                    value: item,
                    label: item.toString(),
                    icon: item.toString().indexOf('socicon') >= 0 || item.toString().indexOf('la ') >= 0
                        ? item.toString()
                        : null,
                };
                options.push(option);
            });
        }
        return options;
    }

    public static createOptionItemsFromObject(items: any[], property: string) {
        let options: OptionItem[] = [];
        if (items && items.length > 0) {
            items.forEach((item: any) => {
                let option: OptionItem = {
                    label: item && item[property],
                    value: item && item[property],
                };
                options.push(option);
            });
        }
        return options;
    }

    public static createOptionItem(result: ResultApi, decorator: DropDownEx): OptionItem {
        if (ResultApi.IsSuccess(result)) {
            let item = result.Object as any;
            if (item) {
                let label: string = '';
                if (decorator.lookup.propertyDisplay) {
                    decorator.lookup.propertyDisplay.forEach((field: string) => {
                        if (item[field]) label += label ? ' - ' + item[field] : item[field];
                    });
                }
                let option: OptionItem = {
                    label: label,
                    originalItem: item,
                    value: item[decorator.lookup.propertyValue],
                    group: decorator.lookup.propertyGroup ? item[decorator.lookup.propertyGroup] : null
                };
                return option;
            }
        }
        return null;
    }

    public static createOptionItems(result: ResultApi, decorator: DropDownEx | BooleanEx | StringEx, emptyItem?: OptionItem) {
        let options: OptionItem[] = [];
        if (ResultApi.IsSuccess(result) && result?.Object) {
            let items = Array.isArray(result.Object)
                ? result.Object as any[]
                : [result.Object];
            if (items) {
                if (emptyItem) {
                    options.push(emptyItem);
                }
                items.forEach((item: any) => {
                    let label: string = '', group = '';
                    if (decorator.lookup.propertyDisplay) {
                        decorator.lookup.propertyDisplay.forEach((field: string) => {
                            if (item[field]) label += label ? ' - ' + item[field] : item[field];
                        });
                    }
                    let option: OptionItem = {
                        label: label,
                        originalItem: item,
                        value: item[decorator.lookup.propertyValue],
                        group: decorator.lookup.propertyGroup ? item[decorator.lookup.propertyGroup] : null
                    };
                    options.push(option);
                });
            }
        }
        return options;
    }
}
