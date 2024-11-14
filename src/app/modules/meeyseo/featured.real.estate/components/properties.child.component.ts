import { Component, OnInit } from "@angular/core";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { TableData } from "../../../../_core/domains/data/table.data";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MethodType } from "../../../../_core/domains/enums/method.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { AddTextLinkComponent } from "../add.text.link/add.text.link.component";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MSPropertiesEntity } from "../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity";


@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MSPropertiesChildComponent extends GridComponent implements OnInit {
    allowVerify: boolean;
    obj: GridData = {
        Actions: [
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                click: (item: any) => {
                    this.edit(item);
                },
                controllerName: 'msseotextlinkmanual',
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',
                click: (item: any) => {
                    this.delete(item._id);
                },
                controllerName: 'msseotextlinkmanual',
            },
        ],
        Exports: [],
        Imports: [],
        Filters: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        HideSkeletonLoading: true,
        Size: ModalSizeType.Large,
        Reference: MSPropertiesEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'linkId', Title: 'ID', Type: DataType.String },
            { Property: 'text', Title: 'Anchor text', Type: DataType.String },
            {
                Property: 'url', Title: 'Url', Type: DataType.String,
                Format: (item: any) => {
                    let url = AppConfig.MeeyLandConfig.Url + (item.url.indexOf('/') == 0 ? item.url : "/" + item.url),
                        text = '<a href="' + url + '" target="_blank">' + url + '</a>';
                    return text;
                }
            },
            { Property: 'priority', Title: 'Thứ tự', Type: DataType.String },
            {
                Property: 'status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let checked = item['status'] == '1' ? true : false;
                    let text = '<p class="d-flex align-items-center justify-content-center">'
                        + '<a routerLink="quickView" type="verified">'
                        + '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
                        + (checked
                            ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
                            : '<input type="checkbox" name="select">')
                        + '<span></span></label></span></a></p>';
                    return text;
                }
            },
            {
                Property: 'updatedDate', Title: 'Ngày cập nhật', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + UtilityExHelper.dateTimeString(item.updatedDate) + '</p>';
                    return text;
                }
            },


        ];
    }

    async ngOnInit() {
        let id = this.params && this.params['id'],
            search = this.params && this.params['search'];
        if (id) {
            this.obj.Url = '/admin/MSHighlight/GetListTextLink/' + id;
            if (search) {
                if (!this.itemData) 
                    this.itemData = new TableData();
                this.itemData.Search = search;
            }
            await this.render(this.obj);
        }

        let controllerName = this.router.url.indexOf('auto') >= 0
            ? 'msseotextlinkauto'
            : 'msseotextlinkmanual';
        this.allowVerify = await this.authen.permissionAllow(controllerName, ActionType.Approve);
    }
    async delete(id: any) {
        if (id) {
            let Ids: string[] = [];
            Ids.push(id);
            let data = {
                'adminUserId': this.authen.account.Id,
                'ids': Ids,
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu text link này?', async () => {
                return await this.service.callApi('MSHighlight', 'DeleteTextLink', data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa text link thành công');
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
            ToastrHelper.Error('Xóa text link không thành công');
            return false;
        }
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            title: 'Sửa text link',
            size: ModalSizeType.Medium,
            object: AddTextLinkComponent,
            objectExtra: { id: item._id },
        }, () => this.loadItems());
    }
    quickView(item: any, type: string): void {
        if (type && type == 'verified') {
            if (this.allowVerify) {
                let origialItem: any = this.originalItems.find(c => c['_id'] == item['_id']);
                if (origialItem.status == 1) origialItem.status = 2;
                else origialItem.status = 1;
                let data = {
                    'status': origialItem.status,
                    'adminUserId': this.authen.account.Id,
                };
                this.service.callApi('MSHighlight', 'UpdateStatusTextLink/' + item._id, data, MethodType.Post).then(async (result) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.loadItems();
                        return;
                    } ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            }
        }
    }
}