import { OptionItem } from "../domains/data/option.item";
import { MLArticlePackageConfig } from "../domains/entities/meeyland/ml.article.entity";

export class StoreHelper {
    public static DataReferences = new Map<string, OptionItem[]>();
    public static MLArticlePriceConfigs: MLArticlePackageConfig[] = [];

    public static loadStoreItem(key: string) {
        let json = key && localStorage.getItem(key);
        return json ? JSON.parse(json) : null;
    }
    public static deleteStoreItem(key: string) {
        let json = key && localStorage.removeItem(key);
    }
    public static loadStoreItemWithExpiry(key: string) {
        const itemStr = localStorage.getItem(key)

        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }

        const item = JSON.parse(itemStr)
        const now = new Date()

        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
    public static storeItem(key: string, obj: any, ttl?: number) {
        if (key && obj) {
            if (!ttl) {
                localStorage.setItem(key, JSON.stringify(obj));
            } else {
                const now = new Date()
                const item = {
                    value: obj,
                    expiry: now.getTime() + ttl,
                }
                localStorage.setItem(key, JSON.stringify(item))
            }
        }
    }
}