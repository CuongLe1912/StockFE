import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { EditCompanyComponent } from "./edit.company/edit.company.component";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MCRMCompanyEntity } from "../../../_core/domains/entities/meeycrm/mcrm.company.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CompanyComponent extends GridComponent {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Size: ModalSizeType.Large,
        Reference: MCRMCompanyEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Thông tin doanh nghiệp', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Name + '</p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            {
                Property: 'Leader', Title: 'Thông tin người đại diện', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Leader + '</p>';
                    if (item.LeaderPhone) text += '<p><i class=\'la la-phone\'></i> ' + item.LeaderPhone + '</p>';
                    if (item.LeaderEmail) text += '<p><i class=\'la la-inbox\'></i> ' + item.LeaderEmail + '</p>';
                    return text;
                })
            },
            { Property: 'TaxCode', Title: 'Mã số thuế', Type: DataType.String },
            { Property: 'Website', Title: 'Website', Type: DataType.String },
            {
                Property: 'Address', Title: 'Địa chỉ', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Ward) '<span>' + item.Ward + '</span>';
                    if (item.District) '<span>' + item.District + '</span>';
                    if (item.City) '<span>' + item.City + '</span>';
                    if (item.Address) text += '<p>' + item.Address + '</p>';
                    return text;
                })
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Thêm mới',
            object: EditCompanyComponent,
            size: ModalSizeType.ExtraLarge,
        }, async () => {
            this.loadItems();
        });
    }

    edit(item: MCRMCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditCompanyComponent,
        }, async () => {
            this.loadItems();
        });
    }
}