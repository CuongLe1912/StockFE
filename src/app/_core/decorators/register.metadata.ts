import "reflect-metadata";
import { TableEx } from "./table.decorator";
import { ObjectEx } from "./object.decorator";
var REGISTRY_CLASS_NAME = new Map<string, any>();
var REGISTRY_METADATA_CLASS = new Map<string, TableEx>();
var REGISTRY_METADATA_PROPERTY = new Map<string, Map<string, ObjectEx>>();

export function registerClass(decorator: TableEx) {
    let className = decorator.className.toLowerCase();
    if (!REGISTRY_METADATA_CLASS.has(className)) {
        REGISTRY_METADATA_CLASS.set(className, decorator);
    }
}

export function getConstructorClass(target: string) {
    return REGISTRY_CLASS_NAME.get(target);
}

export function registerClassName(constructor: Function) {
    if (!REGISTRY_CLASS_NAME.has(constructor.name)) {
        REGISTRY_CLASS_NAME.set(constructor.name, constructor);
    }
}

export function getMetadataClass(target: string): TableEx {
    target = target.toLowerCase();
    let item = REGISTRY_METADATA_CLASS.get(target);
    if (!item)
        item = REGISTRY_METADATA_CLASS.get(target + 'dto');
    if (!item)
        item = REGISTRY_METADATA_CLASS.get(target + 'entity');
    return item;
}

export function getMetadataProperties(target: string): ObjectEx[] {
    target = target.toLowerCase();
    let result: ObjectEx[] = [],
        map = REGISTRY_METADATA_PROPERTY.get(target);
    if (!map)
        map = REGISTRY_METADATA_PROPERTY.get(target + 'dto');
    if (!map)
        map = REGISTRY_METADATA_PROPERTY.get(target + 'entity');
    if (map) {
        for (let value of map.values()) {
            result.push(value);
        }
        return result;
    }
    return null;
}

export function getMetadataProperty(target: string, property: string): ObjectEx {
    target = target.toLowerCase();
    let map = REGISTRY_METADATA_PROPERTY.get(target);
    if (!map)
        map = REGISTRY_METADATA_PROPERTY.get(target + 'dto');
    if (!map)
        map = REGISTRY_METADATA_PROPERTY.get(target + 'entity');
    if (map) return map.get(property);
    return null;
}

export function registerProperty(target: string, property: string, decorator: ObjectEx) {
    let map: Map<string, any>;
    target = target.toLowerCase();
    if (REGISTRY_METADATA_PROPERTY.has(target)) {
        map = REGISTRY_METADATA_PROPERTY.get(target);
    } else {
        map = new Map<string, any>();
        REGISTRY_METADATA_PROPERTY.set(target, map);
    }
    if (!map.has(property)) map.set(property, decorator);
}