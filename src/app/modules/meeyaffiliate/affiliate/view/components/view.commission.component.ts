import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from "../../../../../_core/helpers/app.config";
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { OptionItem } from "../../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { ModalSizeType } from "../../../../../_core/domains/enums/modal.size.type";
import { MafAffiliateEntity } from "../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity";
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';

@Component({
  selector: 'maf-view-commission',
  templateUrl: '../../../../../_core/components/grid/grid.component.html',
  styleUrls: [
    './view.component.scss',
  ],
})
export class MAFViewCommissionComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    NotKeepPrevData: true,
    HideCustomFilter: true,
    InlineFilters: ['Month'],
    Reference: MafAffiliateEntity,
    PageSizes: [5, 10, 20, 50, 100],
  };
  @Input() item: any;

  constructor() {
    super();
    this.properties = [
      { Property: 'Month', Title: 'Tháng', Type: DataType.String },
      { Property: 'ManageAmount', Title: 'Doanh số Cấp bậc (F1..Fn)', Type: DataType.Number, Align: 'right' },
      { Property: 'ManageCommission', Title: 'Hoa hồng Cấp bậc (F1..Fn)', Type: DataType.Number, Align: 'right' },
      {
        Property: 'F1Amount', Title: 'Doanh số F1', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.F1Amount) return ''
          return item.F1Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'Commission', Title: 'Hoa hồng F1', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.Commission) return ''
          return item.Commission.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'PayAmount', Title: 'Thực nhận F1', Type: DataType.String, Align: 'right', Tooltip: 'Khấu trừ Thuế TNCN 10% với hoa hồng lớn hơn 2 triệu',
        Format: ((item: any) => {
          if (!item.PayAmount) return ''
          return item.PayAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'Status', Title: 'Trạng thái', Type: DataType.String,
        Format: ((item: any) => {
          let option: OptionItem = ConstantHelper.MAF_STATUS_COMMISSION_TYPES.find((c) => c.value == item.Status);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          if (item.Message) {
            text += '<p class="error">' + item.Message + '</p>';
          }
          return text
        })
      },
      { Property: 'PaymentInfomation', Title: 'Tài khoản nhận tiền', Type: DataType.String },
      { Property: 'PaymentDateTime', Title: 'Ngày thanh toán', Type: DataType.DateTime, Align: 'center' },
      {
        Property: 'TransactionId', Title: 'Mã GD', Type: DataType.String,
        Format: ((item: any) => {
          if (!item.TransactionId) return '';
          if (item.PaymentInfomation.includes('TKKM1')) {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.TransactionId;
            return `<a href="${url}" target="_blank">${item.TransactionId}</a>`
          } else {
            return item.TransactionId;
          }
        })
      },
      {
        Property: 'InvoiceText', Title: 'Hóa đơn', Type: DataType.String,
        Format: ((item: any) => {
          if (!item.Invoice) return ''
          let text = '';
          if (item.Invoice?.PdfFile) text += '<p><a href="' + item.Invoice?.PdfFile + '" target="_blank">' + UtilityExHelper.getFileName(item.Invoice?.PdfFile) + '</a></p>';
          if (item.Invoice?.XmlFile) text += '<p><a href="' + item.Invoice?.XmlFile + '" target="_blank">' + UtilityExHelper.getFileName(item.Invoice?.XmlFile) + '</a></p>';
          if (item.Invoice?.Accountant) text += '<p>' + item.Invoice?.Accountant + '</p>';
          if (item.Invoice?.DateOfApprove) text += '<p>' + UtilityExHelper.dateTimeString(item.Invoice?.DateOfApprove, true) + '</p>';
          return text;
        })
      },
    ];
  }

  async ngOnInit() {
    this.setPageSize(20);
    this.obj.Url = '/admin/MAFAffiliate/CommissionItems/' + this.item.Id;
    this.render(this.obj);
  }
}