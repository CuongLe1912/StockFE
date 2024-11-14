import { LookupData } from '../../data/lookup.data';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import {StringType, DateTimeType, NumberType} from '../../../../_core/domains/enums/data.type';
import { MAFContractStatus, MAFInvoiceStatus, MAFStatusPaymentType, MAFSyntheticContractStatus } from './enums/contract.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { FileDecorator } from '../../../../_core/decorators/file.decorator';

@TableDecorator()
export class MAFAffiliateSyntheticEntity extends BaseEntity {
    @StringDecorator({ label: "Khách hàng", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 100 })
    Customer: string;

    @StringDecorator({ label: "Khách hàng", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 100 })
    FilterCustomer: string;

    @StringDecorator({ label: "Từ nhánh của KH", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 100 })
    FilterParent: string;

    @DropDownDecorator({ label: 'Nhánh', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch') })
    BranchId: string;

    @DropDownDecorator({ label: 'Nhánh', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch') })
    FilterBranchId: string;

    @DropDownDecorator({ label: 'Trung tâm', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupCenterRank', null, null, 'BranchId') })
    RankId: string;

    @DropDownDecorator({ label: 'Trung tâm', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupCenterRank', null, null, 'FilterBranchId') })
    FilterRankId: string;

    @DropDownDecorator({ label: 'Tầng', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupLevel/[id]') })
    Level: number;

    @StringDecorator({ label: 'Họ tên', allowSearch: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DateTimeDecorator({ label: 'Tháng', type: DateTimeType.DateMonth, maxCurent: true })
    Month: string;

    @DateTimeDecorator({ label: 'Tháng', type: DateTimeType.DateMonth, maxCurent: true })
    FilterMonth: string;

    @DropDownDecorator({ label: "Trạng thái hợp đồng", required: true, multiple: true, lookup: { items: ConstantHelper.MAF_SYNTHETIC_CONTRACT_STATUS_TYPES } })
	FilterContractStatusId: MAFSyntheticContractStatus;

    @DropDownDecorator({ label: "Trạng thái thanh toán", required: true, lookup: { items: ConstantHelper.MAF_STATUS_PAYMENT_TYPES } })
	FilterPaymentStatusId: MAFStatusPaymentType;

    @DropDownDecorator({ label: "Hóa đơn", required: true, lookup: { items: ConstantHelper.MAF_INVOICE_STATUS_TYPES } })
	FilterInvoiceStatusId: MAFInvoiceStatus;

    @FileDecorator({ label: 'Hóa đơn pdf', required: true, url: 'upload/MGUpload', accept: 'application/pdf', description: 'Định dạng: Pdf.' })
	PdfFile: string;

    @FileDecorator({ label: 'Hóa đơn xml', required: true, url: 'upload/MGUpload', accept: 'application/xml', description: 'Định dạng: Xml.' })
	XmlFile: string;
}