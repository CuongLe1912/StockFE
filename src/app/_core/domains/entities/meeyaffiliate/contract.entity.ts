import { LookupData } from '../../data/lookup.data';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { FileDecorator } from '../../../../_core/decorators/file.decorator';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { BooleanDecorator } from '../../../../_core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { MAFContractSignStatus, MAFContractStatus, MAFContractType } from './enums/contract.type';
import { StringType, DateTimeType, BooleanType } from '../../../../_core/domains/enums/data.type';


@TableDecorator()
export class MAFContractEntity extends BaseEntity {
	@StringDecorator({ label: "Code", type: StringType.Text })
	Code: string;

	@StringDecorator({ label: "Khách hàng", placeholder: "SĐT, Email, MeeyId, Mã Ref", type: StringType.Text, max: 100 })
	Customer: string;

	@StringDecorator({ label: "Họ và tên", required: true, type: StringType.Text, max: 100 })
	Name: string;

	@StringDecorator({ label: "Số điện thoại", required: true, type: StringType.PhoneText, max: 10, min: 10 })
	Phone: string;

	@StringDecorator({ label: "Email", required: true, type: StringType.Email, max: 100 })
	Email: string;

	@StringDecorator({ label: "MeeyId", type: StringType.Text })
	MeeyId: string;

	@StringDecorator({ label: "Số CCCD", required: true, type: StringType.Number, max: 15 })
	IdCard: string;

	@StringDecorator({ label: "Địa chỉ", required: true, type: StringType.Text, max: 100 })
	Address: string;

	@StringDecorator({ label: "Mã số thuế", required: true, type: StringType.Number, max: 15 })
	TaxCode: string;

	@ImageDecorator({ label: 'CCCD mặt trước', required: true, url: 'upload/MGUpload' })
	FontCard: string;

	@ImageDecorator({ label: 'CCCD mặt sau', required: true, url: 'upload/MGUpload' })
	BackCard: string;

	@StringDecorator({ label: "Chức vụ nắm giữ", required: true, type: StringType.Text, max: 100 })
	Position: string;

	@BooleanDecorator({ label: "Loại đối tượng", type: BooleanType.RadioButton, required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_TYPES } })
	Type: MAFContractType;

	@DropDownDecorator({ label: "Loại đối tượng", required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_TYPES } })
	FilterType: MAFContractType;

	@DropDownDecorator({ label: "Trạng thái ký online", required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_SIGN_STATUS_TYPES } })
	SignStatus: MAFContractSignStatus;

	@DateTimeDecorator({ label: 'Ngày ký', required: true, type: DateTimeType.Date })
	DateOfSign: Date;

	@DateTimeDecorator({ label: 'Ngày cấp', required: true, type: DateTimeType.Date })
	DateOfIssue: Date;

	@DateTimeDecorator({ label: 'Ngày duyệt', type: DateTimeType.DateTime })
	DateOfApprove: Date;

	@DateTimeDecorator({ label: 'Ngày tạo', required: true, type: DateTimeType.DateTime })
	CreatedDate?: Date;

	@StringDecorator({ label: "Tên doanh nghiệp", required: true, type: StringType.Text, max: 100 })
	BusinessName: string;

	@StringDecorator({ label: "Nơi cấp", required: true, type: StringType.Text, max: 100 })
	PlaceOfIssue: string;

	@StringDecorator({ label: "Số điện thoại", required: true, type: StringType.PhoneText, max: 12, min: 10 })
	BusinessPhone: string;

	@FileDecorator({ label: 'Giấy ĐKKD', required: true, url: 'upload/MGUpload', accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Định dạng: pdf, doc, docx...' })
	CertificateLetter: string;

	@FileDecorator({ label: 'Giấy ủy quyền', url: 'upload/MGUpload', accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Định dạng: pdf, doc, docx...' })
	AuthorizationLetter: string;

	@StringDecorator({ label: "Giấy ủy quyền số", required: true, type: StringType.Number, max: 100 })
	AuthorizationNumber: string;

	@DropDownDecorator({ label: "Trạng thái", required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_STATUS_TYPES } })
	Status: MAFContractStatus;

	@DropDownDecorator({ label: 'Người xác nhận', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email') })
	SaleOrSupport: string;

	@StringDecorator({ required: true, label: 'Ghi chú/lý do', type: StringType.MultiText, max: 500 })
	Reason: string;

	@BooleanDecorator({ label: 'Đã nhận được hợp đồng có chữ ký', type: BooleanType.Checkbox, required: true })
	ContractSigned: boolean;

	@FileDecorator({ label: 'Hợp đồng', required: true, url: 'upload/MAFUploadContract', accept: 'application/pdf', description: 'Định dạng: pdf.' })
	File: string;

	@FileDecorator({ label: 'Hợp đồng', required: true, url: 'upload/MAFUploadContract', accept: 'application/pdf', description: 'Định dạng: pdf.' })
	FileEdit: string;
}
