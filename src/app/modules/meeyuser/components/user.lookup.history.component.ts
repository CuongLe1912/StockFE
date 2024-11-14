import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLPopupViewUserComponent } from '../../meeyuser/popup.view.user/popup.view.user.component';
import { MMLookupQuickViewComponent } from '../../meeymap/lookup.quickview/lookup.quickview.component';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';

@Component({
    selector: 'ml-user-lookup-history',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserLookupHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
        Reference: MMLookupHistoryEntity,
        Title: 'Tra cứu lịch sử giao dịch',
        SearchText: 'Nhập tên, email, số điện thoại',
        CustomFilters: ['Address', 'UserId', 'LookupDate'],
    };
    @Input() item: MLUserEntity;

    constructor() {
        super();
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
            // {
            //     Property: 'User', Title: 'Tình trạng chăm sóc', Type: DataType.String,
            //     Format: (item: any) => {
            //         let text: string = '';
            //         text += '<p>NVCS: ' + (item.User || 'Chưa gán') + '</p>';
            //         if (item.Status != null) {
            //             let lookup = ConstantHelper.MM_LOOKUP_HISTORY_STATUS_TYPES.find(c => c.value == item.Status);
            //             if (lookup) text += '<p class="' + lookup.color + '">' + lookup.label + '</p>';
            //         }
            //         return text;
            //     }
            // },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.setPageSize(20);
        this.obj.Url = '/admin/MMLookupHistory/Items/' + this.item.Id;
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