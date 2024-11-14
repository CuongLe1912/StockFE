import { AppInjector } from "../../../../app.module";
import { MeeyCrmService } from "../../meeycrm.service";
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ResultType } from "../../../../_core/domains/enums/result.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { CompareType } from "../../../../_core/domains/enums/compare.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditCustomerContactComponent } from "../edit.customer.contact/edit.customer.contact.component";
import { MCRMCustomerContactEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.contact.entity";

@Component({
    selector: 'mcrm-customer-contact',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerContactComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        Actions: [
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Empty,
                className: 'btn btn-primary',
                hidden: (item: MCRMCustomerContactEntity) => {
                    return !item.AllowDelete;
                },
                click: (item: any) => {
                    this.edit(item);
                }
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                hidden: (item: MCRMCustomerContactEntity) => {
                    return !item.AllowDelete;
                },
                click: (item: any) => {
                    this.delete(item.Id)
                }
            }
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: ActionType.AddNew,
                className: 'btn btn-primary',
                systemName: ActionType.Empty,
                click: () => {
                    this.addNew();
                }
            }
        ],
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCustomerContactEntity,
    };
    @Input() id: number;
    @Input() viewer: boolean;
    apiService: MeeyCrmService;

    constructor() {
        super();
        this.apiService = AppInjector.get(MeeyCrmService);
        this.properties = [
            { Property: 'Name', Title: 'Tên', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.FilterData = [
                {
                    Value: this.id,
                    Name: 'MCRMCustomerId',
                    Compare: CompareType.N_Equals
                }
            ]
        }
        if (this.viewer) {
            this.obj.Actions = [];
            this.obj.HideHeadActions = true;
        }
        await this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Thêm mới',
            size: ModalSizeType.Medium,
            objectExtra: {
                customerId: this.id,
            },
            object: EditCustomerContactComponent,
        }, async () => {
            this.loadItems();
        });
    }

    delete(id: any) {
        if (typeof (id) == 'object') {
            id = id.Id;
        }
        this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu liên hệ này?', () => {
            this.apiService.deleteContact(id).then((result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    edit(item: MCRMCustomerContactEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: {
                id: item.Id,
                customerId: item.MCRMCustomerId,
            },
            object: EditCustomerContactComponent,
        }, async () => {
            this.loadItems();
        });
    }
}