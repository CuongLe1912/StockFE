import * as _ from 'lodash';
import { DecoratorHelper } from "./decorator.helper";
import { ObjectEx } from "../decorators/object.decorator";
import { getConstructorClass } from '../decorators/register.metadata';

export class EntityHelper {
    public static createObject(target: any) {
        let item: any;
        if (typeof target == 'string') {
            item = getConstructorClass(target).prototype.constructor();
        } else {
            item = new target();
        }
        let decorators = DecoratorHelper.decoratorProperties(target);
        if (decorators) {
            decorators.forEach((decorator: ObjectEx) => {
                if (decorator.property)
                    item[decorator.property] = void 0;
            });
        }
        return item;
    }

    public static createEntity(target: any, item?: any) {
        let entity = this.createObject(target);
        if (item) {
            let decorators = DecoratorHelper.decoratorProperties(target);
            if (decorators) {
                decorators.forEach((decorator: ObjectEx) => {
                    if (decorator.property)
                        entity[decorator.property] = item[decorator.property] == undefined
                            ? null
                            : _.cloneDeep(item[decorator.property]);
                });
            }
            let keys = Object.keys(item);
            keys.forEach((key: string) => {
                let property = decorators.find(c => c.property == key);
                if (!property) 
                    entity[key] = item[key] == undefined
                        ? null
                        : _.cloneDeep(item[key]);
            });
        }
        return entity;
    }

    public static createEntities(target: any, item: any[]) {
        return item.map(c => this.createEntity(target, c));
    }
}