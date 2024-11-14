declare var $: any
declare var Coloris;
import { AppConfig } from "./app.config";
import { ConstantHelper } from "./constant.helper";
import { OptionItem } from "../domains/data/option.item";
import { DialogData } from "../domains/data/dialog.data";
import { StatusType } from "../domains/enums/status.type";
import { RegexListType } from "../domains/enums/regex.type";
import { ModalSizeType } from "../domains/enums/modal.size.type";
import { DateTimeFormat } from "../decorators/datetime.decorator";
import { MLArticlePushTime } from "../domains/entities/meeyland/ml.article.entity";
import { MLArticleAccessType, MLArticleStatusType } from "../domains/entities/meeyland/enums/ml.article.type";

export class UtilityExHelper {
    public static escapeHtml(html: string): string {
        if (!html) return '';
        let text = document.createTextNode(html);
        let p = document.createElement('p');
        p.appendChild(text);
        return p.innerHTML;
    }
    public static escapeHtmlTooltip(html: string): string {
        if (!html) return '';
        let text = document.createTextNode(html);
        let p = document.createElement('p');
        p.appendChild(text);
        let tooltip = p.innerHTML;
        while (tooltip.indexOf('"') >= 0)
            tooltip = tooltip.replace('"', '&quot;');
        return tooltip;
    }

    public static renderIdFormat(id: number, meeyId: string, clickable: boolean = false) {
        let text = meeyId && meeyId.length > 5
            ? meeyId.toString().substring(meeyId.length - 5)
            : meeyId,
            meeyIdText = clickable ? '<a routerLink="quickView" type="view" tooltip="Xem chi tiết">' + text + '</a>' : text;
        let result = '<p style="min-height: 25px; overflow: visible;">' +
            '<a style="text-decoration: none !important;" data="' + meeyId + '" tooltip="Sao chép" flow="right">' +
            '<i routerlink="copy" class="la la-copy"></i></a> ' + meeyIdText + '</p>';
        if (id) result += '<p>' + id + '</p>';
        return result;
    }

    public static shortcutString(text, length) {
        if (text.length > length) {
            text = text.toString().substring(0, length) + "..."
        }
        return text;
    }

    public static renderUserInfoFormat(name: string, phone: string, email: string, clickable: boolean = false, tag: string = 'user') {
        let text: string = '';
        if (name) text += clickable
            ? '<a routerLink="quickView" type="' + tag + '">' + UtilityExHelper.escapeHtml(name) + '</a>'
            : '<p title="' + UtilityExHelper.escapeHtml(name) + '">' + UtilityExHelper.escapeHtml(name) + '</p>';
        if (phone) text += '<p><i class=\'la la-phone\'></i> <span title="' + UtilityExHelper.escapeHtml(phone) + '">' + UtilityExHelper.escapeHtml(phone) + '</span></p>';
        if (email) text += '<p><i class=\'la la-inbox\'></i> <span title="' + UtilityExHelper.escapeHtml(email) + '">' + UtilityExHelper.escapeHtml(email) + '</span></p>';
        return text;
    }

    public static renderUserInfoFormatWithCall(name: string, phone: string, email: string, clickable: boolean = false, tag: string = 'user') {
        let text: string = '';
        if (name) text += clickable
            ? '<a routerLink="quickView" type="' + tag + '">' + UtilityExHelper.escapeHtml(name) + '</a>'
            : '<p title="' + UtilityExHelper.escapeHtml(name) + '">' + UtilityExHelper.escapeHtml(name) + '</p>';
        if (phone) text += '<p><i class=\'la la-phone\'></i> <a routerLink="quickView" type="call" title="' + UtilityExHelper.escapeHtml(phone) + '">' + UtilityExHelper.escapeHtml(phone) + '</a></p>';
        if (email) text += '<p><i class=\'la la-inbox\'></i> <span title="' + UtilityExHelper.escapeHtml(email) + '">' + UtilityExHelper.escapeHtml(email) + '</span></p>';
        return text;
    }

    public static renderInformationFormat(values: string[], type: string = null, clickable: boolean = false) {
        let text: string = '';
        if (values && values[0]) {
            if (values && values.length > 0) text += clickable
                ? '<a routerLink="quickView" type="' + type + '">' + values[0] + '</a>'
                : '<p title="' + values[0] + '">' + values[0] + '</p>';
        }
        if (values && values.length > 1) {
            for (let i = 1; i < values.length; i++) {
                if (values[i]) text += '<p title="' + values[i] + '">' + values[i] + '</p>';
            }
        }
        return text;
    }

    public static buildMeeyLandUrl(slug: string) {
        if (slug.indexOf('http') >= 0)
            return slug;
        return AppConfig.MeeyLandConfig.Url + slug;
    }

    public static copyString(text: string) {
        if (text && text.length > 0) {
            const selBox = document.createElement('textarea');
            selBox.value = text;
            selBox.style.top = '0';
            selBox.style.left = '0';
            selBox.style.opacity = '0';
            selBox.style.position = 'fixed';
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
    }

    public static dateString(date: Date) {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);

        let message = '';
        let month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        return message;
    }

    public static randomText(length: number) {
        let result = '';
        let characters = 'abcdefghijklmnopqrstuvwxyz';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static randomNumber(length: number) {
        let result = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static lengthHtml(html: string) {
        // Create a new div element
        let temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return (temporalDivElement.textContent || temporalDivElement.innerText || "").trim().length;
    }

    public static innerTextHtml(html: string) {
        // Create a new div element
        let temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return (temporalDivElement.textContent || temporalDivElement.innerText || "").trim();
    }

    public static dateTimeString(date: Date, showSeconds = false) {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);

        let message = '';
        let month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        message += ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        message += ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        if (showSeconds) {
            message += ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        }
        return message;
    }

    public static toHHMMSS(seconds: number) {
        let h, m, s, result = '';
        // HOURs
        h = Math.floor(seconds / 3600);
        seconds -= h * 3600;
        if (h) {
            result = h < 10 ? '0' + h + ':' : h + ':';
        }
        // MINUTEs
        m = Math.floor(seconds / 60);
        seconds -= m * 60;
        result += m < 10 ? '0' + m + ':' : m + ':';
        // SECONDs
        s = seconds % 60;
        result += s < 10 ? '0' + s : s;
        return result;
    }

    public static toHourMinuteSecond(seconds: number) {
        let h, m, s, result = '';
        if (!seconds) {
            return result += '';
        }
        // HOURs
        h = Math.floor(seconds / 3600);
        seconds -= h * 3600;
        if (h) {
            result = h < 10 ? '0' + h + ' giờ ' : h + ' giờ ';
        }
        // MINUTEs
        m = Math.floor(seconds / 60);
        seconds -= m * 60;
        if (m) {
            result += m < 10 ? '0' + m + ' phút ' : m + ' phút ';
        }
        // SECONDs
        s = seconds % 60;
        result += s < 10 ? '0' + s + ' giây' : s + ' giây';
        return result;
    }

    public static convertNumberMoney(numberMoney: number) {
        return numberMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    public static convertStringMoneyToNumber(numberMoney: number) {
        return parseFloat(numberMoney.toString().replace(/(,|\.)([0-9]{3})/g, '$2').replace(/(,|\.)/, '.'));
    }

    public static parseDate(dateString: string) {
        let parts = dateString.split('/').map(c => parseInt(c));
        return new Date(parts[2], parts[1] - 1, parts[0])
    }

    public static createLabel(property: string): string {
        if (!property || property == property.toUpperCase()) return property;

        if (ConstantHelper.LABELS.containsKey(property))
            return ConstantHelper.LABELS[property];
        if (property.endsWith('Id')) {
            let propertyName = property.replace('Id', '');
            if (ConstantHelper.LABELS.containsKey(propertyName))
                return ConstantHelper.LABELS[propertyName];
        }

        let result: string = '',
            label = property.substr(0, 1).toUpperCase() + property.substr(1);
        for (let i = 0; i < label.length; i++) {
            let character = label[i],
                characterNext = i < label.length - 1 ? label[i + 1] : '';
            if (i == 0) result += character;
            else if (character == character.toUpperCase()) {
                if (!characterNext) result += character;
                else if (characterNext == characterNext.toUpperCase()) {
                    result += character;
                } else result += ' ' + character;
            } else {
                if (!characterNext) result += character;
                else if (characterNext == characterNext.toUpperCase()) {
                    result += character + ' ';
                } else result += character;
            }
        }
        result = result.replace('_', '').replace('  ', ' ');
        return result;
    }

    public static createShortName(name: string): string {
        if (!name) return name;
        let names = name.trim().split(' ');
        if (names.length >= 2) {
            return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
        } else {
            if (name.length >= 2) return name.substr(0, 2).toUpperCase();
            else return name.toUpperCase();
        }
    }

    public static getFileName(path: string): string {
        if (!path) return null;
        let names = path.trim().split('/');
        if (names.length > 0) {
            return names[names.length - 1].toLowerCase();
        }
        return path;
    }

    public static trimChar(text: string, charToRemove: string) {
        if (text && charToRemove) {
            while (text.charAt(0) == charToRemove) {
                text = text.substring(1);
            }
            while (text.charAt(text.length - 1) == charToRemove) {
                text = text.substring(0, text.length - 1);
            }
        }
        return text;
    }

    public static trimChars(text: string, charToRemoves: string[]) {
        if (text && charToRemoves) {
            charToRemoves.forEach((charToRemove: string) => {
                text = this.trimChar(text, charToRemove);
            });
            charToRemoves.forEach((charToRemove: string) => {
                text = this.trimChar(text, charToRemove);
            });
        }
        return text;
    }

    public static join(texts: string[], separator: string = ', ') {
        if (separator && texts && texts.length > 0) {
            let result: string = '';
            texts.forEach((text: string) => {
                if (text) result += text + separator;
            });
            return this.trimChars(result, [' ', separator.trim()]);
        }
        return null;
    }

    public static formatText(text: string, status: StatusType) {
        switch (status) {
            case StatusType.Success:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--success\">' + text + '</span>';
            case StatusType.Warning:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--warning\">' + text + '</span>';
            case StatusType.Error:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--danger\">' + text + '</span>';
        }
    }

    public static formatArticleAccess(access: MLArticleAccessType, approved: boolean, isDownByAdmin: boolean) {
        switch (access) {
            case MLArticleAccessType.Rejected: return 'Tin từ chối duyệt';
            case MLArticleAccessType.Publish: return approved ? 'Tin đang đăng' : 'Tin chờ duyệt';
            case MLArticleAccessType.WaitPayment: return isDownByAdmin ? 'Tin bị hạ' : 'Tin chờ thanh toán';
            case MLArticleAccessType.UnPublish: return isDownByAdmin ? 'Tin bị hạ' : 'Tin hết hạn';
            case MLArticleAccessType.Draft: return 'Tin nháp';
            case MLArticleAccessType.Deleted: return 'Tin đã xóa';
            case MLArticleAccessType.WaitPublish: return 'Tin chờ đăng';
        }
    }

    public static formatArticleStatus(status: MLArticleStatusType) {
        let item = ConstantHelper.ML_ARTICLE_STATUS_TYPES.find(c => c.value == status);
        return item && item.label;
    }

    public static scrollToPosition(element: any = null, position: number = 0) {
        if (!element) $('body,html').animate({ scrollTop: position });
        else if (typeof element == 'string') {
            $(element).animate({ scrollTop: position });
        } else $(element).animate({ scrollTop: position });
    }

    public static formatNumbertoString(val: any): any {
        if (!val) return '0'
        try {
            val = val.toString();
            val = val.replaceAll(',', '')
            val = val.replaceAll('.', '')
            if (val.toString().length > 15) {
                let num = BigInt(val)
                if (!isNaN(Number(num))) {
                    let value = num.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                    return value
                }
            } else {
                if (!isNaN(parseInt(val))) {
                    let value = parseInt(val).toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                    return value
                }
            }
        } catch (ex) {

        }
        return ''
    }

    public static formatStringtoNumber(val: any): any {
        if (typeof val == 'number') return val;
        try {
            val = val.toString();
            val = val.replaceAll('.', '')
            val = val.replaceAll(',', '.')
            if (val.toString().length > 15) {
                let num = BigInt(val)
                if (!isNaN(Number(num))) {
                    return num
                }
            }
            else {
                if (!isNaN(Number(val))) {
                    return Number(val)
                }
            }
        } catch { }
        return null
    }

    public static createDefaultTime() {
        return {
            day: 'Chọn giờ đẩy tin',
            timeOthers: UtilityExHelper.createTimes([6, 7, 12, 15, 16, 17, 18, 19], false),
            timeGolds: UtilityExHelper.createTimes([8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23], true),
        }
    }
    public static createTimes(hours: number[], gold: boolean, selectedTime?: MLArticlePushTime) {
        let times: OptionItem[] = [];
        hours.forEach((hour: number) => {
            if (hour == 12) {
                if (gold) {
                    times.push({
                        label: '12:00',
                        value: '12:00',
                        selected: selectedTime && selectedTime.Times.indexOf('12:00') >= 0 || false,
                    });
                } else {
                    times.push({
                        label: '12:30',
                        value: '12:30',
                        selected: selectedTime && selectedTime.Times.indexOf('12:30') >= 0 || false,
                    });
                }
            } else if (hour == 15) {
                if (gold) {
                    times.push({
                        label: '15:00',
                        value: '15:00',
                        selected: selectedTime && selectedTime.Times.indexOf('15:30') >= 0 || false,
                    });
                } else {
                    times.push({
                        label: '15:30',
                        value: '15:30',
                        selected: selectedTime && selectedTime.Times.indexOf('15:30') >= 0 || false,
                    });
                }
            } else {
                let time = hour < 10 ? '0' + hour.toString() : hour.toString();
                times.push({
                    label: time + ':00',
                    value: time + ':00',
                    selected: selectedTime && selectedTime.Times.indexOf(time + ':00') >= 0 || false,
                });
                times.push({
                    label: time + ':30',
                    value: time + ':30',
                    selected: selectedTime && selectedTime.Times.indexOf(time + ':30') >= 0 || false,
                });
            }
        });
        return times;
    }

    public static calculatePromotionPercentage(amount: number) {
        let bonusPercent = 0;
        if (amount < 500000) return bonusPercent;
        if (amount >= 500000 && amount < 3000000) {
            bonusPercent = 0.1;
        }
        else if (amount >= 3000000 && amount < 7000000) {
            bonusPercent = 0.15;

        }
        else if (amount >= 7000000 && amount < 20000000) {
            bonusPercent = 0.2;
        }
        else if (amount >= 20000000 && amount < 50000000) {
            bonusPercent = 0.25;
        }
        else if (amount >= 50000000 && amount < 100000000) {
            bonusPercent = 0.3;
        }
        else if (amount >= 100000000 && amount < 200000000) {
            bonusPercent = 0.35;
        }
        else if (amount >= 200000000 && amount < 1000000000) {
            bonusPercent = 0.4;
        }
        else {
            bonusPercent = 0.5;
        }
        return bonusPercent;
    }

    public static ChangeToSlug(title: string) {
        let slug;
        title = title || ""
        //Đổi chữ hoa thành chữ thường
        slug = title.toLowerCase();

        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
        slug = slug.replace(/đ/gi, "d");
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|\[|\]|\{|\}|\“|\”|_|’|–|‘/gi, "");
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, "-");
        slug = slug.replace(/\-\-\-\-/gi, "-");
        slug = slug.replace(/\-\-\-/gi, "-");
        slug = slug.replace(/\-\-/gi, "-");
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = "@" + slug + "@";
        slug = slug.replace(/\@\-|\-\@|\@/gi, "");
        //In slug ra textbox có id “slug”
        return slug;
    }

    public static FormatUnitArea(value: any): string {
        let number = Number(value);
        return number >= 10000
            ? ' ha'
            : ' m2';
    }
    public static FormatUnitPrice(value: any): string {
        let number = Number(value);
        return number >= 1000000
            ? ' tỷ'
            : number >= 1000
                ? ' triệu'
                : ' nghìn';
    }
    public static FormatNumberArea(value: any): string {
        let number = Number(value);
        let result = number >= 10000
            ? number / 10000
            : number;
        result = Math.round(result * 100) / 100;
        return result.toLocaleString('vi-VN');
    }
    public static FormatNumberPrice(value: any): string {
        let number = Number(value);
        let result = number >= 1000000
            ? number / 1000000
            : number >= 1000
                ? number / 1000
                : number;
        result = Math.round(result * 100) / 100;
        return result.toLocaleString('vi-VN');
    }


    public static GetHashtags(text): any[] {
        var regexes$1 = UtilityExHelper.getRegexListType()
        if (!text || !text.match(regexes$1.hashSigns)) {
            return [];
        }
        var tags = [];
        function replacer(match, before, hash, hashText, offset, chunk) {
            var after = chunk.slice(offset + match.length);
            if (after.match(regexes$1.endHashtagMatch)) {
                return '';
            }
            var startPosition = offset + before.length;
            var endPosition = startPosition + hashText.length + 1;
            tags.push({
                hashtag: hashText,
                indices: [startPosition, endPosition]
            });
            return '';
        }
        text.replace(regexes$1.validHashtag, replacer);
        return tags;
    }
    public static getRegexListType() {
        var unicodeLettersAndMarks = /A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D/.source;
        var unicodeNumbers = /0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19/.source;
        var hashtagSpecialChars = /_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7/.source; // Twitter considers a valid hashtag to be one that contains at least one:
        // - unicode letter or mark
        // - numbers, underscores, and select special characters
        var regexes = new RegexListType;
        regexes.hashSigns = /[##]/;
        regexes.hashtagAlpha = new RegExp('[' + unicodeLettersAndMarks + ']');
        regexes.hashtagAlphaNumeric = new RegExp('[' + unicodeLettersAndMarks + unicodeNumbers + hashtagSpecialChars + ']');
        regexes.endHashtagMatch = UtilityExHelper.regexSupplant(/^(?:#{hashSigns}|:\/\/)/, regexes);
        regexes.hashtagBoundary = new RegExp('(?:^|$|[^&' + unicodeLettersAndMarks + unicodeNumbers + hashtagSpecialChars + '])');
        regexes.validHashtag = UtilityExHelper.regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(?!\ufe0f|\u20e3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi, regexes); // A function that composes regexes together

        return regexes;
    }
    public static regexSupplant(regex, regexes, flags = '') {
        flags = flags || '';
        var regExpString;
        if (typeof regex !== 'string') {
            if (regex.global && flags.indexOf('g') < 0) {
                flags += 'g';
            }
            if (regex.ignoreCase && flags.indexOf('i') < 0) {
                flags += 'i';
            }
            if (regex.multiline && flags.indexOf('m') < 0) {
                flags += 'm';
            }
            regExpString = regex.source;
        } else {
            regExpString = regex;
        }
        return new RegExp(regExpString.replace(/#\{(\w+)\}/g, function (match, name) {
            var newRegex = regexes[name] || '';
            if (typeof newRegex !== 'string') {
                return newRegex.source;
            }
            return newRegex;
        }), flags);
    }

    public static dateTimeToString(date: Date, format: string = DateTimeFormat.DMYHMS): string {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);
        if (date.getFullYear() == 0) return '';
        if (date.getFullYear() == 1) return '';
        let message = '';
        let month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        message += ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        message += ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        if (format == DateTimeFormat.DMYHMS) {
            message += ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        }
        return message;
    }

    public static createDialogDataArchive(title, obj, objectExtra, confirmText = 'Chọn', cancelText = 'Đóng', size = ModalSizeType.ExtraLarge) {
        let dialogArchive: DialogData = {
            object: obj,
            title: title,
            cancelText: cancelText,
            confirmText: confirmText,
            size: size,
            objectExtra: objectExtra,
        }
        return dialogArchive;
    }

    public static activeDragable(id: any) {
        setTimeout(() => {
            $('#' + id).draggabilly({
                handle: '.modal-header'
            }).on('dragStart', () => {
                this.clearSelectElement();
            });
        }, 100);
    }

    public static clearSelectElement() {
        Coloris.close();
        $('body>.daterangepicker').remove();
        $('body>.select2-container--open').remove();
        setTimeout(() => {
            $('.select2-container--open').removeClass('select2-container--open');
        }, 100);
    }
}
