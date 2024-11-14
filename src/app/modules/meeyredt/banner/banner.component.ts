import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MRBannerEntity } from "../../../_core/domains/entities/meeyredt/mr.banner.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BannerComponent extends GridComponent implements OnInit {
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
        Reference: MRBannerEntity,
        CustomFilters: []
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'Id', Type: DataType.Number },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image },
            { Property: 'Text1', Title: 'Text1', Type: DataType.String },
            { Property: 'Text2', Title: 'Text2', Type: DataType.String },

        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/redt/banner',
        };
        this.router.navigate(['/admin/redt/banner/add'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: any) {
        let obj: NavigationStateData = {
            id: item._Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/redt/banner',
        };
        this.router.navigate(['/admin/redt/banner/view'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: any) {
        let obj: NavigationStateData = {
            id: item._Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/redt/banner',
        };
        this.router.navigate(['/admin/redt/banner/edit'], { state: { params: JSON.stringify(obj) } });
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
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu banner này?', async () => {
                return await this.service.callApi('mrbanner', 'delete/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa banner thành công');
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
            ToastrHelper.Error('Xóa banner không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn kích hoạt dữ liệu banner này?', async () => {
                return await this.service.callApi('mrbanner', 'Active/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Kích hoạt banner thành công');
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
            ToastrHelper.Error('Kích hoạt banner không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn hủy kích hoạt dữ liệu tin tức này?', async () => {
                return await this.service.callApi('mrbanner', 'UnActive/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Hủy kích hoạt banner thành công');
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
            ToastrHelper.Error('Hủy kích hoạt banner không thành công');
            return false;
        }
    }
}