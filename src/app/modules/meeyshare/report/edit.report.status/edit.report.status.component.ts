import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MeeyShareReportEntity } from '../../../../_core/domains/entities/meeyshare/ms.report.entity';
import { MShareReportStatusType } from '../../../../_core/domains/entities/meeyshare/enums/ms.status.type';

@Component({
    templateUrl: './edit.report.status.component.html',
    styleUrls: [
        './edit.report.status.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditReportStatusComponent implements OnInit {
    id: string;
    @Input() params: any;
    loading: boolean = true;
    event: AdminEventService;
    authen: AdminAuthService;
    service: AdminApiService;
    dialog: AdminDialogService;
    item: MeeyShareReportEntity;

    constructor() {
        this.event = AppInjector.get(AdminEventService);
        this.service = AppInjector.get(AdminApiService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.id = this.params && this.params['id'];
        this.item = new MeeyShareReportEntity();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item, ['ProcessStatus', 'ProcessNote']);
            if (valid) {
                let data = {
                    "note": this.item.ProcessNote,
                    "status": this.item.ProcessStatus,
                    "author": {
                        "data": {
                            "id": this.authen.account.Id,
                            "fullname": this.authen.account.FullName
                        }
                    }
                };

                let status = this.item.ProcessStatus == MShareReportStatusType.Cancel
                    ? 'Hạ bài đăng'
                    : 'Không xử lý';
                let message = 'Bạn có đồng ý xử lý báo cáo tin xấu này với hình thức <b>' + status + '</b> không';
                this.dialog.ConfirmAsync(message, async () => {
                    return await this.service.callApiByUrl('meeyShareReport/update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Xử lý báo cáo tin xấu thành công');
                            this.event.ConfirmProcessReport.emit();
                            this.dialog.HideAllDialog();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        return false;
                    });
                });
            }
        }
        return false;
    }
}