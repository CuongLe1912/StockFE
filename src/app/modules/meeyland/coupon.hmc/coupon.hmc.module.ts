import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { MLCouponHmcService } from "./coupon.hmc.service";
import { UtilityModule } from "../../../modules/utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLCouponHMCEntity } from "../../../_core/domains/entities/meeyland/ml.coupon.hmc.entity";
import { MLCouponHMCStatusType } from "../../../_core/domains/entities/meeyland/enums/ml.coupon.hmc.status.type";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLCouponHMCComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-book',
                className: 'btn btn-warning',
                name: ActionType.OpenCouponHmc,
                systemName: ActionType.OpenCouponHmc,
                hidden: ((item: MLCouponHMCEntity) => {
                    return item.Status != MLCouponHMCStatusType.Processing;
                }),
                click: ((item: MLCouponHMCEntity) => {
                    let coupon = '<p style="margin: 0">Số Seri: ' + item.Serial + '</p><p>Mã nạp: ' + item.Code + '</p>';
                    this.dialogService.ConfirmAsync('<p>Có phải bạn muốn <b>Mở lại Coupon</b>?</p>' + coupon, async () => {
                        await this.apiService.reOpen(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                this.loadItems();
                                ToastrHelper.Success('Mở lại Coupon thành công');
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-bolt',
                className: 'btn btn-success',
                name: ActionType.ProcessTransaction,
                systemName: ActionType.ProcessTransaction,
                hidden: ((item: MLCouponHMCEntity) => {
                    return item.Status != MLCouponHMCStatusType.Processing;
                }),
                click: ((item: MLCouponHMCEntity) => {
                    let coupon = '<p style="margin: 0">Số Seri: ' + item.Serial + '</p><p>Mã nạp: ' + item.Code + '</p>';
                    this.dialogService.ConfirmAsync('<p>Có phải bạn muốn <b>Xử lý giao dịch</b>?</p>' + coupon, async () => {
                        await this.apiService.process(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                this.loadItems();
                                ToastrHelper.Success('Xử lý giao dịch thành công');
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            }
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        Title: 'Coupon HMC',
        SearchText: 'Nhập Seri',
        Reference: MLCouponHMCEntity,
        PageSizes: [5, 10, 20, 50, 100],
        Size: ModalSizeType.ExtraLarge,
    };

    constructor(public apiService: MLCouponHmcService) {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            {
                Property: 'Coupon', Title: 'Coupon', Type: DataType.String,
                Format: (item: any) => {
                    return '<p>Số Seri: ' + item.Serial + '</p><p>Mã nạp: ' + item.Code + '</p>'
                }
            },
            { Property: 'Amount', Title: 'Số tiền (đ)', Type: DataType.Number, Align: 'right' },
            {
                Property: 'Owner', Title: 'Thông tin tặng (HMC)', Type: DataType.String,
                Format: (item: any) => {
                    return item['Owner'];
                }
            },
            { Property: 'IssuedDate', Title: 'Ngày tặng', Type: DataType.DateTime, Align: 'center' },
            {
                Property: 'StatusText', Title: 'Tình trạng', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let optionItem = ConstantHelper.ML_COUPON_HMC_STATUS_TYPES.find(c => c.value == item.Status);
                    if (optionItem) {
                        return '<p class="' + optionItem.color + '">' + optionItem.label + '</p>';
                    }
                }
            },
            {
                Property: 'Creator', Title: 'Người sử dụng (Meeyland)', Type: DataType.String,
                Format: (item: any) => {
                    return item['Creator'];
                }
            },
            { Property: 'UsedDate', Title: 'Ngày sử dụng', Type: DataType.DateTime, Align: 'center' },
            { Property: 'TransactionId', Title: 'Mã giao dịch', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        MLCouponHMCComponent,
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MLCouponHMCComponent, pathMatch: 'full', data: { state: 'ml_coupon_hmc' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLCouponHmcService]
})
export class MLCouponHMCModule { }