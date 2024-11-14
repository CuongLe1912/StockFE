import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { EditOfficeComponent } from "./edit.office/edit.office.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MROfficeEntity } from "../../../_core/domains/entities/meeyredt/mr.office.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class OfficeComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
            ActionData.view((item: any) => this.view(item)),
            ActionData.delete((item: any) => this.delete(item._Id)),
            {
                name: 'Hủy kích hoạt',
                icon: 'la la-download',
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
                icon: 'la la-upload',
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
        Reference: MROfficeEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true },
            { Property: 'TopicVn', Title: 'Loại', Type: DataType.String, DisableOrder: true },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image, DisableOrder: true },
            { Property: 'TitleVn', Title: 'Tiêu đề - Tiếng Việt', Type: DataType.String, DisableOrder: true },
        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo văn phòng',
            size: ModalSizeType.Medium,
            object: EditOfficeComponent,
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item._Id },
            object: EditOfficeComponent,
        }, () => this.loadItems());
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditOfficeComponent,
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
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu văn phòng này?', async () => {
                return await this.service.callApi('mroffice', 'delete/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa văn phòng thành công');
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
            ToastrHelper.Error('Xóa văn phòng không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn kích hoạt dữ liệu văn phòng này?', async () => {
                return await this.service.callApi('mroffice', 'Active/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Kích hoạt văn phòng thành công');
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
            ToastrHelper.Error('Kích hoạt văn phòng không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn hủy kích hoạt dữ liệu văn phòng này?', async () => {
                return await this.service.callApi('mroffice', 'UnActive/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Hủy kích hoạt văn phòng thành công');
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
            ToastrHelper.Error('Hủy kích hoạt văn phòng không thành công');
            return false;
        }
    }
}