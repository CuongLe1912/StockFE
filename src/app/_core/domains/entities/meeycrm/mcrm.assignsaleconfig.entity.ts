import { TreeviewItem } from "ngx-treeview";
import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class AssignSaleConfig extends BaseEntity{

    Id?: number;

    IsProduct: boolean;

    @StringDecorator({ required: true, label:"Ghi chú", placeholder: 'Nhập lý do thêm mới Phòng/ Ban vào danh sách', type:StringType.Text, max: 500 })
    Note: string;

    Data:DeparmentData[];
    
    IsActive: boolean;

}
export class DeparmentData extends BaseEntity{
    Ids:string = '';
    DepartmentId: number = 0;
    ActiveNewMember: boolean = false;
    Note:string = ''
}
export class TreeAssignSale{
    
    data : TreeviewItem[] = []
    activeNewMember : boolean
    showActive : boolean = false
    note : string
}