import { MessageHelper } from "./message.helper";
import { ResultApi } from "../domains/data/result.api";

declare var toastr: any;
export class ToastrHelper {
    public static Exception(ex: any, title: string = 'Lỗi', timeout: number = 8000, onclick: any = null) {
        let description = MessageHelper.SystemWrong;
        if (ex && ex.error) {
            if (typeof ex.error == 'string')
                description = ex.error;
            else if (ex.error && ex.error.error)
                description = ex.error.error;
        }
        toastr.options = { timeOut: timeout, onclick: onclick };
        if (description) toastr.error(description, title);
    }
    public static Error(message: string, title: string = 'Lỗi', timeout: number = 8000, onclick: any = null) {
        toastr.options = { timeOut: timeout, onclick: onclick };
        if (message && message.indexOf('object') >= 0) {
            ToastrHelper.Error('Lỗi hệ thống, vui lòng liên hệ Admin', title);
            return;
        }
        if (message) toastr.error(message, title);
    }
    public static Success(message?: string, title: string = 'Thành công', timeout: number = 8000, onclick: any = null) {
        message = message || 'Lưu dữ liệu thành công';
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.success(message, title);
    }
    public static Warning(message: string, title: string = 'Cảnh báo', timeout: number = 8000, onclick: any = null) {
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.warning(message, title);
    }
    public static ErrorResult(result: ResultApi, title: string = 'Lỗi', timeout: number = 8000, onclick: any = null) {
        let message = result && result.Description && result.Description.toString();
        if (message && message.indexOf('TypeError: You provided') >= 0)
            return;
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.error(message || MessageHelper.SystemWrong, title);
    }
}