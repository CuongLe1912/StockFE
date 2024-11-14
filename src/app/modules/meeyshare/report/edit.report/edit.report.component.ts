import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { EditReportStatusComponent } from '../edit.report.status/edit.report.status.component';
import { MeeyShareReportEntity } from '../../../../_core/domains/entities/meeyshare/ms.report.entity';
import { MShareReportStatusType } from '../../../../_core/domains/entities/meeyshare/enums/ms.status.type';

@Component({
    templateUrl: './edit.report.component.html',
    styleUrls: [
        './edit.report.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditReportComponent extends EditComponent implements OnInit {
    id: number;
    @Input() params: any;
    allowProcess: boolean;
    viewer: boolean = true;
    loading: boolean = true;
    event: AdminEventService;
    item: MeeyShareReportEntity;
    MShareReportStatusType = MShareReportStatusType;

    constructor() {
        super();
        this.state = this.getUrlState();
        this.event = AppInjector.get(AdminEventService);
        this.event.ConfirmProcessReport.subscribe(async () => {
            await this.loadItem();
        })
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        this.addBreadcrumb(this.id ? 'Sửa bài viết' : 'Thêm mới bài viết');

        // fix breadcrumbs
        this.breadcrumbs = [];
        this.addBreadcrumb("Meey Share");
        this.breadcrumbs.push({ Name: "Báo xấu bài đăng", Link: '/admin/meeyshare/report' });
        this.addBreadcrumb('Chi tiết báo xấu tin tức');

        // load item
        this.allowProcess = await this.authen.permissionAllow('MeeyShareReport', ActionType.Process);
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    popupProcess() {
        this.dialogService.WapperAsync({
            title: 'Xử lý báo xấu tin tức',
            object: EditReportStatusComponent,
            objectExtra: {
                id: this.id
            },
            cancelText: 'Đóng',
            confirmText: 'Đồng ý',
            size: ModalSizeType.Medium,
        });
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('meeyShareReport', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeeyShareReportEntity, result.Object as MeeyShareReportEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MeeyShareReportEntity();
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];
        this.actions = await this.authen.actionsAllow(MeeyShareReportEntity, actions);
    }
}