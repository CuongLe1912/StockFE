import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { HttpEventType } from '@angular/common/http';
import { Component, NgModule, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from '../../../_core/domains/data/result.api';
import { TableData } from "../../../_core/domains/data/table.data";
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { ExportType } from '../../../_core/domains/enums/export.type';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MCRMAddInvestorComponent } from "./add.investor/add.investor.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MCRMDealerGridComponent } from "./component/investor.dealer.grid.component";
import { MCRMInvestorInfoComponent } from "./add.investor/investor.info/investor.info.component";
import { MCRMInvestorEntity } from "../../../_core/domains/entities/meeycrm/mcrm.investor.entity";
import { MCRMInvestorImageComponent } from "./add.investor/investor.image/investor.image.component";
import { MCRMInvestorOrderHistoryGridComponent } from "./component/investor.orderhistory.grid.component";
import { MCRMInvestorTransactionHistoryGridComponent } from "./component/investor.transactionhistory.grid.component";
import { MCRMInvestorTransactionHistoryComponent } from "./add.investor/investor.transaction/investor.transaction.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MCRMInvestorComponent extends GridComponent implements OnInit {
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
            ActionData.edit((item: any) => this.edit(item)),
            {
                name: 'Khóa',
                icon: 'la la-lock',
                className: 'btn btn-danger',
                systemName: ActionType.Lock,
                hidden: (item: any) => {
                    return !item.IsActive;
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.lock(originalItem);
                }
            },
            {
                name: 'Mở khóa',
                icon: 'la la-unlock',
                className: 'btn btn-success',
                systemName: ActionType.UnLock,
                hidden: (item: any) => {
                    return item.IsActive;
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.unlock(originalItem);
                }
            },
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: 'Thêm mới',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
            },
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                click: () => this.export()
            },
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MCRMInvestorEntity,
        SearchText: 'Tìm kiếm tên chủ đầu tư',
        CustomFilters: ['RepresentativeName', 'Domain', 'Phone', 'Email', 'Status']
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true, },
            { Property: 'InvestorName', Title: 'Chủ đầu tư', Type: DataType.String, DisableOrder: true, },
            {
                Property: 'RepresentativeName', Title: 'Người đại diện', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = '';
                    if (item.RepresentativeName) text += '<p>' + item.RepresentativeName + '</p>';
                    if (item.Phone) text += '<p>' + item.Phone + '</p>';
                    if (item.Email) text += '<p>' + item.Email + '</p>';
                    return text;
                })
            },
            { Property: 'Domain', Title: 'Têm miền sản phẩm', Type: DataType.String, DisableOrder: true, },
            // { Property: 'ServicePack', Title: 'Gói dịch vụ', Type: DataType.String, Align: 'center', DisableOrder: true, },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: ((item: any) => {
                    let text = '';
                    let color = item.Status == "Hoạt động" ? "text-success" : "text-danger";
                    if (item.Status) text += '<p class="' + color + '">' + item.Status + '</p>';
                    return text;
                })
            },
            {
                Property: 'Sale', Title: 'Thông tin chăm sóc', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Sale) text += '<p>Sale: ' + item.Sale + '</p>';
                    if (item.Support) text += '<p>CSKH: ' + item.Support + '</p>';
                    return text;
                })
            },
            {
                Property: 'UpdatedBy', Title: 'Người cập nhật', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = '';
                    if (item.UpdatedBy) text += '<p>' + item.UpdatedBy + '</p>';
                    if (item.UpdatedDate) text += '<p>' + item.UpdatedDate + '</p>';
                    if (item.UpdatedHours) text += '<p>' + item.UpdatedHours + '</p>';
                    return text;
                })
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            object: {
                isAddNew: true,
            },
            prevUrl: '/admin/mcrminvestor',
        };
        this.router.navigate(['/admin/mcrminvestor/add'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item._Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: "/admin/mcrminvestor",
        };
        this.router.navigate(["/admin/mcrminvestor/view"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    edit(item: any) {
        let obj: NavigationStateData = {
            id: item._Id,
            viewer: false,
            object: {
                isUpdate: true,
            },
            prevData: this.itemData,
            prevUrl: "/admin/mcrminvestor",
        };
        this.router.navigate(["/admin/mcrminvestor/edit"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    lock(item: any) {
        let id = item._Id;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullName": this.authen.account.FullName
                },
                "source": 'admin',
            },
        };
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn khóa tài khoản này?</br> Sau thao tác này, chủ đầu tư sẽ không thể đăng nhập vào sản phẩm nữa.', async () => {
            await this.service.callApi('MCRMInvestor', 'Lock/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    await this.loadItems();
                    setTimeout(() => {
                        this.dialogService.Success('Đã khóa tài khoản chủ dầu tư: ' + item.InvestorName, 'Khóa tài khoản');
                    }, 500);
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            });
        }, null, 'Khóa tài khoản', 'Khóa');

    }

    unlock(item: any) {
        let id = item._Id;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullName": this.authen.account.FullName
                },
                "source": 'admin',
            },
        };
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn mở khóa tài khoản này?', async () => {
            await this.service.callApi('MCRMInvestor', 'UnLock/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    await this.loadItems();
                    setTimeout(() => {
                        this.dialogService.Success('Đã mở khóa tài khoản chủ đầu tư: ' + item.InvestorName, 'Mở khóa tài khoản');
                    }, 500);
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            });
        }, null, 'Mở khóa tài khoản', 'Mở khóa');

    }

    export() {
        let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
        if (obj) {
            let limit = obj.Paging.Total;
            if (limit > 1000) {
                ToastrHelper.Error('Số lượng export không được vượt quá 1000.');
                return false;
            }
            obj.Export = {
                Limit: limit,
                Type: ExportType.Excel,
            };
            obj.Paging.Index = 1;
            obj.Paging.Size = obj.Export.Limit;
        }
        return this.service.downloadFile('mcrminvestor', obj).toPromise().then(data => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    break;
                case HttpEventType.Response:
                    let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
                    let extension = 'xlsx';
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = 'danhsachCĐT_' + currentDate + '.' + extension;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
            return true;
        }, () => {
            ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
            return false;
        });
    }
}

@NgModule({
    declarations: [
        MCRMInvestorComponent,
        MCRMDealerGridComponent,
        MCRMAddInvestorComponent,
        MCRMInvestorInfoComponent,
        MCRMInvestorImageComponent,
        MCRMInvestorOrderHistoryGridComponent,
        MCRMInvestorTransactionHistoryComponent,
        MCRMInvestorTransactionHistoryGridComponent
    ],
    imports: [
        UtilityModule,
        ShareModule,
        RouterModule.forChild([
            { path: '', component: MCRMInvestorComponent, pathMatch: 'full', data: { state: 'mcrminvestor' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: MCRMAddInvestorComponent, pathMatch: 'full', data: { state: 'add_mcrminvestor' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MCRMAddInvestorComponent, pathMatch: 'full', data: { state: 'view_mcrminvestor' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MCRMAddInvestorComponent, pathMatch: 'full', data: { state: 'edit_mcrminvestor' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MCRMInvestorModule { }