import { BaseEntity } from '../base.entity';
import { TableDecorator } from '../../../decorators/table.decorator';
import { StringType, NumberType, DateTimeType } from '../../enums/data.type';
import { StringDecorator } from '../../../decorators/string.decorator';
import { NumberDecorator } from '../../../decorators/number.decorator';
import { DateTimeDecorator } from '../../../decorators/datetime.decorator';
import { RegexType } from '../../enums/regex.type';


@TableDecorator()
export class MPInvoiceEntity extends BaseEntity {
	public static date: Date = new Date();
	public static MinDate: Date = new Date(MPInvoiceEntity.date.getFullYear(), MPInvoiceEntity.date.getMonth(), 1);
	public static MaxDate: Date = new Date(MPInvoiceEntity.date.getFullYear(), MPInvoiceEntity.date.getMonth() + 1, 0);

	@StringDecorator({ label: "Số hóa đơn", required: true, type: StringType.Text, max: 50, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
	Code: string;

	@StringDecorator({ label: "Mã giao dịch", required: true, type: StringType.Text, max: 50 })
	TransactionCode: string;

	@NumberDecorator({ label: "ParentId", required: true, type: NumberType.Numberic })
	ParentId: number;

	@NumberDecorator({ label: "UserInvoiceId", required: true, type: NumberType.Numberic })
	UserInvoiceId: number;

	@StringDecorator({ label: "Mã tiền thu", required: true, type: StringType.Text, max: 50 })
	RevenueCode: string;

	@NumberDecorator({ label: "Doanh thu trước thuế", required: true, type: NumberType.Text, min: 10000, maxDepend: 'Payment' })
	Amount: number;

	@NumberDecorator({ label: "Thuế GTGT", required: true, type: NumberType.Text, allowZero: true })
	VATMoney: number;

	@NumberDecorator({ label: "VATPercent", required: true, type: NumberType.Text })
	VATPercent: number;

	@NumberDecorator({ label: "Số tiền thanh toán", required: true, type: NumberType.Text, min: 10000 })
	Payment: number;

	@StringDecorator({ label: "Phương thức thanh toán", required: true, type: StringType.Text, max: 150 })
	PaymentMethod: string;

	@StringDecorator({ label: "Mã số thuế", type: StringType.Text, max: 50, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
	TaxCode: string;

	@StringDecorator({ label: "Khách hàng", required: true, type: StringType.Text, max: 150 })
	CustomerName: string;

	@StringDecorator({ label: "Mail nhận hóa đơn", required: true, type: StringType.Email, max: 50 })
	CustomerEmail: string;

	@StringDecorator({ label: "CustomerPhone", required: true, type: StringType.Text, max: 50 })
	CustomerPhone: string;

	@StringDecorator({ label: "Địa chỉ", required: true, type: StringType.Text, max: 150 })
	CustomerAddress: string;

	@StringDecorator({ label: "Ngân hàng", required: true, type: StringType.Text, max: 150 })
	BankName: string;

	@StringDecorator({ label: "Nội dung", required: true, type: StringType.Text, max: 200 })
	Content: string;

	@StringDecorator({ label: "Ghi chú", type: StringType.MultiText, max: 200 })
	Note: string;

	@NumberDecorator({ label: "Status", type: NumberType.Numberic })
	Status: number;

	@DateTimeDecorator({ label: "Ngày thanh toán", required: true, type: DateTimeType.Date, maxCurent: true })
	PaymentDate: Date;

	@DateTimeDecorator({ label: "Ngày xuất hóa đơn", required: true, type: DateTimeType.Date, min: MPInvoiceEntity.MinDate, max: MPInvoiceEntity.MaxDate })
	InvoiceDate: Date;

	@DateTimeDecorator({ label: "Ngày xuất hóa đơn", required: true, type: DateTimeType.Date })
	InvoiceDateSearch: Date;

	Childrens: MPInvoiceEntity[];

}
