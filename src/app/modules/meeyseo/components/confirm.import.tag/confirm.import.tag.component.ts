import { MSSeoService } from '../../seo.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSAlertImportTagComponent } from '../alert.import.tag/alert.import.tag.component';

@Component({
    templateUrl: './confirm.import.tag.component.html',
    styleUrls: ['./confirm.import.tag.component.scss'],
})
export class MSConfirmImportTagComponent implements OnInit {
    items: any[];
    type: number;
    valid: number;
    error: number;
    total: number;
    fileId: string;
    disabled: boolean;
    @Input() params: any;
    service: MSSeoService;
    event: AdminEventService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(MSSeoService);
        this.event = AppInjector.get(AdminEventService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.params) {
            this.items = this.params['items'];
            this.fileId = this.params['fileId'];
            this.type = this.params['type'] || 1;
            this.valid = this.params['valid'] || 0;
            this.error = this.params['error'] || 0;
            this.total = this.valid + this.error;
        }
        let items = this.items.filter(c => c.hasError);
        if (items && items.length > 0) this.disabled = true;
    }

    async confirm() {
        let datas: any;
        let items: any;
        let data = {};
        if (this.type == 2) {
            items = this.items.filter(c => !c.hasError).map(c => {
                return {
                    url: c.url,
                    name: c.name,
                    index: c.stt,
                }
            });
            //datas.push(...items);
            data = {
                "data": items,
            };
        } else {
            items = this.items.filter(c => !c.hasError);
            data = {
                "adminUserId": this.authen.account.Id,
                "fileId": this.fileId,
            };
        }

        if (items && items.length > 0) {
            // call api
            return await this.service.callApi('MSSeo', 'MSImport/' + this.type, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.event.RefreshGrids.emit();
                    if (this.type == 2) {
                        ToastrHelper.Success('Import ' + result.Object?.totalSuccess + ' tag thành công');
                        this.dialog.HideAllDialog();
                        setTimeout(() => {
                            this.dialog.WapperAsync({
                                cancelText: 'Hủy',
                                objectExtra: {
                                    items: result.Object?.data,
                                    success: result.Object?.valid,
                                    error: result.Object?.error,
                                },
                                confirmText: 'Export',
                                title: 'Thông báo import',
                                size: ModalSizeType.ExtraLarge,
                                object: MSAlertImportTagComponent,
                            });
                        }, 300);
                        return true;
                    } else {
                        ToastrHelper.Success('Import tệp thành công <br />Vui lòng chuyển sang màn hình Danh sách tag chờ duyệt để xem kết quả');
                        this.event.RefreshGrids.emit({ Name: 'MSSeoFileEntity' });
                        return true;
                    }
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        } else {
            ToastrHelper.Error('Tất cả các tags đều không hợp lệ');
        }
        return false;
    }
}