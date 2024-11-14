import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MAFContractEntity } from '../../../../_core/domains/entities/meeyaffiliate/contract.entity';
import { MAFContractSignStatus, MAFContractStatus, MAFContractType } from '../../../../_core/domains/entities/meeyaffiliate/enums/contract.type';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MAFContractService } from '../contract.service';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { validation } from '../../../../_core/decorators/validator';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { MAFApproveIndividualComponent } from '../components/approve.individual/approve.individual.component';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class MAFContractViewComponent extends EditComponent implements OnInit {
  @Input() params: any;
  @ViewChild('uploadFontCard') uploadFontCard: EditorComponent;
  @ViewChild('uploadBackCard') uploadBackCard: EditorComponent;
  @ViewChild('uploadCertificateLetter') uploadCertificateLetter: EditorComponent;
  @ViewChild('uploadAuthorizationLetter') uploadAuthorizationLetter: EditorComponent;
  @ViewChild('uploadFileContract') uploadFileContract: EditorComponent;
  @ViewChild('uploadEditFile') uploadEditFile: EditorComponent;

  loading: boolean = true;

  id: any;
  NodeId: any;
  item: MAFContractEntity;
  oldItem: MAFContractEntity;
  isView: boolean = false;
  isEdit: boolean = false;
  isApprove: boolean = false;
  isApproveContract: boolean = false;
  isBusinesses: boolean = false;
  isChangeItem: boolean = false;
  isSignStatus: boolean = false;
  isCurrentBusinesses: boolean = false;
  isUploadContract = false;
  allowApprove: boolean = true;

  statusText: string;
  itemBusinesses: MAFContractEntity;
  itemIndividual: MAFContractEntity;

  checkApprove: boolean = false;

  constructor(public service: MAFContractService) {
    super();
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }

    let approve = this.params && this.params["approve"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["approve"]) {
      approve = this.router?.routerState?.snapshot?.root?.queryParams["approve"]
    }

    let edit = this.params && this.params["edit"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["edit"]) {
      edit = this.router?.routerState?.snapshot?.root?.queryParams["edit"]
    }
    if (edit) {
      this.isView = false;
      this.isEdit = true;
      this.isUploadContract = true;
    }
    else this.isView = true;
    if (approve) {
      this.isApprove = approve;
    }

    if (this.isUploadContract) {
      this.breadcrumbs = [];
      this.addBreadcrumb("Khách hàng");
      this.addBreadcrumb("Cây hoa hồng KH");
      this.breadcrumbs.push({ Name: "Cây hoa hồng", Link: '/admin/mafaffiliate' });
      this.addBreadcrumb("Chi tiết");
    } else
      this.addBreadcrumb("Chi tiết");
    if (this.state) {
      this.id = this.id || this.state.id;
    }

    await this.loadItem();
    this.renderActions();
    this.loading = false;
  }

  private async loadItem() {
    if (this.id) {
      await this.service.item("MAFContract", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MAFContractEntity, result.Object);
          this.NodeId = result.Object?.NodeId;
          if (this.item?.Type == MAFContractType.Businesses) {
            this.isBusinesses = true;
            this.isCurrentBusinesses = true;
            this.checkApprove = true;
            this.itemBusinesses = _.cloneDeep(this.item);
          } else {
            this.itemIndividual = _.cloneDeep(this.item);
          }

          if (this.item?.SignStatus == MAFContractSignStatus.Signed) {
            this.isSignStatus = true;
          }

          if (this.item?.Status != null) {
            let option: OptionItem = ConstantHelper.MAF_CONTRACT_STATUS_TYPES.find((c) => c.value == this.item.Status);
            if (option)
              this.statusText = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";

            if (this.item.Status != MAFContractStatus.Pending) {
              this.isApprove = false;
            }
            if (this.item.Status == MAFContractStatus.Approve) {
              this.isApproveContract = true;
            }
          }
          this.oldItem = _.cloneDeep(this.item);
          this.allowApprove = this.item[ActionType.Verify];
        }
      });
    }
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => { this.back() }),
      {
        name: "Chỉnh sửa",
        icon: 'la la-pencil',
        className: 'btn btn-primary',
        systemName: ActionType.Edit,
        hidden: () => {
          return !(this.isApprove && this.isView && this.item.Status == MAFContractStatus.Pending && this.item[ActionType.Edit]);
        },
        click: async () => {
          this.loading = true;
          this.isView = false;
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      },
      {
        name: "Lưu lại",
        processButton: true,
        icon: 'la la-save',
        className: 'btn btn-primary',
        systemName: ActionType.Empty,
        hidden: () => {
          return this.isView;
        },
        click: async () => await this.confirmAndBack()
      }
    ];
    this.actions = await this.authen.actionsAllow(MAFContractEntity, actions);
  }

  back() {
    if (this.isEdit) {
      let obj: NavigationStateData = {
        prevUrl: "/admin/mafaffiliate",
      };
      this.router.navigateByUrl("/admin/mafaffiliate/view?id=" + this.NodeId, {
        state: { params: JSON.stringify(obj) },
      });
    } else if (this.state)
      this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
    else
      window.history.back();
  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    this.setUrlState(obj, 'mluser');
    window.open(url, "_blank");
  }

  changeType() {
    if (this.item?.Type && !this.isChangeItem) {
      this.isChangeItem = true;
      if (this.item?.Type == MAFContractType.Businesses) {
        this.isBusinesses = true;
        this.itemIndividual = _.cloneDeep(this.item);
        this.itemIndividual.Type = MAFContractType.Individual;
        if (this.isCurrentBusinesses) {
          this.itemIndividual.TaxCode = '';
          this.itemIndividual.Address = '';
        }
        if (this.itemBusinesses) this.item = this.itemBusinesses;
      } else {
        this.isBusinesses = false;
        this.itemBusinesses = _.cloneDeep(this.item);
        this.itemBusinesses.Type = MAFContractType.Businesses;
        if (!this.isCurrentBusinesses) {
          this.itemBusinesses.TaxCode = '';
          this.itemBusinesses.Address = '';
        }
        if (this.itemIndividual) this.item = this.itemIndividual;
      }

      setTimeout(() => {
        this.isChangeItem = false;
      }, 300);
    }
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      setTimeout(() => {
        if (this.isEdit) {
          let obj: NavigationStateData = {
            prevUrl: "/admin/mafaffiliate",
          };
          this.router.navigateByUrl("/admin/mafaffiliate/view?id=" + this.NodeId, {
            state: { params: JSON.stringify(obj) },
          });
        } else window.location.reload();
      }, 1000);
    });
  }

  public async confirm(complete: () => void): Promise<boolean> {
    this.processing = true;
    let columnValidators = ["Name", "Address", "Phone", "Email", "TaxCode", "IdCard", "DateOfIssue", "FontCard", "BackCard"];
    if (this.item.Type == MAFContractType.Businesses) {
      columnValidators.push("BusinessName");
      columnValidators.push("BusinessPhone");
      columnValidators.push("Position");
      columnValidators.push("CertificateLetter");
      columnValidators.push("DateOfSign");
    } else {
      columnValidators.push("PlaceOfIssue");
    }
    let validator = await validation(this.item, columnValidators);
    if (validator) {
      let fontCard = await this.uploadFontCard.upload();
      let backCard = await this.uploadBackCard.upload();

      if (this.item.Type == MAFContractType.Businesses) {
        let certificateLetter = await this.uploadCertificateLetter.upload();
        this.item.CertificateLetter = certificateLetter && certificateLetter.length > 0 ? certificateLetter[0].Path : '';

        let authorizationLetter = await this.uploadAuthorizationLetter.upload();
        this.item.AuthorizationLetter = authorizationLetter && authorizationLetter.length > 0 ? authorizationLetter[0].Path : '';
      }
      if (this.item.FileEdit) {
        let fileEdit = await this.uploadEditFile.upload();
        if (fileEdit && fileEdit.length > 0) {
          this.item.File = fileEdit[0].Path;
          this.item.FileEdit = fileEdit[0].Path;
        }
      }

      this.item.FontCard = fontCard && fontCard.length > 0 ? fontCard[0].Path : '';
      this.item.BackCard = backCard && backCard.length > 0 ? backCard[0].Path : '';

      if (UtilityExHelper.dateString(this.item.DateOfIssue) === UtilityExHelper.dateString(this.oldItem.DateOfIssue)) {
        this.oldItem.DateOfIssue = this.item.DateOfIssue;
      }
      if (UtilityExHelper.dateString(this.item.DateOfSign) === UtilityExHelper.dateString(this.oldItem.DateOfSign)) {
        this.oldItem.DateOfSign = this.item.DateOfSign;
      }
      let editChange = _.isEqual(this.item, this.oldItem);
      if (!editChange) {
        await this.service.save('MAFContract', this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Lưu thông tin thành công');
            if (complete) complete();
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      } else {
        ToastrHelper.Error("Không có thông tin nào được thay đổi. Vui lòng kiểm tra lại");
      }
    }
    this.processing = false;
    return false;
  }

  async approve(skip: boolean = false) {
    this.processing = true;
    let validator = false;
    if (this.item.Type == MAFContractType.Businesses) {
      validator = await validation(this.item, ["ContractSigned", "File"]);
    } else {
      if (!skip && this.isSignStatus) skip = true;
      if (!skip) {
        this.dialogService.WapperAsync({
          cancelText: 'Đóng',
          confirmText: 'Xác nhận',
          size: ModalSizeType.Medium,
          objectExtra: {
            item: this.item,
          },
          title: 'Duyệt hợp đồng',
          object: MAFApproveIndividualComponent,
        }, async (item: boolean | string) => {
          if (typeof item == 'string') {
            this.item.File = item;
            await this.approve(true);
            this.dialogService.HideAllDialog();
          }
        });
        validator = false;
        return false;
      } else {
        validator = true;
      }
    }

    if (validator) {
      this.item.FontCard = '';
      this.item.BackCard = '';
      if (this.item.Type == MAFContractType.Businesses) {
        let fileContract = await this.uploadFileContract.upload();
        this.item.File = fileContract && fileContract.length > 0 ? fileContract[0].Path : '';
      }
      await this.service.approve(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Duyệt thông tin đăng ký thành công');
          this.back();
        } else {
          ToastrHelper.ErrorResult(result);
        }
      });
    }
    this.processing = false;
  }

  async reject() {
    this.processing = true;
    let validator = await validation(this.item, ["Reason"]);

    if (validator) {
      this.item.FontCard = '';
      this.item.BackCard = '';
      await this.service.reject(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Từ chối thông tin đăng ký thành công');
          this.back();
        } else {
          ToastrHelper.ErrorResult(result);
        }
      });
    }
    this.processing = false;
  }

  async signedChange() {
    this.checkApprove = !(await validation(this.item, ["ContractSigned"], true));
  }

  getFileName(file: string) {
    if (!file) return '';
    if (typeof file != 'string') return '';
    let extension = file.split('.').pop();
    let fileName = '';
    if (extension) {
      let fileB = 'ctv';
      if (this.isCurrentBusinesses) fileB = 'dn';
      fileName = this.item.MeeyId + '_hđnt_meeyland-' + fileB;
      return fileName.toLocaleLowerCase() + '.' + extension;
    } else return UtilityExHelper.getFileName(file);
  }

}
