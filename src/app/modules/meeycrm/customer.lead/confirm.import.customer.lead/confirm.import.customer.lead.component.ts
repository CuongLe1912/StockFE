import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';

@Component({
    templateUrl: './confirm.import.customer.lead.component.html',
    styleUrls: ['./confirm.import.customer.lead.component.scss'],
})
export class MCRMConfirmImportCustomerLeadComponent implements OnInit {
    items: any[];
    type: number;
    valid: number;
    error: number;
    total: number;
    fileId: string;
    disabled: boolean;
    @Input() params: any;
    service: MeeyCrmService;
    event: AdminEventService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
        this.event = AppInjector.get(AdminEventService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.params) {
            this.items = this.params['items'];
            this.valid = this.params['valid'] || 0;
            this.error = this.params['error'] || 0;
            this.total = this.valid + this.error;
        }
        let items = this.items.filter(c =>c.Status == 1);
        if (!items || items.length == 0) this.disabled = true;
    }

    async confirm() {
        let items: any;
        let data = {};
        items = this.items.filter(c => c.Status == 1).map(c => {
            return {
                Name: c.Name,
                Phone: c.Phone,
                Email: c.Email,
                IdCard: c.IdCard,
                Status: c.Status,
                Gender: c.Gender,
                Address: c.Address,
                Birthday: c.Birthday,
                CustomerType: c.CustomerType,
            }
        });
        //datas.push(...items);
        if (this.items && this.items.length > 0) {
            // call api
            return await this.service.callApi('MCRMCustomerLead', 'MSImportData', items, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Import thành công');
                    this.event.RefreshGrids.emit();
                    this.dialog.HideAllDialog();
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                this.dialog.HideAllDialog();
                return false;
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