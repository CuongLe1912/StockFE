import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrHelper } from '../helpers/toastr.helper';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AdminAuthService } from '../services/admin.auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public authen: AdminAuthService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(),
            catchError((err: any) => {
                let message = '';
                switch (err.status) {
                    case 401:
                        if (this.authen.account) {
                            ToastrHelper.Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                            this.authen.logout();
                            return;
                        }
                        break;
                    case 404:
                        message = 'Không tìm thấy dữ liệu';
                        if (err?.error?.message) {
                            message = err.error.message;
                        }
                        ToastrHelper.Error(message);
                        return;
                    case 500:
                    case 514:
                        ToastrHelper.Error('Lỗi hệ thống, vui lòng liên hệ Admin');
                        console.log(err);
                        break;
                    case 400:
                        message = 'Thông tin truy vấn không tồn tại, vui lòng thử lại';
                        if (err?.error?.message) {
                            message = err.error.message;
                        }
                        ToastrHelper.Error(message);
                        return;
                }
                return throwError(err);
            }));
    }
}
