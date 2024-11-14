import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../domains/data/grid.data";
import { DataType } from "../../../domains/enums/data.type";
import { CompareType } from "../../../domains/enums/compare.type";
import { ModalSizeType } from "../../../domains/enums/modal.size.type";
import { GridComponent } from "../../../components/grid/grid.component";
import { LogActivityEntity } from "../../../domains/entities/log.activity.entity";

@Component({
    templateUrl: '../../grid/grid.component.html',
})
export class HistoryComponent extends GridComponent implements OnInit {
    id: number;
    @Input() params: any;

    obj: GridData = {
        IsPopup: true,
        UpdatedBy: false,
        HideHeadActions: true,
        Size: ModalSizeType.Large,
        Reference: LogActivityEntity,
    };

    constructor() {
        super();
    }

    ngOnInit() {
        let id = this.params && this.params['id'],
            controller = this.params && this.params['type'];
        this.itemData = {
            Filters: [
                { Name: 'ObjectId', Value: id, Compare: CompareType.S_Equals },
                { Name: 'Controller', Value: controller, Compare: CompareType.S_Equals },
            ]
        }
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Url', Title: 'Url', Type: DataType.String },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            {
                Property: 'FullName', Title: 'Thông tin', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.FullName + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            {
                Property: 'Controller', Title: 'Hành động', Type: DataType.String,
                Format: ((item: any) => {
                    let action = (item.Url as string).toLowerCase();
                    if (action.indexOf('/user/lock/') >= 0) return 'Khóa tài khoản';
                    else if (action.indexOf('/user/unlock/') >= 0) return 'Mở khóa tài khoản';
                    else if (action.indexOf('/updateusers') >= 0) return 'Cập nhật nhân viên';
                    else if (action.indexOf('/updatepermissions') >= 0) return 'Cập nhật quyền';
                    return 'Sửa thông tin';
                })
            },
            { Property: 'Ip', Title: 'IP', Type: DataType.String },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}