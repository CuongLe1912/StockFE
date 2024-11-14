import * as CryptoJS from 'crypto-js';
import { UAParser } from "ua-parser-js";
import { AppConfig } from "./app.config";
import { IpDto } from '../domains/objects/ip.dto';
import { UserActivityDto } from "../domains/objects/user.activity.dto";

export class UserActivityHelper {
    public static async IncognitoMode() {
        return await this.PrivateWindow.then((value: boolean) => {
            return value;
        })
    }
    public static CreateHash256(text: string): string {
        let hash = CryptoJS.HmacSHA256(text, AppConfig.SecretKey);
        return CryptoJS.enc.Base64.stringify(hash);
    }
    public static async UserActivity(item: IpDto) {
        let parser = new UAParser(),
            parserResult = parser.getResult(),
            incognito = await this.IncognitoMode();
        let activity: UserActivityDto = {
            Ip: item && item.Ip,
            Incognito: incognito,
            Country: item && item.Country,
            Os: parserResult.os.name + ' [Version: ' + parserResult.os.version + ']',
            Browser: parserResult.browser.name + ' [Version: ' + parserResult.browser.version + ']',
        };
        return activity;
    }

    static isNewChrome() {
        let pieces = navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);
        if (pieces == null || pieces.length != 5) {
            return undefined;
        }
        let major = pieces.map(piece => parseInt(piece, 10))[1];
        if (major >= 76)
            return true
        return false;
    }
    static async chrome76Detection() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const { quota } = await navigator.storage.estimate();
            if (quota < 120000000)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }
    static PrivateWindow = new Promise((resolve) => {
        try {
            let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                navigator.userAgent &&
                navigator.userAgent.indexOf('CriOS') == -1 &&
                navigator.userAgent.indexOf('FxiOS') == -1;

            if (isSafari) {
                //Safari
                let e = false;
                if ((<any>window).safariIncognito) {
                    e = true;
                } else {
                    try {
                        (<any>window).openDatabase(null, null, null, null);
                        window.localStorage.setItem("test", '1');
                        resolve(false);
                    } catch (t) {
                        e = true;
                        resolve(true);
                    }
                    void !e && (e = !1, window.localStorage.removeItem("test"))
                }
            } else if (navigator.userAgent.includes("Firefox")) {
                //Firefox
                let db = indexedDB.open("test");
                db.onerror = function () { resolve(true); };
                db.onsuccess = function () { resolve(false); };
            } else if (navigator.userAgent.includes("Edge") || navigator.userAgent.includes("Trident") || navigator.userAgent.includes("msie")) {
                //Edge or IE
                if (!window.indexedDB && ((<any>window).PointerEvent || (<any>window).MSPointerEvent))
                    resolve(true);
                resolve(false);
            } else {	//Normally ORP or Chrome
                //Other
                if (UserActivityHelper.isNewChrome())
                    resolve(UserActivityHelper.chrome76Detection());

                const fs = (<any>window).RequestFileSystem || (<any>window).webkitRequestFileSystem;
                if (!fs) resolve(null);
                else {
                    fs((<any>window).TEMPORARY, 100, () => {
                        resolve(false);
                    }, () => {
                        resolve(true);
                    });
                }
            }
        }
        catch (err) {
            resolve(null);
        }
    });
}