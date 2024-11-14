import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { MMAssignComponent } from '../assign/assign.component';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { MMAddNoteComponent } from '../add.note/add.note.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { MMAssignListComponent } from '../assign.list/assign.list.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MMLookupQuickViewComponent } from '../lookup.quickview/lookup.quickview.component';
import { ModalExportDataComponent } from '../../../_core/modal/export.data/export.data.component';
import { MLLookupStatisticalComponent } from '../lookup.statistical/lookup.statistical.component';
import { MLPopupViewUserComponent } from '../../meeyuser/popup.view.user/popup.view.user.component';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MMLookupHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [
            {
                name: 'Excel',
                systemName: ActionType.Export,
                click: () => {
                    this.dialogService.WapperAsync({
                        confirmText: 'Xuất dữ liệu',
                        title: 'Xuất dữ liệu [Excel]',
                        object: ModalExportDataComponent,
                        objectExtra: {
                            Data: this.itemData,
                            Type: ExportType.Excel,
                            Reference: MMLookupHistoryEntity,
                        }
                    });
                },
                icon: 'kt-nav__link-icon la la-file-excel-o',
            }
        ],
        Filters: [],
        Actions: [
            ActionData.view((item: any) => { this.view(item) }),
            {
                name: 'Gán CSKH',
                icon: 'la la-book',
                className: 'btn btn-primary',
                systemName: ActionType.AssignSupport,
                click: ((item: any) => {
                    let cloneItem = this.cloneItems && this.cloneItems.find(c => c.Id == item.Id);
                    this.dialogService.WapperAsync({
                        cancelText: 'Hủy',
                        confirmText: 'Lưu',
                        object: MMAssignComponent,
                        size: ModalSizeType.Medium,
                        title: 'Gán chăm sóc khách hàng',
                        objectExtra: {
                            item: cloneItem
                        }
                    }, async () => { this.loadItems(); });
                })
            },
            {
                icon: 'la la-bolt',
                name: ActionType.Notes,
                className: 'btn btn-success',
                systemName: ActionType.Notes,
                click: ((item: any) => {
                    let cloneItem = this.cloneItems && this.cloneItems.find(c => c.Id == item.Id);
                    this.dialogService.WapperAsync({
                        title: 'Ghi chú',
                        cancelText: 'Hủy',
                        confirmText: 'Lưu',
                        object: MMAddNoteComponent,
                        size: ModalSizeType.Medium,
                        objectExtra: {
                            item: cloneItem
                        }
                    }, async () => { this.loadItems(); });
                })
            }
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); }),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
        Reference: MMLookupHistoryEntity,
        Title: 'Tra cứu lịch sử quy hoạch',
        SearchText: 'Nhập tên, email, số điện thoại',
        StatisticalComponent: MLLookupStatisticalComponent,
        CustomFilters: ['Address', 'UserId', 'LookupDate', 'ZoneType']
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
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
                }
            },
            { Property: 'Address', Title: 'Đia chỉ thửa đất đã tra cứu', Type: DataType.String },
            { Property: 'Report', Title: 'Báo cáo sai phạm', Type: DataType.String },
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
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
                    return text;
                }
            },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);

        let allowAssignSupport = await this.authen.permissionAllow('mmlookuphistory', ActionType.AssignSupport);
        if (allowAssignSupport) {
            this.obj.Checkable = true;
            this.obj.Features.unshift({
                hide: true,
                icon: 'la la-book',
                className: 'btn btn-primary',
                toggleCheckbox: true,
                name: ActionType.AssignSupport,
                systemName: ActionType.AssignSupport,
                click: (() => {
                    let cloneItems = this.items && this.items.filter(c => c.Checked);
                    if (!cloneItems || cloneItems.length == 0) {
                        this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để gán quyền');
                        return;
                    }
                    this.dialogService.WapperAsync({
                        cancelText: 'Hủy',
                        confirmText: 'Lưu',
                        size: ModalSizeType.Medium,
                        title: 'Gán chăm sóc khách hàng',
                        object: MMAssignListComponent,
                        objectExtra: {
                            items: cloneItems
                        }
                    }, async () => { this.loadItems(); });
                })
            });
        }
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'sale': this.quickViewProfile(item['Sale']); break;
            case 'support': this.quickViewProfile(item['Support']); break;
        }
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