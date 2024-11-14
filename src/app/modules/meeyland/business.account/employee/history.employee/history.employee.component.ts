import * as _ from 'lodash';
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MLEmployeeHistoryEntity } from '../../../../../_core/domains/entities/meeyland/ml.employee.entity';

@Component({
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MLHistoryEmployeeComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Actions: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HideHeadActions: true,
        Reference: MLEmployeeHistoryEntity,
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        let id = this.params && this.params['id'];
        this.itemData = {
            Paging: {
                Index: 1,
                Size: 10000,
            }
        };
        this.properties = [
            { Property: 'Action', Title: 'Hành động', Type: DataType.String },
            {
                Property: 'PrevStatus', Title: 'Trạng thái trước', Type: DataType.String,
                Format: ((item: any) => {
                    let text = item.PrevStatus;
                    switch (item.PrevStatus) {
                        case 'pending': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--warning">Chờ xác nhận</p>';
                            break;
                        case 'active': text = '<p style="padding: 5px ; width: 100px;" class="kt-badge kt-badge--inline kt-badge--success">Đã kích hoạt</p>';
                            break;
                        case 'canceled': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Hủy lời mời</p>';
                            break;
                        case 'rejected': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Từ chối</p>';
                            break;
                        case 'locked': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã khóa</p>';
                            break;
                        case 'deleted': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã xóa</p>';
                            break;
                    }
                    return text;
                })
            },
            {
                Property: 'CurentStatus', Title: 'Trạng thái sau', Type: DataType.String,
                Format: ((item: any) => {
                    let text = item.CurentStatus;
                    switch (item.CurentStatus) {
                        case 'pending': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--warning">Chờ xác nhận</p>';
                            break;
                        case 'active': text = '<p style="padding: 5px ; width: 100px;" class="kt-badge kt-badge--inline kt-badge--success">Đã kích hoạt</p>';
                            break;
                        case 'canceled': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Hủy lời mời</p>';
                            break;
                        case 'rejected': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Từ chối</p>';
                            break;
                        case 'locked': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã khóa</p>';
                            break;
                        case 'deleted': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã xóa</p>';
                            break;
                    }
                    return text;
                })
            },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            {
                Property: 'User', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text = item.User
                        ? '<p>' + this.replaceEmail(item.User) + '</p>'
                        : '<p>Không xác định</p>';
                    if (item.Type) text += '<p style="font-size: smaller;">' + item.Type + '</p>';
                    return text;
                })
            },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String }
        ];
        this.obj.Url = '/admin/mlemployee/history/' + id;
        this.render(this.obj);
    }

    private replaceEmail(email: string): string {
        if (email) {
            return email.replace('@xvnd.com', '')
                .replace('@mailinator.com', '')
                .replace('@meeyland.com', '')
                .replace('@maildrop.cc', '')
                .replace('@gmail.com', '');
        }
        return '';
    }
}