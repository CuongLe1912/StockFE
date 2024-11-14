import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OrderType } from "../../../_core/domains/enums/order.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MGAnnouncedEntity } from "../../../_core/domains/entities/meeygroup/mg.announced.entity";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { MGAnnouncedStatusType } from "../../../_core/domains/entities/meeygroup/enums/mg.announced.type";
import { ResultType } from "../../../_core/domains/enums/result.type";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ResultApi } from "../../../_core/domains/data/result.api";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class AnnouncedComponent extends GridComponent implements OnInit {
    approveCheck: boolean;
    obj: GridData = {
        Actions: [
            {
                icon: 'la la-check',
                name: ActionType.Approve,
                systemName: ActionType.Approve,
                className: 'btn btn-success',
                hidden: (item: any) => {
                    return !(item.CategoryId == 8 && item.Status == MGAnnouncedStatusType.Pending)
                },
                click: (item: any) => {
                    this.approve(item);
                }
            },
            {
                icon: 'la la-rotate-right',
                name: 'Hoàn Duyệt',
                systemName: ActionType.Approve,
                className: 'btn btn-success',
                hidden: (item: any) => {
                    return !(item.CategoryId == 8 && (item.Status == MGAnnouncedStatusType.Reject || item.Status == MGAnnouncedStatusType.Success))
                },
                click: (item: any) => {
                    this.approve(item);
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                click: (item: any) => {
                    this.edit(item);
                }
            },
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                click: (item: any) => {
                    this.view(item);
                }
            },

            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                systemName: ActionType.Delete,
                className: 'btn btn-danger',
                click: (item: any) => {
                    this.delete(item);
                }
            },
        ],
        Imports: [],
        Exports: [],
        Reference: MGAnnouncedEntity,
        CustomFilters: ['CategoryId', 'PublishDate', 'Status']
    };

    constructor() {
        super();
        this.setOrder([{ Name: 'Id', Type: OrderType.Desc }]);
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Link', Title: 'Đường dẫn/Tệp', Type: DataType.String,
                Format: (item: any) => {
                    return item.Link || item.File
                }
            },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image },
            { Property: 'TitleVn', Title: 'Tiêu đề - Tiếng Việt', Type: DataType.String },
            { Property: 'TitleEn', Title: 'Tiêu đề - Tiếng Anh', Type: DataType.String },
            {
                Property: 'CategoryVn', Title: 'Chuyên mục', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderInformationFormat([
                        item.CategoryVn,
                        item.CategoryEn
                    ]);
                }
            },
            {
                Property: 'StatusType', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: MGAnnouncedEntity) => {
                    // item['StatusType'] = item.Status; 
                    if (item.Status != null && item.Status != undefined && item.Status > 0) {
                        let option: OptionItem = ConstantHelper.MG_ANNOUNCED_STATUS_TYPES.find((c) => c.value == item.Status);
                        let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                        return text;
                    }
                    return '';
                })
            },
            { Property: 'PublishDate', Title: 'Ngày công bố', Type: DataType.DateTime },
        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/announced',
        };
        this.router.navigate(['/admin/meeygroup/announced/add'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/announced',
        };
        this.router.navigate(['/admin/meeygroup/announced/view'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/announced',
        };
        this.router.navigate(['/admin/meeygroup/announced/edit'], { state: { params: JSON.stringify(obj) } });
    }
    approve(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: {
                approve: true,
                item: item
            },
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/announced',
        };
        this.router.navigate(['/admin/meeygroup/announced/approve'], { state: { params: JSON.stringify(obj) } });
    }
    delete(id: any) {
        if (typeof (id) == 'object') {
            id = id.Id;
        }
        this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu này?', () => {
            this.service.delete('mgannounced', id).then((result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    ToastrHelper.Success('Xóa thông báo thành công');
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });

    }
}