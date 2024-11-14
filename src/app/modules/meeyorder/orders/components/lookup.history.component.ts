import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MOOrderLookupQuickViewComponent } from './lookup.quickview/lookup.quickview.component';
import { MMLookupHistoryEntity } from '../../../../_core/domains/entities/meeymap/mm.lookup.history.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOOrderLookupHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HideHeadActions: true,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        PageSizes: [20, 50, 100],
        Size: ModalSizeType.ExtraLarge,
        Reference: MMLookupHistoryEntity,
        Title: 'Tra cứu lịch sử quy hoạch',
        SearchText: 'Nhập tên, email, số điện thoại',
    };

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
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, false);
                }
            },
            { Property: 'Address', Title: 'Đia chỉ thửa đất đã tra cứu', Type: DataType.String },
            { Property: 'ZoneType', Title: 'Loại quy hoạch', Type: DataType.String },
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
                Property: 'User', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    text += '<p>Sale: ' + UtilityExHelper.escapeHtml(item.Sale) + '</p>';
                    text += '<p>CSKH: ' + UtilityExHelper.escapeHtml(item.Support) + '</p>';
                    return text;
                }
            },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        let userId = this.getParam('userId'),
            endTime = this.getParam('endTime'),
            startTime = this.getParam('startTime');
        this.setFilter([{
            Value2: endTime,
            Value: startTime,
            Name: 'LookupDate',
            Compare: CompareType.D_Between,
        }]);
        this.itemData.Search = userId;
        await this.render(this.obj);
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
        this.dialogService.WapperAboveAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.FullScreen,
            object: MOOrderLookupQuickViewComponent,
            title: 'Thông tin quy hoạch sử dụng đất',
            objectExtra: { id: item.Id, popup: true }
        });
    }
}