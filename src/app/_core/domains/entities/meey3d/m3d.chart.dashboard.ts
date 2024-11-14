import { BaseEntity } from "../base.entity";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";

@TableDecorator()
export class M3DChartDashboardEntity extends BaseEntity{
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

    Day : string
}