import { BaseEntity } from "../base.entity";
import { DateTimeType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class M3DDashboardTourEntity extends BaseEntity{
    //Tên Tour
    Title : string
    //Lượt xem
    TotalView : number
    //Lượt thích
    TotalLike : number
    //Lượt chia sẻ
    TotalShare : number
    //Lượt gọi điện
    TotalCall : number
    //Người xem
    TotalDevice : number
    //Danh mục tour
    @DropDownDecorator({ label: 'Danh mục', lookup: { items: ConstantHelper.M3D_TOUR_CATEGORY_TYPE } })
    CategoryId : string
    //Lượt đăng kí tư vấn
    TotalSub : number 
    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime, max: new Date(), min: new Date(new Date().getDate() - 7) })
    CreatedAt : Date
}