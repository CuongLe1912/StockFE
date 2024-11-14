import * as _ from 'lodash';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { TableData } from '../../../_core/domains/data/table.data';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ImportTagComponent } from '../import.tag/import.tag.component';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { DateTimeFormat } from '../../../_core/decorators/datetime.decorator';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { ActionType, ControllerType } from '../../../_core/domains/enums/action.type';
import { MSSeoFileEntity } from '../../../_core/domains/entities/meeyseo/ms.file.import.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class FileImportComponent extends GridComponent implements OnInit, OnDestroy {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                className: 'btn btn-warning',
                systemName: ActionType.View,
                controllerName: ControllerType.MSSeoTagFile,
                click: (item: any) => {
                    let obj: NavigationStateData = {
                        id: item.Id,
                        prevUrl: '/admin/msseo/files',
                    };
                    this.router.navigate(['/admin/msseo/filetags'], { state: { params: JSON.stringify(obj) } });
                }
            },
            ActionData.delete((item: any) => {
                this.delete(item);
            }),
        ],
        Features: [
            {
                hide: true,
                icon: 'la la-trash',
                toggleCheckbox: true,
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                click: (item: any) => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.deleteMultiple(items);
                }
            },
            ActionData.reload(() => this.loadItems())
        ],
        Checkable: true,
        UpdatedBy: false,
        HideCustomFilter: true,
        Reference: MSSeoFileEntity,
        InlineFilters: ['DateTime']
    };
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.String },
            { Property: 'Name', Title: 'Tên file', Type: DataType.String },
            {
                Property: 'DateTime', Title: 'Ngày cập nhật', Type: DataType.String, Align: 'center', 
                Format: (item: any) => {
                    let text = UtilityExHelper.dateTimeToString(item.DateTime, DateTimeFormat.DMYHM)
                    return text;
                }
            },
            { Property: 'StatusName', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            { Property: 'Total', Title: 'Tổng Tag', Type: DataType.Number, Align: 'center' },
            { Property: 'TotalApprove', Title: 'Tag đã duyệt', Type: DataType.Number, Align: 'center' },
            { Property: 'TotalDeleted', Title: 'Tag đã xóa', Type: DataType.Number, Align: 'center' },
            { Property: 'TotalPending', Title: 'Tag chưa xử lý', Type: DataType.Number, Align: 'center' },
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let allowImport = await this.authen.permissionAllow(ControllerType.MSSEO, ActionType.Import);
        if (allowImport) {
            this.obj.Features.splice(0, 0, {
                name: 'Import',
                icon: 'la la-recycle',
                click: () => this.import(),
                className: 'btn btn-warning',
                systemName: ActionType.Import,
            });
        }
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
                if (obj.Name == 'MSSeoFileEntity') {
                    await this.loadItems();
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    import() {
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: '',
            title: 'Import tag',
            size: ModalSizeType.Medium,
            object: ImportTagComponent,
        });
    }

    delete(item: any): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa tệp: <b>' + item.Name + '</b>?', async () => {
            await this.service.callApi('MSSeoFile', 'Delete', [item.Id], MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object == 1) {
                        ToastrHelper.Success('Xóa tệp thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Xóa tệp không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    deleteMultiple(items: any[]): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa: <b>' + items.length + ' tệp</b>?', async () => {
            let ids = items.map(c => c.Id);
            await this.service.callApi('MSSeoFile', 'Delete', ids, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object >= 1) {
                        ToastrHelper.Success('Xóa ' + result.Object + ' tệp thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Xóa tệp không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }
}