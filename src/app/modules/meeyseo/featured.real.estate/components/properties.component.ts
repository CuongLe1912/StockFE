import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { MSSeoService } from '../../seo.service';
import { HttpEventType } from '@angular/common/http';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { TableData } from '../../../../_core/domains/data/table.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExportType } from '../../../../_core/domains/enums/export.type';
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditSyntaxComponent } from '../edit.syntax/edit.syntax.component';
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { AddTextLinkComponent } from '../add.text.link/add.text.link.component';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { AddPropertiesComponent } from '../add.properties/add.properties.component';
import { MSPropertiesChildComponent } from '../components/properties.child.component';
import { ImportTextLinkComponent } from '../import.textlink/import.textlink.component';
import { MSPropertiesEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    selector: 'ms-properties-component',
    styleUrls: ['./properties.component.scss'],
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MSPropertiesComponent extends GridComponent implements OnInit {
    structureId: string;
    allowVerify: boolean;
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        IsPopup: true,
        Actions: [
            {
                name: 'Thêm mới',
                icon: 'la la-plus',
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
                controllerName: 'msseotextlinkmanual',
                click: (item: any) => this.addNewTextLink(item._id),
            },
            //Chỉnh sửa auto
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                controllerName: 'msseotextlinkauto',
                click: (item: any) => {
                    this.editAuto(item);
                }
            },
        ],
        MoreActions: [
            //Chỉnh sửa
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-success',
                controllerName: 'msseotextlinkmanual',
                click: (item: any) => {
                    this.edit(item);
                }
            },
            //Xóa
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                controllerName: 'msseotextlinkmanual',
                click: (item: any) => {
                    this.delete(item._id);
                }
            },
            //Xóa toàn bộ textlink
            {
                icon: 'la la-trash',
                className: 'btn btn-danger',
                name: 'Xóa toàn bộ textlink',
                systemName: ActionType.Delete,
                controllerName: 'msseotextlinkmanual',
                click: (item: any) => {
                    this.deleteAll(item._id);
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
                controllerName: 'msseotextlinkmanual',
            },
            {
                name: 'Import',
                icon: 'la la-recycle',
                click: () => this.import(),
                className: 'btn btn-warning',
                systemName: ActionType.Import,
                controllerName: 'msseotextlinkmanual',
            },
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                click: () => this.export(),
                className: 'btn btn-success',
                systemName: ActionType.Export,
                controllerName: 'msseotextlinkmanual',
            },
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MSPropertiesEntity,
        SearchText: 'Nhập thuộc tính, anchor text, url',
        CustomFilters: ['Need', 'TypeOfHouse', 'Price', 'Area', 'Project', 'City', 'District', 'Ward', 'Street', 'LegalPaper', 'WideRoad', 'Direction', 'Facade', 'Feature', 'Floor', 'Bedroom', 'TypeOfRealEstate', 'HavingFE', 'Utility', 'FilterStatus', 'FilterUpdateDate'],
        NotKeepPrevData: true,
        ClassName: 'grid-properties',
    };
    seoService: MSSeoService;
    @Output() loaded: EventEmitter<TableData> = new EventEmitter<TableData>();

    constructor() {
        super();
    }
    import() {
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: 'Xác nhận',
            title: 'Import BĐS nổi bật',
            size: ModalSizeType.Medium,
            object: ImportTextLinkComponent,
        });
    }
    async ngOnInit() {
        this.properties = [
            { Property: 'propertyId', Title: 'ID', Type: DataType.String },
            {
                Property: 'name', Title: this.router.url.indexOf('auto') >= 0 ? 'Cú pháp' : 'Giá trị thuộc tính', Type: DataType.String, Click: (item: any) => {
                    this.toggleSubTable(item);
                }
            },
            {
                Property: 'limit', Title: 'Giới hạn', Type: DataType.String, Align: 'center',
            },
            {
                Property: 'status', Title: 'Trạng thái', Type: DataType.String,
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
                Property: 'updatedDate', Title: 'Ngày cập nhật', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text = '<p>' + UtilityExHelper.dateTimeString(item.updatedDate) + '</p>';
                    return text;
                }
            },
        ];
        if (this.router.url.indexOf('auto') >= 0) {
            this.obj.Actions = this.obj.Actions.filter(c => c.systemName != ActionType.AddNew);
            this.obj.MoreActions = [];
            this.obj.HideCustomFilter = true;
            this.obj.HideHeadActions = true;
            this.obj.HideSearch = true;
        } else {
            this.obj.Actions = this.obj.Actions.filter(c => c.systemName != ActionType.Edit && c.systemName != ActionType.History);
        }
        this.breadcrumbs = [];

        this.event.RefreshSubGrids.subscribe((key: string) => {
            if (key == 'Properties') {
                this.loadItems();
            }
        });

        let controllerName = this.router.url.indexOf('auto') >= 0
            ? 'msseotextlinkauto'
            : 'msseotextlinkmanual';
        this.allowVerify = await this.authen.permissionAllow(controllerName, ActionType.Approve);
    }

    async loadProperties(obj: any) {
        let id = obj?.id;
        this.structureId = id;
        this.obj.Url = '/admin/MSHighlight/GetListProperty/' + id;
        await this.render(this.obj);
    }

    loadComplete(): void {
        if (this.items) {
            if (this.router.url.indexOf('auto') < 0) {
                this.hasChild = true;
                this.items.forEach((item: any) => {
                    item['HasChild'] = true;
                });
            }
        }
        this.loaded.emit(this.itemData);

    }

    renderSubTable(item: any) {
        this.renderSubTableComponent(item, MSPropertiesChildComponent, {
            id: item._id,
            search: this.itemData?.Search,
        });
    }
    async export() {
        this.loadingText = 'Đang xuất dữ liệu...';
        this.loading = true;
        let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
        if (obj) {
            obj.Export = {
                Limit: obj.Paging.Total > 50000 ? 50000 : obj.Paging.Total,
                Type: ExportType.Excel,
            };
            obj.Paging.Index = 1;
            obj.Paging.Size = obj.Export.Limit;
        }
        await this.service.downloadFile('mshighlight', obj).toPromise().then(data => {
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
                    a.download = 'Export_text link_' + currentDate + '.' + extension;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        }, () => {
            ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
        });
        this.loadingText = null;
        this.loading = false;
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: '',
            rejectText: 'Hủy',
            confirmText: 'Lưu',
            confirmClose: true,
            title: 'Thêm giá trị thuộc tính',
            size: ModalSizeType.Large,
            object: AddPropertiesComponent,
            objectExtra: { structureId: this.structureId },
        }, () => this.loadItems());
    }

    addNewTextLink(id: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            title: 'Thêm text link',
            size: ModalSizeType.Medium,
            object: AddTextLinkComponent,
            resultText: 'Lưu và thêm tiếp',
            objectExtra: { propertyId: id },
        }, async () => {
            let item = this.originalItems.find(c => c['_id'] == id);
            this.renderSubTable(item);
        }, null, async () => {
            let item = this.originalItems.find(c => c['_id'] == id);
            this.renderSubTable(item);
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            confirmClose: true,
            title: 'Sửa giá trị thuộc tính',
            size: ModalSizeType.Large,
            object: AddPropertiesComponent,
            objectExtra: { id: item._id },
        }, () => this.loadItems());
    }

    editAuto(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            title: 'Sửa cú pháp',
            className: 'edit-syntax',
            size: ModalSizeType.Large,
            object: EditSyntaxComponent,
            objectExtra: { id: item._id },
        }, () => this.loadItems());
    }

    history(item: any) {
        // this.dialogService.WapperAsync({
        //     cancelText: 'Đóng',
        //     objectExtra: { id: item.Id },
        //     size: ModalSizeType.ExtraLarge,
        //     title: 'Lịch sử thao tác tag tin đăng',
        //     object: MSListTagHistoryComponent,
        // });
    }
    async delete(id: any) {
        if (id) {
            let Ids: string[] = [];
            Ids.push(id);
            let data = {
                'adminUserId': this.authen.account.Id,
                'ids': Ids,
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu thuộc tính này?', async () => {
                return await this.service.callApi('MSHighlight', 'DeleteProperty', data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa giá trị thuộc tính thành công');
                        this.loadItems();
                        return;
                    } ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            });
        } else {
            ToastrHelper.Error('Xóa thuộc tính không thành công');
            return;
        }
    }
    deleteAll(id: any) {
        if (id) {
            let data = {
                'adminUserId': this.authen.account.Id,
            };
            this.dialogService.ConfirmAsync('Có phải bạn muốn xóa: toàn bộ text link của thuộc tính này?', async () => {
                await this.service.callApi('MSHighlight', 'DeleteAllTextLink/' + id, data, MethodType.Post).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        if (result.Object >= 1) {
                            ToastrHelper.Success('Xóa toàn bộ text link thành công');
                            await this.loadItems();
                        } else if (result.Object == 0) {
                            ToastrHelper.Error('Không thực hiện được tác vụ do cấu trúc không có text link nào');
                        }
                        else {
                            ToastrHelper.Error('Xóa toàn bộ text link không thành công');
                        }
                    } else ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            })
        }
        else {
            ToastrHelper.Error('Xóa text link không thành công');
            return;
        }

    }

    quickView(item: any, type: string): void {
        if (this.allowVerify) {
            if (type && type == 'verified') {
                let origialItem: any = this.originalItems.find(c => c['_id'] == item['_id']);
                if (origialItem.status == 1) origialItem.status = 2;
                else origialItem.status = 1;
                let data = {
                    'status': origialItem.status,
                    'adminUserId': this.authen.account.Id,
                };
                this.service.callApi('MSHighlight', 'UpdateStatusProperty/' + item._id, data, MethodType.Post).then(async (result) => {
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