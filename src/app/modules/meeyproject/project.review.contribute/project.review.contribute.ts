import * as _ from 'lodash';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { TableData } from '../../../_core/domains/data/table.data';
import { ActionData } from '../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { ViewProjectReviewContributeComponent } from './view/view.project.review.contribute.component';
import { MPOReviewContributeEntity } from '../../../_core/domains/entities/meeyproject/mpo.review.contribute';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MPOReviewContributeComponent extends GridComponent implements OnInit, OnDestroy {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                name: 'Xem',
                icon: 'la la-eye',
                className: 'btn btn-primary',
                systemName: ActionType.ViewDetail,
                controllerName: 'MPOReviewContribute',
                click: (item: any) => this.viewDetail(item.Id),
            },
        ],
        Features: [
            ActionData.reload(() => {
                this.loadItems();
            })
        ],
        UpdatedBy: false,
        NotKeepPrevData: true,
        Reference: MPOReviewContributeEntity,
        SearchText: 'Tìm kiếm Số điện thoại, Meey Id, Tên dự án',
        CustomFilters: ['Seen', 'FilterDateRange']
    };

    constructor() {
        super();
    }
    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, Align: 'center', DisableOrder: true },
            {
                Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true
            },
            {
                Property: 'MeeyId', Title: 'Meey Id', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = item?.MeeyId ? item.MeeyId : 'Ẩn danh';
                    return text;
                }
            },
            { Property: 'ProjectName', Title: 'Tên dự án', Type: DataType.String, DisableOrder: true },
            { Property: 'Content', Title: 'Mô tả', Type: DataType.String, DisableOrder: true },
            {
                Property: 'CreatedDate', Title: 'Ngày tạo', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (!item?.CreatedDate) return ''
                    return UtilityExHelper.dateTimeString(item.CreatedDate);
                })
            },
            {
                Property: 'Seen', Title: 'Tình trạng', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: (item: any) => {
                    let text = item?.Seen ? 'Đã xem' : 'Chưa xem';
                    return text;
                }
            },
        ];
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
                if (obj.Name == 'MPOReviewContribute') {
                    this.loadItems();
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    async viewDetail(id: string) {
        let allowAddNew = await this.authen.permissionAllow(ControllerType.MPOProject, ActionType.AddNew);
        this.dialogService.WapperAsync({
            cancelText: 'Thoát',
            objectExtra: { id: id },
            size: ModalSizeType.Medium,
            title: 'XEM THÔNG TIN ĐÓNG GÓP DỰ ÁN',
            object: ViewProjectReviewContributeComponent,
            confirmText: allowAddNew ? 'Tạo nhanh dự án' : '',
        }, async () => {
            setTimeout(() => {
                this.addNewProject();
            }, 300);
        });
    }

    addNewProject() {
        let obj: NavigationStateData = {
            viewer: false,
            object: {
                isAddNew: true,
            },
            prevData: this.itemData,
            prevUrl: "/admin/mpoproject",
        };
        this.router.navigate(["/admin/mpoproject/add"], {
            state: { params: JSON.stringify(obj) },
        });
    }
}
