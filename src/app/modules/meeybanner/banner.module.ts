import { AppInjector } from "../../app.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { MBBannerService } from "./banner.service";
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { ResultApi } from "../../_core/domains/data/result.api";
import { ToastrHelper } from "../../_core/helpers/toastr.helper";
import { OptionItem } from "../../_core/domains/data/option.item";
import { ActionData } from "../../_core/domains/data/action.data";
import { ActionType } from "../../_core/domains/enums/action.type";
import { ResultType } from "../../_core/domains/enums/result.type";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../_core/helpers/constant.helper";
import { AddBannerComponent } from "./add.banner/add.banner.component";
import { Component, NgModule, OnDestroy, OnInit } from "@angular/core";
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../_core/components/grid/grid.component";
import { MBBannerRunningComponent } from "./banner.running/banner.running.component";
import { MBStatusType } from "../../_core/domains/entities/meeybanner/enums/mb.status.type";
import { MBBannerType } from "../../_core/domains/entities/meeybanner/enums/mb.banner.type";
import { MBSourceType } from "../../_core/domains/entities/meeybanner/enums/mb.source.type";
import { ModalViewProfileComponent } from "../../_core/modal/view.profile/view.profile.component";
import { MBBannerEntity, MBBannerUpdateStatusEntity } from "../../_core/domains/entities/meeybanner/mb.banner.entitty";

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class BannerComponent extends GridComponent implements OnInit, OnDestroy {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            //Xem chi tiết
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: (item: any) => {
                    this.view(item);
                },
            },
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                hidden: (item: any) => {
                    return !item[ActionType.Edit];
                },
                click: (item: MBBannerEntity) => {
                    this.edit(item);
                }
            },
            //Phê duyệt
            {
                icon: 'la la-check',
                name: 'Phê duyệt',
                systemName: ActionType.Approve,
                className: 'btn btn-outline-success',
                hidden: (item: any) => {
                    return !(item[ActionType.Approve] && (item.StatusCode == MBStatusType.Pending || item.StatusCode == MBStatusType.Reject))
                },
                click: (item: any) => {
                    const endDate = new Date(item.StartEnd[1]).getTime();
                    const currentDate = new Date().getTime();
                    if (item.StartEnd[1] && endDate < currentDate) this.runningBanner(item, MBStatusType.Approve);
                    else this.updateStatus(item, MBStatusType.Approve);
                }
            },
            //Từ chối
            {
                icon: 'la la-close',
                name: 'Từ chối',
                systemName: ActionType.Reject,
                className: 'btn btn-outline-danger',
                hidden: (item: any) => {
                    return !(item[ActionType.Reject] && (item.StatusCode == MBStatusType.Pending || item.StatusCode == MBStatusType.Approve))
                },
                click: (item: MBBannerEntity) => {
                    this.updateStatus(item, MBStatusType.Reject);
                }
            },
            //Chạy banner
            {
                name: 'Chạy Banner',
                icon: 'la la-step-forward',
                systemName: ActionType.Play,
                className: 'btn btn-outline-success',
                hidden: (item: any) => {
                    return !(item[ActionType.Play] && (item.StatusCode == MBStatusType.Pause || item.StatusCode == MBStatusType.Stop || item.StatusCode == MBStatusType.Approve))
                },
                click: (item: any) => {
                    const endDate = new Date(item.StartEnd[1]).getTime();
                    const currentDate = new Date().getTime();
                    if (item.StartEnd[1] && endDate < currentDate) this.runningBanner(item, MBStatusType.Running);
                    else this.updateStatus(item, MBStatusType.Running);
                }
            },
            //Tạm dừng
            {
                icon: 'la la-pause',
                name: 'Tạm dừng Banner',
                systemName: ActionType.Pause,
                className: 'btn btn-outline-warning',
                hidden: (item: any) => {
                    return !(item[ActionType.Pause] && item.StatusCode == MBStatusType.Running)
                },
                click: (item: any) => {
                    this.updateStatus(item, MBStatusType.Pause);
                }
            },
            //Dừng
            {
                icon: 'la la-stop',
                name: 'Dừng chạy Banner',
                systemName: ActionType.Stop,
                className: 'btn btn-outline-danger',
                hidden: (item: any) => {
                    return !(item[ActionType.Stop] && (item.StatusCode == MBStatusType.Running || item.StatusCode == MBStatusType.Pause))
                },
                click: (item: any) => {
                    this.updateStatus(item, MBStatusType.Stop);
                }
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',
                hidden: (item: any) => {
                    return !(item[ActionType.Delete] && (item.StatusCode == MBStatusType.Reject || item.StatusCode == MBStatusType.Stop))
                },
                click: (item: MBBannerEntity) => {
                    this.delete(item.Id);
                }
            },
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: 'Tạo banner',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
            },
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MBBannerEntity,
        SearchText: 'Tìm theo tên Banner',
        CustomFilters: ['FilterCode', 'FilterName', 'FilterProduct', 'FilterDateRange', 'Status', 'DisplayTime', 'CustomerId', 'FilterCreatedBy', 'BannerType']
    };
    bannerService: MBBannerService;

    constructor() {
        super();
        this.bannerService = AppInjector.get(MBBannerService);
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number, DisableOrder: true },
            { Property: 'Code', Title: 'Mã Banner', Type: DataType.String, DisableOrder: true, },
            { Property: 'Name', Title: 'Tên Banner', Type: DataType.String, DisableOrder: true, },
            {
                Property: 'BannerType', Title: 'Loại Banner', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    let option = ConstantHelper.MB_BANNER_BANNER_TYPES.find(c => c.value == item.BannerType);
                    if (option) text += '<p>' + option.label + '</p>';

                    if (item.BannerType == MBBannerType.BannerAds) {
                        if (item.SourceType) {
                            let optionSourceType = ConstantHelper.MB_BANNER_SOURCE_TYPES.find(c => c.value == item.SourceType);
                            if (optionSourceType) text += '<p>(' + optionSourceType.label + ')</p>';
                        }
                    }
                    return text;
                }
            },
            {
                Property: 'CustomerName', Title: 'Khách hàng', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item.SourceType == MBSourceType.Staff || item == MBBannerType.BannerHome) {
                        return '';
                    }
                    if (!item.Customer) return '';
                    if (item.Customer?.Name) text += '<p>' + item.Customer.Name + '</p>';
                    if (item.Customer?.Email) text += '<p>' + item.Customer.Email + '</p>';
                    if (item.Customer?.Phone) text += '<p>' + item.Customer.Phone + '</p>';
                    return text;
                }
            },
            {
                Property: 'StartDate', Title: 'Thời gian treo', Align: 'center', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    item['StartEnd'] = [item.StartDate, item.EndDate];
                    item['StartDatePrev'] = item.StartDate;
                    let text = '';
                    if (item.StartDate) text += UtilityExHelper.dateString(item.StartDate);
                    if (item.EndDate) {
                        text += ' - ' + UtilityExHelper.dateString(item.EndDate);
                    }
                    return text;
                }
            },
            {
                Property: 'Status', Title: 'Trạng thái', Align: 'center', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    item['StatusCode'] = item['Status'];
                    let option: OptionItem = ConstantHelper.MB_BANNER_STATUS_TYPES.find(c => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'Products', Title: 'Sản phẩm', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    if (!item.Products) return '';
                    let text = '';
                    if (item.Products.indexOf('[') >= 0) {
                        let items = JSON.parse(item.Products);
                        item['ProductCount'] = items?.length;
                        for (let i = 0; i < items.length; i++) {
                            if (i == 2) {
                                text += '<p>...</p>';
                                break;
                            }
                            let option = ConstantHelper.MB_BANNER_PRODUCT_TYPES.find(c => c.value == items[i]);
                            if (option) text += '<p>' + option.label + '</p>';
                        }
                    } else {
                        let option = ConstantHelper.MB_BANNER_PRODUCT_TYPES.find(c => c.value == item.Products);
                        if (option) text += '<p>' + option.label + '</p>';
                    }
                    return text;
                }
            },
            {
                Property: 'Platform', Title: 'Phiên bản', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item.Platforms && item.Platforms.length >= 3) text = '<p class="text-primary">Tất cả</p>';
                    else {
                        item.Platforms.forEach((value: number) => {
                            let option = ConstantHelper.MB_BANNER_PLATFORM_TYPES.find(c => c.value == value);
                            if (option) text += '<p class="text-primary">' + option.label + '</p>';
                        });
                    }
                    return text;
                    
                },
                Click: ((item: any) => {
                    this.viewLocation(item);
                })
            },
            {
                Property: 'ZoneCount', Title: 'Số banner', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let total = (item.ZoneCount * item.ProductCount);
                    let text = '<p>' + total + '</p>';
                    return text;
                }
            },
            {
                Property: 'SaleEmail', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    item['Sale'] = item.SaleEmail;
                    item['Support'] = item.SupportEmail;
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'CreatedByName', Title: 'Người tạo', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item.AdminUser?.Name) text += '<p>' + item.AdminUser.Name + '</p>';
                    if (item.AdminUser?.Email) {
                        text += '<p>' + item.AdminUser.Email + '</p>'
                    }
                    if (item.AdminUser?.Phone) {
                        text += '<p>' + item.AdminUser.Phone + '</p>'
                    }
                    return text;
                }
            },
        ];
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async () => {
                await this.loadItems();
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Thêm mới',
            title: 'Thêm Banner',
            confirmClose: true,
            size: ModalSizeType.ExtraLarge,
            object: AddBannerComponent,
        }, () => this.loadItems());
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: '',
            title: 'Chi Tiết Banner',
            object: AddBannerComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: item.Id, viewer: true },
        }, () => this.loadItems());
    }

    viewLocation(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Vị Trí Banner',
            object: AddBannerComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: item.Id, viewer: true, viewLocation: true },
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Sửa Banner',
            confirmClose: true,
            object: AddBannerComponent,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
        }, () => this.loadItems());
    }

    async updateStatus(item: any, status: MBStatusType) {
        var helper = ConstantHelper.MB_BANNER_STATUS_TYPES.find(c => c.value == status);
        if (status == MBStatusType.Pause) {
            let id = item.Id;
            await this.bannerService.updateStatus(id, status).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success(helper.label + ' banner thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        } else {
            this.dialogService.ConfirmAsync('Bạn có muốn ' + helper.confirm + ' banner: <b>' + item.Name + '</b>', async () => {
                let id = item.Id;
                await this.bannerService.updateStatus(id, status).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success(helper.label + ' banner thành công');
                        await this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            }, null, 'Xác nhận', 'Xác nhận');
        }
    }

    runningBanner(item: any, status: MBStatusType) {
        let obj: MBBannerUpdateStatusEntity = {
            Id: item.Id,
            Status: status,
            EndDate: item.EndDate,
            StartDate: item.StartDatePrev,
            DisplayTime: item.DisplayTime,
        };
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Xác nhận',
            objectExtra: { item: obj },
            size: ModalSizeType.Medium,
            object: MBBannerRunningComponent,
            title: 'Cập nhật thời gian chạy',
        }, async () => {
            await this.loadItems();
        });
    }

    delete(id: any) {
        if (typeof (id) == 'object') {
            id = id.Id;
        }
        this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu banner này?', () => {
            this.service.delete('mbbanner', id).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Xóa banner thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'sale': this.quickViewProfile(item['Sale']); break;
            case 'support': this.quickViewProfile(item['Support']); break;
        }
    }
    public quickViewProfile(email: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { email: email },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
    }
}

@NgModule({
    imports: [
        CommonModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BannerComponent, pathMatch: 'full', data: { state: 'mbbanner' }, canActivate: [AdminAuthGuard] },
        ]),
    ],
    declarations: [
        BannerComponent,
        MBBannerRunningComponent,
        AddBannerComponent
    ],
})
export class MBBannerModule { }
