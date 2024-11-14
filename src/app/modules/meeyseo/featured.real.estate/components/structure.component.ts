import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { AddStructureComponent } from '../add.structure/add.structure.component';
import { PagingPositionType } from '../../../../_core/domains/enums/paging.position.type';
import { MSStructureEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    selector: 'ms-structure-component',
    styleUrls: ['./structure.component.scss'],
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MSStructureComponent extends GridComponent implements OnInit {
    prevId: string;
    type: number = 1;
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [],
        IsPopup: true,
        MoreActions: [
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
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
        Features: [
            {
                name: 'Thêm mới',
                icon: 'la la-plus',
                tooltip: 'Thêm mới',
                click: () => this.addNew(),
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
                controllerName: 'msseotextlinkmanual',
            },
            {
                tooltip: 'Sắp xếp',
                icon: 'la la-sort-alpha-desc',
                click: () => this.sortOrder(),
                className: 'btn btn-warning',
                systemName: ActionType.Empty,
            },
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        NotKeepPrevData: true,
        ClassName: 'grid-structure',
        Reference: MSStructureEntity,
        CustomFilters: ['FilerType'],
        SearchText: 'Tìm kiếm cấu trúc',
        PagingPositionType: PagingPositionType.Bottom,
    };
    seoService: MSSeoService;
    @Output() loaded: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        super();
    }
    async ngOnInit() {
        this.properties = [
            {
                Property: 'name', Title: 'Chủ đề', Type: DataType.String,
                Format: (item) => {
                    let text = '<div class="structure-item"><p title="' + item.name + '">' + item.name + '</p>';
                    if (item?.priority && this.router.url.indexOf('auto') < 0) text += '<span>' + item.priority + '</span>';
                    text += '</div>';
                    return text;
                },
                Click: (item) => {
                    this.prevId = item._id;
                    let ids = this.items.map(c => c['_id']);
                    this.loaded.emit({ allIds: ids, id: item._id });
                }
            }
        ]
        if (this.router.url.indexOf('auto') >= 0) {
            this.type = 2;
            this.obj.Features = this.obj.Features.filter(c => c.systemName != ActionType.AddNew);
            this.obj.MoreActions = this.obj.MoreActions.filter(c => c.systemName != ActionType.Edit && c.systemName != ActionType.Delete);
        }
        this.obj.Url = '/admin/MSHighlight/GetListStructure?type=' + this.type;
        await this.render(this.obj);
        this.breadcrumbs = [];

        this.event.RefreshSubGrids.subscribe((key: string) => {
            if (key == 'Structures') {
                this.loadItems();
            }
        });
    }

    loadComplete(): void {
        if (this.items && this.items.length > 0) {
            if (this.itemData.Paging.Index == 1) {
                let item = this.prevId 
                    ? this.items.find(c => c['_id'] == this.prevId)
                    : this.items[0];
                if (item) {
                    let id = item["_id"],
                        ids = this.items.map(c => c['_id']);

                    item['rowClicked'] = true;
                    if (id != this.prevId) {
                        this.prevId = id;
                        this.loaded.emit({ id: id, allIds: ids });
                    }
                }
            }
        } else {
            this.loaded.emit({ id: null, allIds: null });
        }
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            title: 'Sửa cấu trúc',
            size: ModalSizeType.Medium,
            object: AddStructureComponent,
            objectExtra: { id: item._id },
        }, () => this.loadItems(), null, async () => {
            this.loadItems();
        });
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Lưu',
            title: 'Thêm mới cấu trúc',
            size: ModalSizeType.Medium,
            resultText: 'Lưu và thêm tiếp',
            object: AddStructureComponent,
        }, () => this.loadItems(), null, async () => {
            this.loadItems();
        });
    }
    async sortOrder() {
        let item = this.activeProperties.find(c => c.Property == 'name')
        this.sort(item);
    }
    async delete(id: any) {
        if (id) {
            let Ids: string[] = [];
            Ids.push(id);
            let data = {
                'adminUserId': this.authen.account.Id,
                'ids': Ids,
            };
            this.dialogService.Confirm('Có phải bạn muốn xóa cấu trúc này?', async () => {
                return await this.service.callApi('MSHighlight', 'DeleteStructure', data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa cấu trúc thành công');
                        this.loadItems();
                        return;
                    } ToastrHelper.ErrorResult(result);
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                });
            });
        } else {
            ToastrHelper.Error('Xóa cấu trúc không thành công');
            return false;
        }
    }
}