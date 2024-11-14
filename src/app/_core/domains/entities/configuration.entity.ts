import { BaseEntity } from "./base.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { StringType } from "../enums/data.type";

@TableDecorator()
export class ConfigurationEntity extends BaseEntity {
    @BooleanDecorator({ label: 'Đồng bộ bản đồ'} )
    SyncMeeyMap: boolean;
    
    @BooleanDecorator({ label: 'Đồng bộ tài khoản' })
    SyncMeeyUser: boolean;

    @NumberDecorator({ label: 'Số lượng bản ghi' })
    AmountMeeyUser: number;

    @NumberDecorator({ label: 'Bản ghi đồng bộ' })
    LastIdMeeyUser: number;
    
    @BooleanDecorator({ label: 'Đồng bộ tin đăng' })
    SyncMeeyArticle: boolean;

    @NumberDecorator({ label: 'Số lượng bản ghi' })
    AmountMeeyArticle: number;

    @NumberDecorator({ label: 'Bản ghi đồng bộ' })
    LastIdMeeyArticle: number;
    
    @BooleanDecorator({ label: 'Đồng bộ tài khoản CRM' })
    SyncMeeyCrm: boolean;

    @NumberDecorator({ label: 'Số lượng bản ghi' })
    AmountMeeyCrm: number;

    @NumberDecorator({ label: 'Bản ghi đồng bộ' })
    LastIdMeeyCrm: number;

    @NumberDecorator({ label: 'Bản ghi đồng bộ' })
    LastIdMeeyBank: number;
    
    @BooleanDecorator({ label: 'Đồng bộ giao dịch ngân hàng' })
    SyncMeeyBank: boolean;

    @StringDecorator({ label: 'Api tổng đài', max: 250 })
    VfoneApi: string;

    @StringDecorator({ label: 'Token tổng đài', max: 250 })
    VfoneApiKeyAccess: string;

    @StringDecorator({ label: 'Nguồn dữ liệu Zalo Mini', max: 250, type: StringType.Text })
    ZaloMiniPartnerKey: string;

    @StringDecorator({ label: 'Sale cho Zalo Mini', max: 250, type: StringType.Email })
    ZaloMiniSaleEmail: string;
}