import { AppInjector } from "../../../../app.module";
import { MeeyCouponService } from "../../coupon.service";
import { MLUserService } from "../../../meeyuser/user.service";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { MCCouponHistoryComponent } from "./history.coupon.component";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { GoogleSigninService } from "../../../../google-signin.service";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MCCouponEntity } from "../../../../_core/domains/entities/meeycoupon/mc.coupon.entity";
import { MCCouponStatusType, MCCouponType, MCCouponUpdateStatusType } from "../../../../_core/domains/entities/meeycoupon/enums/coupon.type";

@Component({
    selector: 'mc-grid-coupon',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})

export class MCGridCouponComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [
            //ActionData.edit((item: any) => this.edit(item)),
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return !(item[ActionType.Edit] && (item.StatusPrev == MCCouponStatusType.Created || item.StatusPrev == MCCouponStatusType.Running
                        || item.StatusPrev == MCCouponStatusType.Expired || item.StatusPrev == MCCouponStatusType.OutOfMove
                        || item.StatusPrev == MCCouponStatusType.Pause));
                },
                click: (item: any) => {
                    this.edit(item);
                }
            },
            //Khóa
            {
                icon: 'la la-unlock',
                name: 'Khóa coupon',
                systemName: ActionType.Lock,
                className: 'btn btn-outline-warning',
                hidden: (item: any) => {
                    return !(item[ActionType.Lock] && (item.StatusPrev == MCCouponStatusType.Created || item.StatusPrev == MCCouponStatusType.Running
                        || item.StatusPrev == MCCouponStatusType.Expired || item.StatusPrev == MCCouponStatusType.OutOfMove
                        || item.StatusPrev == MCCouponStatusType.Pause))
                },
                click: (item: MCCouponEntity) => {
                    this.updateStatus(item, MCCouponUpdateStatusType.Lock);
                }
            },
            //Mở Khóa
            {
                icon: 'la la-unlock-alt',
                name: 'Mở khóa coupon',
                systemName: ActionType.UnLock,
                className: 'btn btn-outline-success',
                hidden: (item: any) => {
                    return !(item[ActionType.UnLock] && (item.StatusPrev == MCCouponStatusType.LockUp))
                },
                click: (item: MCCouponEntity) => {
                    this.updateStatus(item, MCCouponUpdateStatusType.Unlock);
                }
            },
            //Tạm dừng
            {
                icon: 'la la-pause',
                name: 'Tạm dừng coupon',
                systemName: ActionType.Pause,
                className: 'btn btn-outline-warning',
                hidden: (item: any) => {
                    return !(item[ActionType.Pause] && (item.StatusPrev == MCCouponStatusType.Running))
                },
                click: (item: MCCouponEntity) => {
                    this.updateStatus(item, MCCouponUpdateStatusType.Pause);
                }
            },
            //Chạy tiếp
            {
                icon: 'la la-step-forward',
                name: 'Chạy coupon',
                systemName: ActionType.Play,
                className: 'btn btn-outline-success',
                hidden: (item: any) => {
                    return !(item[ActionType.Play] && (item.StatusPrev == MCCouponStatusType.Pause))
                },
                click: (item: MCCouponEntity) => {
                    this.updateStatus(item, MCCouponUpdateStatusType.Unpause);
                }
            },
            //Lịch sử
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.History,
                className: 'btn btn-outline-secondary',
                click: ((item: MCCouponEntity) => {
                    this.history(item);
                })
            },
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        NotKeepPrevData: true,
        Size: ModalSizeType.Large,
        Reference: MCCouponEntity,
        SearchText: 'Tìm kiếm theo tên, mã coupon',
        CustomFilters: ["Type", "Status", "FilterDate"],
        Features: [
            ActionData.addNew(() => {
                this.addNew();
            }),
            ActionData.reload(() => {
                this.loadItems();
            }),
        ],
    };
    //allowViewDetail: boolean;
    userService: MLUserService;
    couponService: MeeyCouponService;
    userGoogle: gapi.auth2.GoogleUser;
    constructor(
        private ref: ChangeDetectorRef,
        private signInGoogle: GoogleSigninService) {
        super();
        this.couponService = AppInjector.get(MeeyCouponService);
        this.userService = AppInjector.get(MLUserService);
        this.signInGoogle.observable().subscribe(user => {
            this.userGoogle = user
            this.ref.detectChanges()
        });

        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'Name', Title: 'Tên Coupon', Type: DataType.String, Align: 'center', DisableOrder: true },
            {
                Property: 'Code', Title: 'Mã Coupon', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let text = '<p style="min-height: 25px; overflow: visible;"><a style="text-decoration: none !important;" data="' + item.Code + '" tooltip="Sao chép" flow="right"><i routerlink="copy" class="la la-copy"></i></a> ' + item.Code + '</p>'
                    return text;
                }
            },
            {
                Property: 'Status', Title: 'Trạng Thái', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    item['StatusPrev'] = item['Status'];
                    let option: OptionItem = ConstantHelper.MC_COUPON_STATUS_TYPES.find(c => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'TypeCoupon', Title: 'Loại Coupon', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let text = '<p>' + item.TypeCoupon.name + '</p>';
                    return text;
                }
            },
            {
                Property: 'DiscountRate', Title: 'Mức giảm', Type: DataType.String, Align: 'center', DisableOrder: true,
            },
            { Property: 'ApplicationDate', Title: 'Thời gian áp dụng', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'Limit', Title: 'Số lượng phát hành', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'LimitUsed', Title: 'Số lượng đã dùng', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'LimitAvaiable', Title: 'Số lượng khả dụng', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'TotalAmountDiscount', Title: 'Doanh thu tiêu dùng giảm', Type: DataType.String, Align: 'center', DisableOrder: true, },
        ];
    }
    async ngOnInit() {
        this.obj.Url = '/admin/MCCoupon/Items';
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async () => {
                await this.loadItems();
            });
        }
    }
    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/mccoupon',
        };
        this.router.navigate(['/admin/mccoupon/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/mccoupon',
        };
        this.router.navigate(['/admin/mccoupon/edit'], { state: { params: JSON.stringify(obj) } });
    }
    history(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Lịch sử coupon',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MCCouponHistoryComponent,
        });
    }

    async updateStatus(item: any, status: MCCouponUpdateStatusType) {
        var helper = ConstantHelper.MC_COUPON_UPDATE_STATUS_TYPES.find(c => c.value == status);
        this.dialogService.ConfirmAsync('Bạn có muốn ' + helper.confirm + ' coupon: <b>' + item.Name + '</b>', async () => {
            let id = item.Id;
            await this.couponService.updateStatus({
                Id: id,
                Status: status
            }).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success(helper.label + ' coupon thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        }, null, 'Xác nhận', 'Xác nhận');
    }
}