import "reflect-metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { registerClass, registerClassName } from "./register.metadata";

export class TableEx {
    name?: string;
    title?: string;
    className?: string;
}

export function TableDecorator(table?: TableEx) {
    return function (constructor: Function) {
        if (!table) table = new TableEx();
        if (!table.className) table.className = constructor.name;
        if (!table.name) {
            table.name = constructor.name.replace('Entity', '');
            if (table.name.lastIndexOf('Dto') >= 0) {
                table.name = table.name.replace('Dto', '');
            }
        }
        if (!table.title) table.title = UtilityExHelper.createLabel(table.name);
        registerClassName(constructor);
        registerClass(table);
    }
}