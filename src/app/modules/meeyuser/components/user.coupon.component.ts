import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MCCouponType } from '../../../_core/domains/entities/meeycoupon/enums/coupon.type';
import { MLUserEntity, MLUserHistoryEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';

@Component({
    selector: 'ml-user-coupon',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserCouponComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLUserHistoryEntity,
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
    };
    @Input() params: any;
    @Input() meeyId: string;
    @Input() item: MLUserEntity;

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'Name', Title: 'Tên coupon', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'Code', Title: 'Mã coupon', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'ReceivedDate', Title: 'Ngày nhận', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'UsedDate', Title: 'Ngày dùng', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'Total', Title: 'Tổng số coupon', Type: DataType.Number, Align: 'center', DisableOrder: true, },
            { Property: 'TotalUsed', Title: 'Đã dùng', Type: DataType.Number, Align: 'center', DisableOrder: true, },
            { Property: 'DateEnd', Title: 'Hạn dùng', Type: DataType.String, Align: 'center', DisableOrder: true, },
            {
                Property: 'DiscountRate', Title: 'Mức khuyến mãi', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let text = '<p>' + item.DiscountRate + '</p>';
                    if (item.Type == MCCouponType.AddMoneyAccount) text += '<p>TKKM2</p>';
                    return text;
                }
            },
        ];
    }

    async ngOnInit() {
        if (!this.item) {
            this.item = this.params && this.params['item'];
        }
        this.setPageSize(20);
        this.obj.Url = '/admin/MLUser/Coupons/' + this.item.MeeyId;
        this.render(this.obj);
    }
}