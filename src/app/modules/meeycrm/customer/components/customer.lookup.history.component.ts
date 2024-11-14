import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MMLookupHistoryEntity } from '../../../../_core/domains/entities/meeymap/mm.lookup.history.entity';
import { MLPopupViewUserComponent } from '../../../../modules/meeyuser/popup.view.user/popup.view.user.component';
import { MMLookupQuickViewComponent } from '../../../../modules/meeymap/lookup.quickview/lookup.quickview.component';

@Component({
    selector: 'mcrm-customer-lookup-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerLookHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HideSearch: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MMLookupHistoryEntity,
    };
    @Input() id: number;

    constructor() {
        super();
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MMLookupHistory/ItemsByCustomer/' + this.id;
        }

        // columns
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            {
                Property: 'Name', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
                }
            },
            { Property: 'Address', Title: 'Đia chỉ thửa đất đã tra cứu', Type: DataType.String },
            { Property: 'Report', Title: 'Báo cáo sai phạm', Type: DataType.String },
            {
                Property: 'Layers', Title: 'Xem bản đồ', Type: DataType.String,
                Format: (item: any) => {
                    return '<a>' + item.Layers + '</a>';
                },
                Click: (item: any) => {
                    this.quickViewMap(item);
                }
            },
            { Property: 'LookupDate', Title: 'Thời gian tra cứu', Type: DataType.DateTime },
            {
                Property: 'User', Title: 'NVCS', Type: DataType.String,
                Format: (item: any) => {
                    return '<p>' + (item.User || 'Chưa gán') + '</p>';
                }
            },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/mmlookuphistory',
        };
        this.router.navigate(['/admin/mmlookuphistory/view'], { state: { params: JSON.stringify(obj) } });
    }

    quickViewMap(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.FullScreen,
            object: MMLookupQuickViewComponent,
            title: 'Thông tin quy hoạch sử dụng đất',
            objectExtra: { id: item.Id, popup: true }
        });
    }

    quickView(item: any, type: string) {
        if (!type || type == 'user') {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                size: ModalSizeType.Large,
                object: MLPopupViewUserComponent,
                title: 'Xem thông tin người dùng',
                objectExtra: { meeyId: item.MeeyUserId }
            });
        }
    }
}