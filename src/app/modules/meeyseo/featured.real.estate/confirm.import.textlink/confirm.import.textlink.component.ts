import { MSSeoService } from '../../seo.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSAlertImportTagComponent } from '../alert.import.textlink/alert.import.textlink.component';

@Component({
    templateUrl: './confirm.import.textlink.component.html',
    styleUrls: ['./confirm.import.textlink.component.scss'],
})
export class MSConfirmImportTextLinkTagComponent implements OnInit {
    items: any[];
    type: number;
    valid: number;
    error: number;
    total: number;
    disabled: boolean;
    @Input() params: any;
    service: MSSeoService;
    event: AdminEventService;
    dialog: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(MSSeoService);
        this.event = AppInjector.get(AdminEventService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.params) {
            this.type = this.params['type'];
            this.items = this.params['items'];
            this.valid = this.params['valid'] || 0;
            this.error = this.params['error'] || 0;
            this.total = this.valid + this.error;
        }
        let items = this.items.filter(c => c.hasError);
        if (items && items.length > 0) this.disabled = true;
    }

    async confirm() {
        let datas = [];
        let items = this.items.filter(c => !c.hasError).map(c => {
            return {
                url: c.url,
                name: c.name,
                index: c.index,
            }
        });
        datas.push(...items);
        let data = {
            "data": datas,
        };
        if (items && items.length > 0) {
            // call api
            return await this.service.callApi('MSSeo', 'MSImport/' + this.type, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Import ' + result.Object?.totalSuccess + ' tag thành công');
                    this.event.RefreshGrids.emit();
                    this.dialog.HideAllDialog();
                    setTimeout(() => {
                        this.dialog.WapperAsync({
                            cancelText: 'Hủy',
                            objectExtra: {
                                items: result.Object?.data,
                                success: result.Object?.totalSuccess,
                                error: result.Object?.totalError,
                            },
                            confirmText: 'Export',
                            title: 'Thông báo import',
                            size: ModalSizeType.ExtraLarge,
                            object: MSAlertImportTagComponent,
                        });
                    }, 300);
                    return true;
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