import { Component, OnInit } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MRNewsEntity } from "../../../_core/domains/entities/meeyredt/mr.news.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class NewsComponent extends GridComponent implements OnInit {
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
        Reference: MRNewsEntity,
        CustomFilters: []
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image, DisableOrder: true },
            { Property: 'TitleVn', Title: 'Tiêu đề - Tiếng Việt', Type: DataType.String, DisableOrder: true },
            { Property: 'TitleEn', Title: 'Tiêu đề - Tiếng Anh', Type: DataType.String, DisableOrder: true },
            { Property: 'CategoryVn', Title: 'Chuyên mục', Type: DataType.String, DisableOrder: true },
        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }

    private setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/redt/news',
        };
        this.router.navigate(['/admin/redt/news/add'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: any) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/redt/news/view?id=' + item._Id + '&viewer=true';
        window.open(url, "_blank");
    }
    edit(item: any) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/redt/news/edit?id=' + item._Id;
        window.open(url, "_blank");
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
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu tin tức này?', async () => {
                return await this.service.callApi('mrnews', 'delete/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa tin tức thành công');
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
            ToastrHelper.Error('Xóa tin tức không thành công');
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
            this.dialogService.Confirm('Có phải bạn muốn kích hoạt dữ liệu tin tức này?', async () => {
                return await this.service.callApi('mrnews', 'Active/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Kích hoạt tin tức thành công');
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
            ToastrHelper.Error('Kích hoạt tin tức không thành công');
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
                return await this.service.callApi('mrnews', 'UnActive/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Hủy kích hoạt tin tức thành công');
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
            ToastrHelper.Error('Hủy kích hoạt tin tức không thành công');
            return false;
        }
    }
}