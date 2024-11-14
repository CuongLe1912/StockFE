import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { AppInjector } from '../../../../../app.module';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MAFAffiliateSyntheticEntity } from '../../../../../_core/domains/entities/meeyaffiliate/affiliate.synthetic.entity';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MAFAffiliateService } from '../../../affiliate/affiliate.service';

@Component({
  selector: 'app-approve.invoice',
  templateUrl: './approve.invoice.component.html',
  styleUrls: ['./approve.invoice.component.scss']
})
export class MAFApproveInvoiceComponent implements OnInit {
  @ViewChild('uploadXmlFile') uploadXmlFile: EditorComponent;
  @ViewChild('uploadPdfFile') uploadPdfFile: EditorComponent;
  @Input() params: any;

  item: any;
  invoice: MAFAffiliateSyntheticEntity;
  radioInvoice: any;
  errorMessage: string;

  currentDay;

  service: MAFAffiliateService

  constructor() {
    this.service = AppInjector.get(MAFAffiliateService);
  }

  ngOnInit() {
    this.item = this.params && this.params['item'];
    if (this.item?.Invoice) {
      if (!this.item.Invoice?.PdfFile && !this.item.Invoice?.XmlFile) {
        this.radioInvoice = 2;
        this.item.Invoice = null;
      }
    } else this.radioInvoice = 2;

    this.invoice = new MAFAffiliateSyntheticEntity();

    let date = new Date();
    this.currentDay = date.getDate();
  }

  public async confirm(): Promise<boolean> {
    this.errorMessage = null;
    let validator = false;
    if (this.radioInvoice) {
      if (this.radioInvoice == 1) {
        if (this.item.Invoice?.PdfFile || this.item.Invoice?.XmlFile) {
          validator = true;
        }
      } else if (this.radioInvoice == 2) {
        if (this.invoice.PdfFile || this.invoice.XmlFile) {
          validator = true;
        } else {
          this.errorMessage = 'Phải upload ít nhất 1 file hoá đơn!'
        }
      }
    } else this.errorMessage = 'Chọn hóa đơn để duyệt!'
    if (validator) {
      let obj = {
        XmlFile: '',
        PdfFile: '',
        Accountant: '',
        Year: this.item.Year,
        Month: this.item.Month,
        NodeId: this.item.NodeId,
        AcceptSent: this.radioInvoice == 1,
      }
      if (this.radioInvoice == 2) {
        if (this.invoice.XmlFile) {
          let xmlFile = await this.uploadXmlFile.upload();
          obj.XmlFile = xmlFile && xmlFile.length > 0 ? xmlFile[0].Path : '';
        }
        if (this.invoice.PdfFile) {
          let pdfFile = await this.uploadPdfFile.upload();
          obj.PdfFile = pdfFile && pdfFile.length > 0 ? pdfFile[0].Path : '';
        }
      } else {
        if (this.item.Invoice?.XmlFile)
          obj.XmlFile = this.item.Invoice?.XmlFile
        if (this.item.Invoice?.PdfFile)
          obj.PdfFile = this.item.Invoice?.PdfFile
      }

      return await this.service.callApi("MAFAffiliateSynthetic", "ApproveInvoice", obj, MethodType.Post).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Duyệt hóa đơn thành công');
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }
    return false;
  }

  getFileName(file) {
    return UtilityExHelper.getFileName(file);
  }

}
