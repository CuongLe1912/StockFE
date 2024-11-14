import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ResultType } from "../../../_core/domains/enums/result.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { AddBannerV2Component } from "./add.banner/add.banner.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MBStatusV2Type } from "../../../_core/domains/entities/meeybanner/enums/mb.status.type";
import { MBBannerV2Entity } from "../../../_core/domains/entities/meeybanner/version2/mb.bannerv2.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BannerV2Component extends GridComponent implements OnInit {
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
                click: (item: MBBannerV2Entity) => {
                    this.edit(item);
                }
            },
            //Hạ
            {
                name: 'Hạ Banner',
                icon: 'la la-download',
                className: 'btn btn-warning',
                systemName: ActionType.Cancel,
                hidden: (item: any) => {
                    return !(item.StatusCode == MBStatusV2Type.Active);
                },
                click: (item: MBBannerV2Entity) => {
                    this.down(item.Id);
                }
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                click: (item: MBBannerV2Entity) => {
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
        Reference: MBBannerV2Entity,
        SearchText: 'Tìm theo tên Banner',
        CustomFilters: ['TypeOfHouse', 'Name', 'Type', 'Customer', 'Product', 'CityIds', 'DistrictIds', 'WardIds', 'StreetIds', 'ProjectIds', 'DateTime', 'Status', 'Position', 'Platform']
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Name', Title: 'Tên Banner', Type: DataType.String, DisableOrder: true, },
            { Property: 'Type', Title: 'Loại Banner', Type: DataType.DropDown, DisableOrder: true, },
            { Property: 'Customer', Title: 'Khách hàng', Type: DataType.String, DisableOrder: true, },
            { Property: 'Product', Title: 'Sản phẩm', Type: DataType.DropDown, DisableOrder: true, },
            {
                Property: 'StartDate', Title: 'Thời gian treo', Align: 'center', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item.StartDate) text += UtilityExHelper.dateString(item.StartDate);
                    if (item.EndDate) {
                        text += ' - ' + UtilityExHelper.dateString(item.EndDate);
                    }
                    return text;
                }
            },
            { Property: 'Status', Title: 'Trạng thái', Align: 'center', Type: DataType.DropDown, DisableOrder: true },
            { Property: 'Position', Title: 'Vị trí', Align: 'center', Type: DataType.DropDown, DisableOrder: true },
            { Property: 'Platform', Title: 'Nền tảng', Align: 'center', Type: DataType.DropDown, DisableOrder: true },
            { Property: 'Order', Title: 'Thứ tự', Align: 'center', Type: DataType.Number, DisableOrder: true },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Thêm Banner',
            confirmText: 'Thêm mới',
            object: AddBannerV2Component,
            size: ModalSizeType.ExtraLarge,
        }, () => this.loadItems());
    }

    down(id: any) {
        this.dialogService.ConfirmAsync('Có phải bạn muốn hạ banner này?', async () => {
            await this.service.callApiByUrl('mbbannerV2/down/' + id, null, MethodType.Post).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Hạ banner thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Chi tiết Banner',
            object: AddBannerV2Component,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: item.Id, viewer: true },
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Sửa Banner',
            confirmText: 'Lưu thay đổi',
            object: AddBannerV2Component,
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
        }, () => this.loadItems());
    }

    delete(id: any) {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa dữ liệu banner này?', async () => {
            await this.service.delete('mbbannerV2/delete', id).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Xóa banner thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }
}

@NgModule({
    imports: [
        CommonModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BannerV2Component, pathMatch: 'full', data: { state: 'mbbanner' }, canActivate: [AdminAuthGuard] },
        ]),
    ],
    declarations: [
        BannerV2Component,
        AddBannerV2Component
    ],
})
export class MBBannerV2Module { }
