import { HttpEventType } from '@angular/common/http';
import { AppInjector } from '../../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { MeeyCrmService } from '../../../../meeycrm/meeycrm.service';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { ExportType } from '../../../../../_core/domains/enums/export.type';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { AdminEventService } from '../../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLEmployeeErrorImportSaleComponent } from './list.error.import.sale.company.component';

@Component({
    templateUrl: './confirm.import.sale.company.component.html',
    styleUrls: ['./confirm.import.sale.company.component.scss'],
})
export class MLEmployeeConfirmImportSaleComponent extends GridComponent implements OnInit {
    items: any[];
    type: number;
    valid: number;
    error: number;
    total: number;
    companyId: number;
    disabled: boolean;
    @Input() params: any;
    service: MeeyCrmService;
    event: AdminEventService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(MeeyCrmService);
        this.event = AppInjector.get(AdminEventService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.params) {
            if (this.params) {
                this.items = this.params['items'];
                this.valid = this.params['valid'] || 0;
                this.error = this.params['error'] || 0;
                this.total = this.valid + this.error;
                this.companyId = this.params['companyId'];
            }

        }
        let items = this.items.filter(c => c.Status == 1);
        if (!items || items.length == 0) {
            this.disabled = true;
        }
    }

    async export() {
        if (this.items && this.items.length > 0) {
            this.loading = true;
            let objData: any = this.items.filter(c => c.Status == 2).map(c => {
                return {
                    Name: c.Name,
                    Phone: c.Phone,
                    Email: c.Email,
                    Content: c.Content
                }

            });
            objData.Export = {
                Type: ExportType.Excel,
            }
            let urlExport = '/admin/MLEmployee/ExportData';
            let fileName = "Danh sách sale import lỗi_" + new Date().getTime();
            return await this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
                this.loading = false
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        break;
                    case HttpEventType.Response:
                        let extension = 'xlsx';
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = fileName + '.' + extension;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
                return true;
            }).catch(() => {
                this.loading = false;
            });
        }
        else {
            ToastrHelper.Error('Không có dữ liệu xuất excel');
        }
    }

    async confirm() {
        let items: any;
        items = this.items.filter(c => c.Status == 1).map(c => {
            return {
                Name: c.Name,
                Phone: c.Phone,
                Email: c.Email,
            }
        });
        if (items && items.length > 0) {
            // call api
            return await this.service.callApi('MLEmployee', 'ImportSalesData/' + this.companyId, items, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Import thành công ');
                    this.dialog.HideAllDialog();
                    if (result.Object) {
                        
                        this.dialog.Alert('Import thành công',
                            result.Object?.OpenNumber + ' Tài khoản mở mới</br>'
                            + result.Object?.InactiveNumber + ' Tài khoản được khôi phục</br>'
                            + result.Object?.InactionNumber + ' Tài khoản đang hoạt động được chuyển vào danh sách');
                        this.event.RefreshGrids.emit();
                        if (result.Object?.DataError && result.Object?.DataError.length > 0) {
                            setTimeout(() => {
                                this.dialog.WapperAboveAsync({
                                    cancelText: 'Đóng',
                                    title: 'Danh sách import không thành công',
                                    size: ModalSizeType.ExtraLarge,
                                    object: MLEmployeeErrorImportSaleComponent,
                                    objectExtra: { items: result.Object?.DataError },
                                });
                            }, 500);
                            return true;
                        }
                        
                    }
                }
                this.dialog.HideAllDialog();
                return true;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        } else {
            ToastrHelper.Error('Tất cả các bản ghi đều không hợp lệ');
        }
        return false;
    }
}