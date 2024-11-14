interface IDictionary {
    values(): any[];
    keys(): string[];
    remove(key: string): void;
    containsKey(key: string): boolean;
    add(key: string, value: any): void;
}

export class Dictionary<T> {

    _values: T[] = [];
    _keys: string[] = [];

    constructor(init: { key: string; value: any; }[]) {

        for (let x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }

    values(): any[] {
        return this._values;
    }

    keys(): string[] {
        return this._keys;
    }

    remove(key: string) {
        let index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    }

    lookup(): IDictionary {
        return this;
    }

    containsKey(key: string) {
        if (typeof this[key] === "undefined") {
            return false;
        }

        return true;
    }

    add(key: string, value: any) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }
}