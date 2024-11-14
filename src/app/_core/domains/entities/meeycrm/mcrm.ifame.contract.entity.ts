import { LookupData } from '../../data/lookup.data';
import { MCRMIFameSaleType } from './enums/mcrm.calllog.type';
import { MLPartnerCodeEntity } from '../meeyland/ml.partner.entity';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { FileDecorator } from '../../../../_core/decorators/file.decorator';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { BooleanDecorator } from '../../../../_core/decorators/boolean.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { StringType, DateTimeType, BooleanType } from '../../../../_core/domains/enums/data.type';


@TableDecorator()
export class MCRMIframeContractEntity extends BaseEntity {
    @StringDecorator({ label: "Mã hợp đồng", required: true, type: StringType.Text, max: 50 })
    ContractName: string;

    @StringDecorator({ label: "Sàn/Công ty", required: true, type: StringType.Text, max: 100 })
    CompanyName: string;

    @DropDownDecorator({ label: 'Mã đối tác', required: true, lookup: LookupData.Reference(MLPartnerCodeEntity, ['PartnerKey'], 'PartnerKey') })
    IframeCode: string;

    @DateTimeDecorator({ label: "Ngày bắt đầu", required: true, type: DateTimeType.Date, maxCurent: true })
    StartDate: Date;

    @DateTimeDecorator({ label: "Ngày hết hạn", required: true, type: DateTimeType.Date, minCurent: true, minDepend: 'StartDate' })
    ExpireDate: Date;

    @DateTimeDecorator({ label: "Thời gian gia hạn", type: DateTimeType.Date, minCurent: true, minDepend: 'StartDate', maxDepend: 'ExpireDate' })
    RenewalDate: Date;

    @StringDecorator({ label: "Link website Sàn/Công ty", type: StringType.Link, max: 100 })
    Domain: string;

    @StringDecorator({ label: "Ghi chú", required: true, type: StringType.MultiText, max: 500 })
    Note: string;

    @FileDecorator({ label: 'File hợp đồng', required: true, url: 'upload/MCrmUpload', size: 10, accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Định dạng: pdf, doc, docx...' })
    Attachments: string;

    @StringDecorator({ label: "MeeyId cộng tác viên", required: true, type: StringType.MultiText, max: 500 })
    PartnerMeeyId: string;

    @StringDecorator({ label: "RefCode cộng tác viên", required: true, type: StringType.MultiText, max: 500 })
    RefCode: string;

    @DropDownDecorator({ label: ' Nhân viên kinh doanh', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    // @DropDownDecorator({ label: ' Cộng tác viên', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    // SalePartner: number;
    
    @StringDecorator({ label: 'Tìm kiếm', type: StringType.Text, min: 10, max: 250 })
    Search: string;

    @BooleanDecorator({ label: ' Người phụ trách', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.MCRM_SALE_TYPES) })
    SaleType: MCRMIFameSaleType;

    @StringDecorator({ label: 'Họ tên', allowSearch: true, type: StringType.Text, max: 50 })
    PartnerName: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 50 })
    Phone: string;

    @StringDecorator({ label: 'Email',required: true, type: StringType.Email, min: 10, max: 50 })
    Email: string;

    @StringDecorator({ label: 'Mã Affiliate của đối tác',required: true, type: StringType.Code, max: 10 })
    IframeRefCode: string;
}
