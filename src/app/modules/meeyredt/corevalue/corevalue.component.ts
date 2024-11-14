import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditCoreValueComponent } from "./edit.corevalue/edit.corevalue.component";
import { MRCoreValueEntity } from "../../../_core/domains/entities/meeyredt/mr.corevalue.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CoreValueComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
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
        Filters: [],
        Reference: MRCoreValueEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image, DisableOrder: true },
            { Property: 'TitleVn', Title: 'Tiêu đề', Type: DataType.String, Align: 'center', DisableOrder: true },
        ];
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo giá trị cốt lõi',
            size: ModalSizeType.Medium,
            object: EditCoreValueComponent,
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item._Id },
            object: EditCoreValueComponent,
        }, () => this.loadItems());
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditCoreValueComponent,
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
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu giá trị cốt lõi này?', async () => {
                return await this.service.callApi('mrcorevalue', 'delete/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa giá trị cốt lõi thành công');
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
            ToastrHelper.Error('Xóa giá trị cốt lõi không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn kích hoạt dữ liệu giá trị cốt lõi này?', async () => {
                return await this.service.callApi('mrcorevalue', 'Active/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Kích hoạt giá trị cốt lõi thành công');
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
            ToastrHelper.Error('Kích hoạt giá trị cốt lõi không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn hủy kích hoạt dữ liệu giá trị cốt lõi này?', async () => {
                return await this.service.callApi('mrcorevalue', 'UnActive/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Hủy kích hoạt giá trị cốt lõi thành công');
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
            ToastrHelper.Error('Hủy kích hoạt giá trị cốt lõi không thành công');
            return false;
        }
    }
}