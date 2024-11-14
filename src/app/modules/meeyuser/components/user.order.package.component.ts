import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MMOrderPackageEntity } from '../../../_core/domains/entities/meeymap/mm.order.package.entity';

@Component({
    selector: 'ml-user-order-package',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserOrderPackageComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        SearchText: 'Tìm kiếm...',
        Title: 'Chi tiết gói ngày',
        PageSizes: [10, 20, 50, 100],
        Size: ModalSizeType.ExtraLarge,
        Reference: MMOrderPackageEntity,
    };
    @Input() item: MLUserEntity;

    constructor() {
        super();
        this.properties = [
            { Property: 'Action', Title: 'Hành động', Type: DataType.String, Align: 'center' },
            { Property: 'CreatedAt', Title: 'Thời gian', Type: DataType.DateTime, PipeType: PipeType.DateTime, Align: 'center' },
            {
                Property: 'OrderCode', Title: 'Mã đơn hàng', Type: DataType.String, Align: 'center', Click: (obj: any) => {
                    this.viewService(obj.OrderId);
                },
            },
            { Property: 'OrderService', Title: 'Dịch vụ đơn hàng', Type: DataType.String },
            { Property: 'StartTime', Title: 'Thời điểm bắt đầu hiệu lực', Type: DataType.DateTime, PipeType: PipeType.DateTime, Align: 'center' },
            { Property: 'EndTime', Title: 'Thời điểm hết hiệu lực', Type: DataType.DateTime, PipeType: PipeType.DateTime, Align: 'center' },
        ];
    }

    async ngOnInit() {
        this.obj.Url = '/admin/MMLookupHistory/OrderPackages/' + this.item.MeeyId;
        this.render(this.obj);
    }

    viewService(id: string) {
        if (id) {
            let obj: NavigationStateData = {
                prevUrl: '/admin/moorders',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/moorders/view-detail?id=' + id;
            this.setUrlState(obj, 'moorders');
            window.open(url, "_blank");
        } else this.dialogService.Alert('Thông báo', 'Mã dịch vụ không tồn tại, vui lòng thử lại sau');
    }

    private setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}