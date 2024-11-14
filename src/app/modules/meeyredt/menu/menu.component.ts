import { Component } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EditMenuComponent } from './edit.menu/edit.menu.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MRMenuEntity } from '../../../_core/domains/entities/meeyredt/mr.menu.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MenuComponent extends GridComponent {

    obj: GridData = {
        Imports: [],
        Exports: [],
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
            ActionData.view((item: any) => this.view(item)),
            ActionData.delete((item: any) => this.delete(item._Id)),
            {
                name: 'Hủy kích hoạt',
                icon: 'la la-times',
                className: 'btn btn-success',
                systemName: ActionType.Cancel,
                hidden: (item: any) => {
                    return !item.IsActive;
                },
                click: (item: any) => {
                    this.unactive(item._Id);
                }
            },
            {
                name: 'Kích hoạt',
                icon: 'la la-check',
                className: 'btn btn-success',
                systemName: ActionType.Approve,
                hidden: (item: any) => {
                    return item.IsActive;
                },
                click: (item: any) => {
                    this.active(item._Id);
                }
            }
        ],
        Filters: [],
        Reference: MRMenuEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'Name', Title: 'Tên menu', Type: DataType.String, Align: 'center', DisableOrder: true },
            { Property: 'Slug', Title: 'Slug', Type: DataType.String, Align: 'center', DisableOrder: true },
        ];
    }

    async ngOnInit(): Promise<void> {
        this.render(this.obj);

    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Tạo mới menu',
            confirmText: 'Tạo menu',
            size: ModalSizeType.Medium,
            object: EditMenuComponent,
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Sửa menu',
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item._Id },
            object: EditMenuComponent,
        }, () => this.loadItems());
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem chi tiết menu',
            size: ModalSizeType.Medium,
            object: EditMenuComponent,
            objectExtra: { id: item._Id, viewer: true },
        });
    }

    async delete(id: any) {
        if (id) {
            let data = {
                "author": {
                    "data": {
                        "id": this.authen.account.Id,
                        "fullname": this.authen.account.FullName
                    }
                }
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu chuyên mục này?', async () => {
                return await this.service.callApi('mrmenu', 'delete/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa chuyên mục thành công');
                        await this.loadItems();
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            });
        } else {
            ToastrHelper.Error('Xóa menu không thành công');
            return false;
        }
    }
    async active(id: any) {
        if (id) {
            let data = {
                "author": {
                    "data": {
                        "id": this.authen.account.Id,
                        "fullname": this.authen.account.FullName
                    }
                }
            };
            this.dialogService.Confirm('Có phải bạn muốn kích hoạt dữ liệu menu này?', async () => {
                return await this.service.callApi('mrmenu', 'Active/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Kích hoạt menu thành công');
                        await this.loadItems();
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            });
        } else {
            ToastrHelper.Error('Kích hoạt menu không thành công');
            return false;
        }
    }

    async unactive(id: any) {
        if (id) {
            let data = {
                "author": {
                    "data": {
                        "id": this.authen.account.Id,
                        "fullname": this.authen.account.FullName
                    }
                }
            };
            this.dialogService.Confirm('Có phải bạn muốn hủy kích hoạt dữ liệu menu này?', async () => {
                return await this.service.callApi('mrmenu', 'UnActive/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Hủy kích hoạt menu thành công');
                        await this.loadItems();
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            });
        } else {
            ToastrHelper.Error('Hủy kích hoạt menu không thành công');
            return false;
        }
    }
}
