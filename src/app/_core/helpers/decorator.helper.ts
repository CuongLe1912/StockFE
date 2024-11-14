import { TableEx } from "../decorators/table.decorator";
import { ObjectEx } from "../decorators/object.decorator";
import { getMetadataClass, getMetadataProperties } from "../decorators/register.metadata";

export class DecoratorHelper {
    public static decoratorClass(target: any): TableEx {
        if (typeof target == 'string') {
            let meta = getMetadataClass(target);
            return meta;
        } else {
            let meta = getMetadataClass(target.name);
            return meta;
        }
    }
    public static decoratorProperty(target: any, property: string): ObjectEx {
        let meta = this.decoratorProperties(target),
            metaBase = this.decoratorProperties('BaseEntity'),
            metaBaseEx = this.decoratorProperties('BaseExEntity');
        return (meta && meta.find(c => c.property == property)) ||
            (metaBase && metaBase.find(c => c.property == property)) ||
            (metaBaseEx && metaBaseEx.find(c => c.property == property));
    }
    public static decoratorProperties(target: any, checkBaseClass: boolean = true): ObjectEx[] {
        if (!target) return null;
        let result: any[] = [],
            targetString = typeof target == 'string'
                ? target
                : target.name || target.constructor.name,
            metaObject = getMetadataProperties(targetString),
            metaBase = checkBaseClass ? getMetadataProperties('BaseEntity') : null,
            metaBaseEx = checkBaseClass ? getMetadataProperties('BaseExEntity') : null;
        if (metaBase) {
            for (let value of metaBase.values()) {
                result.push(value);
            }
        }
        if (metaBaseEx) {
            for (let value of metaBaseEx.values()) {
                result.push(value);
            }
        }
        if (metaObject) {
            for (let value of metaObject.values()) {
                result.push(value);
            }
        }
        return result;
    }
}