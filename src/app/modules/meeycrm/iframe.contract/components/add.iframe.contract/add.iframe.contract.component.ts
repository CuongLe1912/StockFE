import { AppInjector } from '../../../../../app.module';
import { MeeyCrmService } from '../../../meeycrm.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { MLUserService } from '../../../../../modules/meeyuser/user.service';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { MCRMIFameSaleType } from '../../../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type';
import { MCRMIframeContractEntity } from '../../../../../_core/domains/entities/meeycrm/mcrm.ifame.contract.entity';

@Component({
  selector: 'app-add.iframe.contract',
  templateUrl: './add.iframe.contract.component.html',
  styleUrls: ['./add.iframe.contract.component.scss']
})
export class MCRMAddIframeContractComponent implements OnInit {
  id: number;
  @Input() params: any;
  viewer: boolean = false;
  serviceUser: MLUserService;
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  item: MCRMIframeContractEntity = new MCRMIframeContractEntity();

  service: MeeyCrmService;

  constructor() {
    this.service = AppInjector.get(MeeyCrmService);
    this.serviceUser = AppInjector.get(MLUserService);
  }

  async ngOnInit() {
    this.viewer = this.params && this.params['viewer'] ? true : false;
    this.id = this.params && this.params['id'];
    await this.loadItem();
  }

  async loadItem() {
    this.item = new MCRMIframeContractEntity();
    this.item.SaleType = MCRMIFameSaleType.Sale
    
    if (this.id) {
      await this.service.item('MCRMIframeContract', this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MCRMIframeContractEntity, result.Object);
        } else {
          ToastrHelper.ErrorResult(result);
        }
      });
      // khi edit set trường note null
      this.item.Note = ''
    }
  }
  async searchItem() {
    let result = await this.serviceUser.getByPhoneOrEmail(this.item.Search);
    if (ResultApi.IsSuccess(result) && result.Object) {
      this.item.PartnerMeeyId = result.Object.MeeyId
      this.item.RefCode = result.Object.RefCode
      this.item.PartnerName = result.Object.Name
      this.item.Phone = result.Object.Phone
      this.item.Email = result.Object.Email
    }else{
      this.item.Search = '';
      this.item.PartnerMeeyId = ''
      this.item.RefCode = ''
      this.item.PartnerName = ''
      this.item.Phone = ''
      this.item.Email = ''
      ToastrHelper.Warning('Không tìm thấy thông tin!');
    }
  }
  clearItem(search : string){
    if(search == ''){
      this.item.PartnerMeeyId = ''
      this.item.RefCode = ''
      this.item.PartnerName = ''
      this.item.Phone = ''
      this.item.Email = ''
    }
    
  }
  async confirm() {
    let columns = ['ContractName', 'CompanyName', 'IframeCode', 'ExpireDate', 'Domain', 'Attachments', 'SaleId'];
    if (this.item.Id) {
      columns.push('Note');
    } else {
      columns.push('StartDate');
    }
    if(this.item.SaleType == 2){
      this.item.SaleId = 0;
      columns = columns.filter(column => column !== 'SaleId');
    }
    if(this.item.SaleType == 2 && (this.item.Email == '' || this.item.Email == undefined)){
      ToastrHelper.Error('Bạn phải nhập cộng tác viên!');
      return false;
    }
    if (await validation(this.item, columns)) {
      if (this.item.Domain) {
        let firstCharacters = this.item.Domain.charAt(0);
        let lastCharacter = this.item.Domain.charAt(this.item.Domain.length - 1);
        if (firstCharacters == '.' || firstCharacters == '-' || lastCharacter == '.' || lastCharacter == '-') {
          ToastrHelper.Error('Domain không được phép bắt đầu hoặc kết thúc bằng dấu [.] hoặc [-]');
          return false;
        }
      }
      if (this.item.Attachments) {
        let files = await this.uploadFile.upload();
        this.item.Attachments = files.map(c => c.Path)[0];
      }

      return await this.service.callApi('MCRMIframeContract', 'AddOrUpdate', this.item, MethodType.Put).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let message = this.item.Id
            ? 'Cập nhật hợp đồng iframe thành công'
            : 'Thêm mới hợp đồng iframe thành công';
          ToastrHelper.Success(message);
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }
    return false;
  }

}
