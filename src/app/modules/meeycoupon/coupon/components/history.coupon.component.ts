import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MCCouponEntity } from '../../../../_core/domains/entities/meeycoupon/mc.coupon.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCCouponHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MCCouponEntity,
        Size: ModalSizeType.ExtraLarge,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, DisableOrder: true },
            { Property: 'GivingTime', Title: 'Thời gian tặng', Type: DataType.String, DisableOrder: true, },
            { Property: 'UserMeeyId', Title: 'Người nhận', Type: DataType.String, DisableOrder: true },
            {
                Property: 'StatusUsed', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = item.StatusUsed
                                ? '<p style="color: #55B88B;">Đã Dùng</p>' 
                                : '<p style="color: #FF6D64;">Chưa Dùng</p>' ;
                    return text;
                }
            },
            { Property: 'TypeCoupon', Title: 'Loại coupon', Type: DataType.String, DisableOrder: true, },
            { Property: 'DiscountRate', Title: 'Số tiền giảm', Type: DataType.String, DisableOrder: true, },
            { Property: 'ExpiryDate', Title: 'Hạn Sử dụng', Type: DataType.String, DisableOrder: true, }
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/MCCoupon/Histories/' + id;
        this.render(this.obj);
    }
}