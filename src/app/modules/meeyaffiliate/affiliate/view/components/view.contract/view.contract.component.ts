import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { MAFAffiliateService } from '../../../affiliate.service';
import { AppConfig } from '../../../../../../_core/helpers/app.config';
import { EntityHelper } from '../../../../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../../../_core/domains/data/navigation.state';
import { ActionType, ControllerType } from '../../../../../../_core/domains/enums/action.type';
import { MAFContractEntity } from '../../../../../../_core/domains/entities/meeyaffiliate/contract.entity';
import { MAFContractSignStatus, MAFContractStatus, MAFContractType } from '../../../../../../_core/domains/entities/meeyaffiliate/enums/contract.type';

@Component({
  selector: 'maf-view-contract',
  templateUrl: './view.contract.component.html',
  styleUrls: ['./view.contract.component.scss']
})
export class MAFViewContractComponent extends EditComponent implements OnInit {
  @Input() item: any;

  statusText: string;
  isReject: boolean = false;
  isApprove: boolean = false;
  isSignStatus: boolean = false;
  isBusinesses: boolean = false;
  allowEditContract: boolean = true;
  allowApproveContract: boolean = true;

  constructor(public service: MAFAffiliateService) {
    super();
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    if (this.item) {
      let MeeyId = this.item.MeeyId;
      let itemAffililate = _.cloneDeep(this.item);
      this.item = EntityHelper.createEntity(MAFContractEntity, this.item?.Contract);
      this.item.MeeyId = MeeyId;

      if (this.item?.Type == MAFContractType.Businesses) {
        this.isBusinesses = true;
      }

      if (this.item?.SignStatus == MAFContractSignStatus.Signed) {
        this.isSignStatus = true;
      }

      if (this.item?.Status != null) {
        let option: OptionItem = ConstantHelper.MAF_CONTRACT_STATUS_TYPES.find((c) => c.value == this.item.Status);
        this.statusText = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";

        if (this.item.Status == MAFContractStatus.Approve) {
          this.isApprove = true;
        }
        if (this.item.Status == MAFContractStatus.Reject) {
          this.isReject = true;
        }
      }

      this.allowEditContract = await this.authen.permissionAllow(ControllerType.MAFContract, ActionType.Edit);
      if (this.allowEditContract) 
        this.allowEditContract = itemAffililate[ActionType.Edit];
      this.allowApproveContract = await this.authen.permissionAllow(ControllerType.MAFContract, ActionType.Verify);
      if (this.allowApproveContract)
        this.allowApproveContract = itemAffililate[ActionType.Verify];
    }
  }

  editContract() {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafcontract',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafcontract/view?id=' + this.item.Id + '&approve=true&edit=true';
    this.setUrlState(obj, 'mafcontract');
    window.open(url, "_blank");
  }

  approveContract() {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafcontract',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafcontract/view?id=' + this.item.Id + '&approve=true';
    this.setUrlState(obj, 'mafcontract');
    window.open(url, "_blank");
  }

  getFileName(file: string) {
    if (!file) return '';
    if (typeof file != 'string') return '';
    let extension = file.split('.').pop();
    let fileName = '';
    if (extension) {
      let fileB = 'ctv';
      if (this.isBusinesses) fileB = 'dn';
      fileName = this.item.MeeyId + '_hđnt_meeyland-' + fileB;
      return fileName.toLocaleLowerCase() + '.' + extension;
    } else return UtilityExHelper.getFileName(file);
  }

}
