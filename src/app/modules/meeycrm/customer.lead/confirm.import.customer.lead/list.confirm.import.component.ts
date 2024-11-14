import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { ListConfirmImportCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';

@Component({
    selector: 'mcrm-list-import-lead',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMListConfirmImportLeadComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HidePaging: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.ExtraLarge,
        Reference: ListConfirmImportCustomerLeadEntity,
    };
    @Input() items: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Index', Title: 'STT', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Name', Title: 'Họ Tên', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Email', Title: 'Email', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'IdCard', Title: 'CMND', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Birthday', Title: 'Ngày sinh', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Gender', Title: 'Giới tính', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'AddressText', Title: 'Địa chỉ', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) =>{
                    let text = '';
                    if (item.Address || item.Ward || item.District || item.City) {
                        let address: string[] = [];
                        if (item?.Address) address.push(item.Address);
                        if (item?.Ward) address.push(item.Ward);
                        if (item?.District) address.push(item.District);
                        if (item?.City) address.push(item.City);
                        text += '<p>' + address.join(', ') + '</p>'
                    }
                    return text;
                })
            },
            {
                Property: 'CustomerType', Title: 'Đối tượng', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (item: any) => {
                    let text = '';
                    if(item.Status == 1) text ='<p class="kt-badge kt-badge--inline kt-badge--success">Thành công</p>';
                    if(item.Status == 2) text ='<p class="kt-badge kt-badge--inline kt-badge--danger">Không thành công</p>'
                    return text;
                }
            },
            {
                Property: 'Description', Title: 'Mô tả', DisableOrder: true, Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text = '';
                    if(item.Content) text = '<p class="kt-badge kt-badge--inline kt-badge--danger">' + item.Content + '</p>';
                    // if (item.hasError)
                    //     text = '<p class="kt-badge kt-badge--inline kt-badge--danger">' + item.Content + '</p>';
                    return text;
                }
            },
        ];
    }

    async ngOnInit() {
        this.renderItems(this.items);
    }
}