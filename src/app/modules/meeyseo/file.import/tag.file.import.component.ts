import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { MSListTagApproveComponent } from './list.tag.approve.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionType, ControllerType } from '../../../_core/domains/enums/action.type';
import { MSFileImportEntity } from '../../../_core/domains/entities/meeyseo/ms.file.import.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class TagFileImportComponent extends GridComponent implements OnInit {
    id: string;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                name: 'Duyệt',
                icon: 'la la-check',
                className: 'btn btn-primary',
                systemName: ActionType.Approve,
                controllerName: ControllerType.MSSeoTagFile,
                hidden: (item: any) => {
                    return item.Status == 2;
                },
                click: (item: any) => {
                    this.approve(item);
                }
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                controllerName: ControllerType.MSSeoTagFile,
                click: (item: any) => {
                    this.delete(item);
                }
            }
        ],
        Features: [
            ActionData.back(),
            {
                hide: true,
                icon: 'la la-check',
                toggleCheckbox: true,
                name: ActionType.Approve,
                className: 'btn btn-primary',
                systemName: ActionType.Approve,
                controllerName: ControllerType.MSSeoTagFile,
                click: () => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.approveMultiple(items);
                }
            },
            {
                icon: 'la la-check',
                name: 'Duyệt tất cả',
                className: 'btn btn-primary',
                systemName: ActionType.Approve,
                controllerName: ControllerType.MSSeoTagFile,
                hidden: () => {
                    return !this.originalItems || this.originalItems.length == 0;
                },
                click: () => {
                    if (this.originalItems && this.originalItems.length > 0) {
                        let item = this.originalItems[0];
                        this.approveAll(item);
                    }
                }
            },
            {
                hide: true,
                icon: 'la la-trash',
                toggleCheckbox: true,
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                controllerName: ControllerType.MSSeoTagFile,
                click: () => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.deleteMultiple(items);
                }
            },
            {
                name: 'Xóa tất cả',
                icon: 'la la-trash',
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                controllerName: ControllerType.MSSeoTagFile,
                hidden: () => {
                    return !this.originalItems || this.originalItems.length == 0;
                },
                click: () => {
                    if (this.originalItems && this.originalItems.length > 0) {
                        let item = this.originalItems[0];
                        this.deleteAll(item);
                    }
                }
            },
            ActionData.reload(() => this.loadItems())
        ],
        Checkable: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideCustomFilter: true,
        Reference: MSFileImportEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.String },
            { Property: 'Name', Title: 'Tag', Type: DataType.String },
            { Property: 'StatusName', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            { Property: 'Prioritized', Title: 'Ưu tiên', Type: DataType.Boolean, Align: 'center' },
            { Property: 'Property', Title: 'Thuộc tính', Type: DataType.String },
        ];
        if (!this.breadcrumbs) this.breadcrumbs = [];
        this.breadcrumbs.push({ Name: 'Meey Land', Link: '/' });
        this.breadcrumbs.push({ Name: 'Tag tin đăng' });
        this.breadcrumbs.push({ Name: 'Danh sách tag chờ duyệt', Link: '/admin/msseo/files' });
        this.breadcrumbs.push({ Name: 'Chi tiết tag chờ duyệt' });
    }

    async ngOnInit() {
        this.setPageSize(50);
        this.id = this.state.id;
        if (this.id) {
            this.obj.Url = '/admin/MSSeoTagFile/Items/' + this.id;
            this.render(this.obj);
        }
    }

    delete(item: any): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa tag: <b>' + item.Name + '</b>?', async () => {
            let obj = {
                Ids: [item.Id]
            };
            await this.service.callApi('MSSeoTagFile', 'delete', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object == 1) {
                        ToastrHelper.Success('Xóa tag thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Xóa tag không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    deleteAll(item: any): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa: toàn bộ tag</b>?', async () => {
            let obj = {
                Ids: [],
                FileId: item.FileId,
            };
            await this.service.callApi('MSSeoTagFile', 'delete', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object >= 1) {
                        ToastrHelper.Success('Xóa ' + result.Object + ' tag thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Xóa tag không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    deleteMultiple(items: any[]): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn xóa: <b>' + items.length + ' tag</b>?', async () => {
            let obj = {
                Ids: items.map(c => c.Id)
            };
            await this.service.callApi('MSSeoTagFile', 'delete', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object >= 1) {
                        ToastrHelper.Success('Xóa ' + result.Object + ' tag thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Xóa tag không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    approve(item: any): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn duyệt tag: <b>' + item.Name + '</b>?', async () => {
            let obj = {
                Ids: [item.Id],
                Many: 0,
            };
            await this.service.callApi('MSSeoTagFile', 'approve', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object?.totalSuccess >= 1) {
                        ToastrHelper.Success('Duyệt tag thành công');
                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Duyệt tag không thành công');
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    approveAll(item: any): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn duyệt toàn bộ tag</b>?', async () => {
            let obj = {
                Ids: [],
                FileId: item.FileId,
                Many: 1,
            };
            await this.service.callApi('MSSeoTagFile', 'approve', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object?.totalSuccess >= 1) {
                        ToastrHelper.Success('Duyệt ' + result.Object?.totalSuccess + ' tag thành công');

                        // close and open other popup
                        this.openPopupApprove(result);

                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Duyệt tag không thành công');
                        // close and open other popup
                        this.openPopupApprove(result);

                        await this.loadItems();
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        });
    }

    approveMultiple(items: any[]): void {
        this.dialogService.ConfirmAsync('Có phải bạn muốn duyệt: <b>' + items.length + ' tag</b>?', async () => {
            let obj = {
                Ids: items.map(c => c.Id),
                Many: 1,
            };
            await this.service.callApi('MSSeoTagFile', 'approve', obj, MethodType.Post).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object?.totalSuccess >= 1) {
                        ToastrHelper.Success('Duyệt ' + result.Object?.totalSuccess + ' tag thành công');

                        // close and open other popup
                        this.openPopupApprove(result);

                        await this.loadItems();
                    } else {
                        ToastrHelper.Error('Duyệt tag không thành công');
                        // close and open other popup
                        this.openPopupApprove(result);

                        await this.loadItems();
                    }
                } else ToastrHelper.ErrorResult(result);
            }, (e: any) => {
                ToastrHelper.Exception(e);
            });
        })
    }

    openPopupApprove(result: ResultApi) {
        // close and open other popup
        let obj = result.Object;
        this.dialogService.HideAllDialog();
        setTimeout(() => {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: {
                    items: obj?.data,
                    statisticals: {
                        'Số tag thành công': obj?.totalSuccess,
                        'Số tag không thành công': obj?.totalError,
                    },
                },
                title: 'Thông báo duyệt',
                size: ModalSizeType.ExtraLarge,
                object: MSListTagApproveComponent,
            });
        }, 300);
    }
}