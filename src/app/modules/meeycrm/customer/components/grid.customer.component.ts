import * as _ from 'lodash';
import { HttpEventType } from '@angular/common/http';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MCRMAddNoteComponent } from '../add.note/add.note.component';
import { TableData } from '../../../../_core/domains/data/table.data';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GoogleSigninService } from '../../../../google-signin.service';
import { ExportType } from '../../../../_core/domains/enums/export.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { MLUserService } from '../../../../modules/meeyuser/user.service';
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { UpdateStatusComponent } from '../update.status/update.status.component';
import { MCRMCustomerListImportComponent } from './customer.list.import.component';
import { MCRMAddNoteCallComponent } from '../add.note.call/add.note.call.component';
import { GroupCustomerComponent } from '../group.customer/group.customer.component';
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MCRMAddNoteEmailComponent } from '../add.note.email/add.note.email.component';
import { AssignCustomerComponent } from '../assign.customer/assign.customer.component';
import { ActionType, ControllerType } from "../../../../_core/domains/enums/action.type";
import { ReceiveCustomerComponent } from '../receive.customer/receive.customer.component';
import { MLUserEntity } from '../../../../_core/domains/entities/meeyland/ml.user.entity';
import { MCRMCustomerListChildComponent } from '../components/customer.list.child.component';
import { MCRMHistoryCustomerComponent } from '../history.customer/history.customer.component';
import { MCRMCallLogDto } from '../../../../_core/domains/entities/meeycrm/mcrm.calllog.entity';
import { PopupSigninGmailComponent } from '../popup.signin.gmail/popup.signin.gmail.component';
import { MCRMCustomerEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.entity";
import { MCRMCallLogType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type';
import { StatisticalCustomerComponent } from '../statistical.customer/statistical.customer.component';
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { UpdateStatusSuccessComponent } from '../update.status.success/update.status.success.component';
import { CustomerStoreType, MCRMCustomerNoteCallStatusType, MCRMCustomerStatusType } from "../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type";
import { UserEntity } from 'src/app/_core/domains/entities/user.entity';
import { SyncCrmComponent } from '../sync.crm.customer/sync.crm.component';

@Component({
  selector: 'mcrm-grid-customer',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMGridCustomerComponent extends GridComponent implements OnInit, OnDestroy {
  @Input() params: any;
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    UpdatedBy: false,
    DisableAutoLoad: true,
    NotKeepPrevData: true,
    Size: ModalSizeType.Large,
    Reference: MCRMCustomerEntity,
    Actions: [{
      icon: 'la la-eye',
      name: ActionType.ViewDetail,
      className: 'btn btn-warning',
      systemName: ActionType.ViewDetail,
      hidden: (item: any) => {
        return !item[ActionType.ViewDetail];
      },
      click: (item: any) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        this.view(originalItem);
      },
      ctrClick: (item: any) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        this.view(originalItem);
      }
    },
    {
      icon: 'la la-phone',
      name: ActionType.Call,
      systemName: ActionType.Call,
      className: 'btn btn-success',
      hidden: (item: any) => {
        return !(item[ActionType.Call] && item['PhoneText']);
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.addNoteCall(originalItem);
      }
    },
    {
      icon: 'la la-pencil',
      name: ActionType.Edit,
      systemName: ActionType.Edit,
      className: 'btn btn-primary',
      hidden: (item: any) => {
        return !item[ActionType.Edit];
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        this.edit(originalItem);
      },
      ctrClick: (item: any) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        this.edit(originalItem);
      }
    },
    ],
    Features: [{
      icon: 'la la-plus',
      name: ActionType.AddNew,
      className: 'btn btn-primary',
      systemName: ActionType.AddNew,
      controllerName: ControllerType.MCRMCustomer,
      click: () => {
        this.addNew();
      },
    },
    ActionData.reload(() => { this.loadItems(); }),
    {
      icon: 'fas fa-sync',
      name: "Quá hạn",
      className: 'btn btn-danger',
      systemName: "Quá hạn",
      controllerName: ControllerType.MCRMCustomer,
      click: (async (item: UserEntity) => {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            object: SyncCrmComponent,
            size: ModalSizeType.Large,
            title: 'Chạy quá hạn khách hàng CRM',
        }, async () => {
        });
      })
    },
    ],
    MoreActions: [{
      name: ActionType.Notes,
      icon: 'la la-sticky-note',
      systemName: ActionType.Notes,
      hidden: (item: any) => {
        return !item[ActionType.Notes];
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.addNote(originalItem);
      }
    },
    {
      icon: 'la la-send',
      name: ActionType.SendEmail,
      systemName: ActionType.SendEmail,
      hidden: (item: any) => {
        return !item[ActionType.SendEmail];
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.addNoteEmail(originalItem);
      }
    },
    {
      icon: 'la la-heart',
      name: ActionType.ReceiveCustomer,
      systemName: ActionType.ReceiveCustomer,
      hidden: (item: any) => {
        if (this.authen.account.IsSupport) {
          return !(item[ActionType.ReceiveCustomer] && !item['SupportEmail']);
        } else {
          return !((item[ActionType.ReceiveCustomer]) && (item['Expire'] || (this.authen.account.IsSale && !item['SaleEmail'])) &&
            ((this.gridType == 'customer-expired' && this.authen.account.IsSale)));
        }
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.receiveCustomer(originalItem);
      }
    },
    {
      hide: true,
      icon: 'la la-share-alt',
      className: 'btn btn-success',
      name: ActionType.AssignSale,
      systemName: ActionType.AssignSale,
      hidden: (item: any) => {
        return !item[ActionType.AssignSale];
      },
      click: ((item: MCRMCustomerEntity) => {
        let type = this.params && this.params["type"];
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.assign([originalItem], AssignType.Sale, type);
      })
    },
    {
      hide: true,
      icon: 'la la-share-alt',
      className: 'btn btn-success',
      name: ActionType.AssignSupport,
      systemName: ActionType.AssignSupport,
      hidden: (item: any) => {
        return !item[ActionType.AssignSupport];
      },
      click: ((item: MCRMCustomerEntity) => {
        let type = this.params && this.params["type"];
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.assign([originalItem], AssignType.Support, type);
      })
    },
    {
      icon: 'la la-exchange',
      name: ActionType.UpdateStatus,
      systemName: ActionType.UpdateStatus,
      hidden: (item: any) => {
        return !(item[ActionType.UpdateStatus] && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.NotSale && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.Success && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.Deleted);
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.updateStatus(originalItem);
      }
    },
    {
      icon: 'la la-exchange',
      name: ActionType.UpdateStatusSuccess,
      systemName: ActionType.UpdateStatusSuccess,
      hidden: (item: any) => {
        return !(item[ActionType.UpdateStatusSuccess] && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.NotSale && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.Success && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.Deleted);
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.updateStatusSuccess(originalItem);
      }
    },
    {
      icon: 'la la-group',
      name: ActionType.GroupCustomer,
      systemName: ActionType.GroupCustomer,
      hidden: (item: any) => {
        return !(item[ActionType.GroupCustomer] && item.CustomerStatusTypeOrg != MCRMCustomerStatusType.Deleted);
      },
      click: (item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem)
          this.groupCustomer([originalItem]);
      }
    },
    {
      name: 'Lịch sử',
      icon: 'la la-book',
      systemName: ActionType.View,
      click: ((item: MCRMCustomerEntity) => {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        this.history(originalItem);
      })
    }
    ],
    MoreFeatures: {
      Name: 'Nhập dữ liệu',
      Icon: 'la la-upload',
      Actions: [
        ActionData.downloadFile(() => {
          this.downloadFile();
        }),
        {
          name: 'Nhập dữ liệu',
          icon: 'la la-upload',
          className: 'btn btn-warning',
          systemName: ActionType.Import,
          click: (item: any) => {
            this.choiceFile(item, {
              size: 10,
              dataType: DataType.File,
              description: 'Định dạng .xls, xlsx',
              accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
              customUpload: {
                data: [{ key: 'data', value: 'data' }],
                url: AppConfig.ApiUrl + '/admin/MCRMCustomer/Import',
                authorization: { value: 'Bearer ' + this.service.getToken() },
              },
            });
          }
        },
      ],
    },
    AsynLoad: () => this.asynLoad(),
    SearchText: 'Nhập Sđt, Email, Họ tên, MeeyID, CRMID',
    CustomFilters: ['FilterSaleId', 'FilterSupportId', 'CustomerStatusType', 'CustomerPotentialType', 'CustomerExpireType', 'CityId', 'DistrictId', 'SourceId', 'FilterCustomerType', 'CreatedDate', 'FilterLastTimeSupport']
  };
  gridType: string;
  allowViewDetail: boolean;
  allowAssignSale: boolean;
  allowAssignSupport: boolean;
  allowGroupCustomer: boolean;
  allowViewDetailLead: boolean;
  allowTransferCustomer: boolean;

  crmService: MeeyCrmService;
  userService: MLUserService;
  userGoogle: gapi.auth2.GoogleUser;

  constructor(
    private ref: ChangeDetectorRef,
    private signInGoogle: GoogleSigninService) {
    super();
    this.crmService = AppInjector.get(MeeyCrmService);
    this.userService = AppInjector.get(MLUserService);
    this.signInGoogle.observable().subscribe(user => {
      this.userGoogle = user
      this.ref.detectChanges()
    });
  }

  async ngOnInit() {
    let type = this.params && this.params["type"];
    this.loadComponent(type);
    this.gridType = type;

    this.allowViewDetail = await this.authen.permissionAllow(ControllerType.MCRMCustomer, ActionType.ViewDetail);
    this.allowViewDetailLead = await this.authen.permissionAllow(ControllerType.MCRMCustomerLead, ActionType.ViewDetail);
    this.properties = [
      {
        Property: 'Customer', Title: 'Khách hàng', Type: DataType.String,
        Format: ((item: any) => {
          let text = '',
            allow = item[ActionType.ViewDetail] && this.allowViewDetail;
          if (item.Name) {
            text += allow
              ? '<p routerLink="quickView" type="view"><a>' + item.Name + '</a></p>'
              : '<p>' + item.Name + '</p>';
          }
          if (item.LeadId) {
            let leadIdText = this.allowViewDetailLead ? '<a routerLink="quickView" type="lead" tooltip="Xem chi tiết">' + item.LeadId + '</a>' : item.LeadId;
            text += '<p style="overflow: visible;"> LeadId: ' +
              '<a style="text-decoration: none !important;" data="' + item.LeadId + '" tooltip="Sao chép" flow="right">' +
              '<i routerlink="copy" class="la la-copy"></i></a> ' + leadIdText + '</p>';
          }
          if (item.MeeyId) {
            let meeyId = item.MeeyId && item.MeeyId.length > 5
              ? item.MeeyId.toString().substring(item.MeeyId.length - 5)
              : item.MeeyId,
              meeyIdText = allow ? '<a routerLink="quickView" type="user" tooltip="Xem chi tiết">' + meeyId + '</a>' : meeyId;
            text += '<p style="min-height: 25px; overflow: visible;"> MeeyId: ' +
              '<a style="text-decoration: none !important;" data="' + item.MeeyId + '" tooltip="Sao chép" flow="right">' +
              '<i routerlink="copy" class="la la-copy"></i></a> ' + meeyIdText + '</p>';
          }
          if (item.CustomerType != null && item.CustomerType != undefined) {
            let option = ConstantHelper.ML_CUSTOMER_TYPES.find(c => c.value == item.CustomerType);
            if (option) text += '<p><i class=\'la la-user\'></i> ' + option.label + '</p>';
          }
          if (item.Source) {
            text += '<p><i class=\'la la-globe\'></i> ' + item.Source + '</p>';
          }
          if (item.CreatedDate) {
            let date = UtilityExHelper.dateTimeString(item.CreatedDate);
            text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
          }
          return text;
        })
      },
      {
        Property: 'Balance', Title: 'Số dư TK', Type: DataType.String,
        Format: (item: any) => {
          if (item.MPConnected)
            return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
          else {
            if (item.Viewer || !this.allowViewDetail) {
              return null;
            } else {
              let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
              return text;
            }
          }
        }
      },
      { Property: 'InvoiceTaxCode', Title: 'Mã số thuế', Type: DataType.String },
      {
        Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '',
            sale = item.Sale || item.PrevSale;
          item['SaleEmail'] = sale;
          item['SupportEmail'] = item.Support;
          if (type !== 'customer-affiliate') text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(sale) + '</a></p>';
          if (type == 'customer') {
            let label = '';
            if (item.CustomerStoreType == 0) {
              label = '<a href="javascript:void(0)">Kho cá nhân</a>';
            } else if (item.CustomerStoreType == 3) {
              label = '<a href="javascript:void(0)">Kho Affiliate</a>';
            } else if (item.CustomerStoreType == 4) {
              label = '<a href="javascript:void(0)">Kho Bank</a>';
            }
            text += '<p>Kho: ' + label + '</p>';
          }
          if (type == 'customer-expired') {
            if (this.allowViewDetail) {
              if (item.CustomerStoreType == 1)
                text += '<p>Kho: <a href="javascript:void(0)">' + UtilityExHelper.escapeHtml(item.DeparmentName) + '</a></p>';
              else if (item.CustomerStoreType == 2)
                text += '<p>Kho: <a href="javascript:void(0)">Kho công ty</a></p>';
              else if (item.CustomerStoreType == 3)
                text += '<p>Kho: <a href="javascript:void(0)">Kho Affiliate</a></p>';
              else if (item.CustomerStoreType == 4)
                text += '<a href="javascript:void(0)">Kho Bank</a>';

            }
          }
          text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
          return text;
        })
      },
      {
        Property: 'CompanyName', Title: 'Nguồn Iframe', Type: DataType.String, Align: 'center',
        Format: ((item: any) => {
          let text: string = '';
          if (item.CompanyName) text += '<p>' + item.CompanyName + '</p>';
          if (item.ContractCode) text += '<p>' + item.ContractCode + '</p>';
          return text;
        })
      },
      {
        Property: 'CustomerRefCode', Title: 'Người giới thiệu', Type: DataType.String, Align: 'center',
        Format: ((item: any) => {
          let text: string = '';
          if (item.CustomerRef) text += '<p>' + item.CustomerRef + '</p>';
          if (item.CustomerRefCode) text += '<p>Mã Ref: ' + item.CustomerRefCode + '</p>';
          return text;
        })
      },
      {
        Property: 'CustomerStatusType', Title: 'Mức độ tiềm năng/ Trạng thái tiếp cận', Type: DataType.String, Align: 'center',
        Format: ((item: MCRMCustomerEntity) => {
          let text: string = '';
          item['CustomerStatusTypeOrg'] = item.CustomerStatusType;
          if (item.CustomerStatusType != null && item.CustomerStatusType != undefined) {
            let option = ConstantHelper.ML_CUSTOMER_STATUS_TYPES.find(c => c.value == item.CustomerStatusType);
            if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
          }
          if (item.CustomerPotentialType != null && item.CustomerPotentialType != undefined) {
            let option = ConstantHelper.ML_CUSTOMER_POTETIAL_TYPES.find(c => c.value == item.CustomerPotentialType);
            if (option) text += '<p>' + (option && option.label) + '</p>';
          }
          return text;
        })
      },
      {
        Property: 'Phone', Title: 'Thông tin liên lạc', Type: DataType.String,
        Format: ((item: any) => {
          let text = '';
          item['PhoneText'] = item.Phone;
          if (item.Phone) {
            let phone = item.Phone || '';
            while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
            while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
            let phones = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i);
            if (phones && phones.length > 0) {
              text += '<p><i class=\'la la-phone\'></i> ';
              phones.forEach((itemPhone: string) => {
                itemPhone = UtilityExHelper.trimChars(itemPhone, [' ', ',']);
                if (itemPhone) {
                  text += item[ActionType.Call]
                    ? '<a routerLink="quickView" type="' + itemPhone + '">' + itemPhone + '</a>, '
                    : '<span>' + itemPhone + '</span>, ';
                }
              });
              text = UtilityExHelper.trimChars(text, [' ', ',']);
              text += '</p>';
            }
          }
          if (item.Email) {
            let email = item.Email || '';
            while (email.indexOf('/') >= 0) email = email.replace('/', ',');
            while (email.indexOf(';') >= 0) email = email.replace(';', ',');
            let emails = email.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i);
            if (emails && emails.length > 0) {
              text += '<p><i class=\'la la-inbox\'></i> ';
              emails.forEach((itemEmail: string) => {
                itemEmail = UtilityExHelper.trimChars(itemEmail, [' ', ',']);
                if (itemEmail) {
                  text += item[ActionType.SendEmail]
                    ? '<a routerLink="quickView" type="' + itemEmail + '">' + itemEmail + '</a>, '
                    : '<span>' + itemEmail + '</span>, ';
                }
              });
              text = UtilityExHelper.trimChars(text, [' ', ',']);
              text += '</p>';
            }
          }
          if (item.Address || item.Ward || item.District || item.City) {
            let address: string[] = [];
            if (item?.Address) address.push(item.Address);
            if (item?.Ward) address.push(item.Ward);
            if (item?.District) address.push(item.District);
            if (item?.City) address.push(item.City);
            text += '<p>Địa chỉ: ' + address.toString() + '</p>'
          }
          return text;
        })
      },
      // {
      //   Property: 'Address', Title: 'Địa chỉ', Type: DataType.String,
      //   Format: ((item: any) => {
      //     let text = '';
      //     if (item.Ward) text += '<span>' + item.Ward + '</span> - ';
      //     if (item.District) text += '<span>' + item.District + '</span> - ';
      //     if (item.City) text += '<span>' + item.City + '</span> - ';
      //     text = UtilityExHelper.trimChars(text, [' ', '-']);
      //     return text;
      //   })
      // },
      {
        Property: 'FilterLastTimeSupport', Title: 'Ngày chăm sóc gần đây', Type: DataType.String,
        Format: ((item: any) => {
          let text = '';
          if (item.FilterLastTimeSupport) {
            let date = UtilityExHelper.dateTimeString(item.FilterLastTimeSupport);
            text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
          }
          if (item.ExpireDay) {
            let title = '';
            if (type == 'customer') title = 'Hạn chăm sóc';
            else title = 'Quá hạn chăm sóc';
            let expire: boolean = false,
              originItem = <MCRMCustomerEntity>this.originalItems.find(c => c.Id == item.Id);
            if (originItem) {
              let expireDay = originItem.ExpireDay < 1
                ? Math.round(originItem.ExpireDay * 24)
                : Math.round(originItem.ExpireDay);
              switch (originItem.CustomerStatusType) {
                case MCRMCustomerStatusType.NotSale: {
                  expire = true;
                } break;
                case MCRMCustomerStatusType.Reject: {
                  if (originItem.ExpireDay) {
                    expire = true;
                    if (item.LastTimeSupport && item.CustomerStoreType != CustomerStoreType.Affiliate) text += '<p>' + UtilityExHelper.dateTimeString(item.LastTimeSupport) + '</p>';
                    if (originItem.CustomerStoreType != CustomerStoreType.Affiliate && !item.IgnoreExpired){
                      if (originItem.CustomerStoreType == CustomerStoreType.CompanyStore && originItem.SaleId == null && originItem.PrevSaleId == null) text = '';
                      else
                        text += '<p class="text-danger"><i class=\'la la-info\'></i> ' + title + ' (' + expireDay + (originItem.ExpireDay < 1 ? ' giờ' : ' ngày') + ')</p>';
                    }
                  }
                } break;
                case MCRMCustomerStatusType.NotApproach: {
                  if (originItem.ExpireDay && item.CustomerStoreType != CustomerStoreType.Affiliate) {
                    expire = true;
                    if (item.LastTimeSupport) text += '<p>' + UtilityExHelper.dateTimeString(item.LastTimeSupport) + '</p>';
                    if (originItem.CustomerStoreType != CustomerStoreType.Affiliate && !item.IgnoreExpired){
                      if (originItem.CustomerStoreType == CustomerStoreType.CompanyStore && originItem.SaleId == null && originItem.PrevSaleId == null) text = '';
                      else if (originItem.CustomerStoreType == CustomerStoreType.IndividualsStore && item.MCRMIframeContractId != null) text = text
                      else
                        text += '<p class="text-danger"><i class=\'la la-info\'></i> ' + title + ' (' + expireDay + (originItem.ExpireDay < 1 ? ' giờ' : ' ngày') + ')</p>';
                    }
                  }
                } break;
                case MCRMCustomerStatusType.Consider: {
                  if (originItem.ExpireDay && item.CustomerStoreType != CustomerStoreType.Affiliate) {
                    expire = true;
                    if (item.LastTimeSupport) text += '<p>' + UtilityExHelper.dateTimeString(item.LastTimeSupport) + '</p>';
                    if (originItem.CustomerStoreType != CustomerStoreType.Affiliate && !item.IgnoreExpired){
                      if (originItem.CustomerStoreType == CustomerStoreType.CompanyStore && originItem.SaleId == null && originItem.PrevSaleId == null) text = '';
                      else
                        text += '<p class="text-danger"><i class=\'la la-info\'></i> ' + title + ' (' + expireDay + (originItem.ExpireDay < 1 ? ' giờ' : ' ngày') + ')</p>';
                    }
                  }
                } break;
                case MCRMCustomerStatusType.Success: {
                  if (originItem.ExpireDay && item.CustomerStoreType != CustomerStoreType.Affiliate) {
                    expire = true;
                    if (item.LastTimeSupport) text += '<p>' + UtilityExHelper.dateTimeString(item.LastTimeSupport) + '</p>';
                    if (originItem.CustomerStoreType != CustomerStoreType.Affiliate && !item.IgnoreExpired){
                      if (originItem.CustomerStoreType == CustomerStoreType.CompanyStore && originItem.SaleId == null && originItem.PrevSaleId == null) text = '';
                      else if (originItem.CustomerStoreType == CustomerStoreType.IndividualsStore && item.MCRMIframeContractId != null) text = text
                      else
                        text += '<p class="text-danger"><i class=\'la la-info\'></i> ' + title + ' (' + expireDay + (originItem.ExpireDay < 1 ? ' giờ' : ' ngày') + ')</p>';
                    }
                  }
                } break;
              }
            }
            item['Expire'] = expire;
          } else item['Expire'] = true;
          text += '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary" style="margin-top: 12px;"></div>';
          return text;
        })
      },
      // { Property: 'CreatedDate', Title: 'Ngày nhập vào CRM', Type: DataType.DateTime, PipeType: PipeType.DateTime }
      { Property: 'CustomerActivityType', Title: 'Loại hình hoạt động', Type: DataType.String },
      { Property: 'AccountSource', Title: 'Nơi tạo tài khoản', Type: DataType.String },
      { Property: 'InterestedProduct', Title: 'Sản phẩm quan tâm', Type: DataType.String },
    ];

    if (type == 'customer-affiliate' || type == 'customer-iframe') {
      this.properties = this.properties?.filter(x => x.Property !== 'CustomerStatusType' && x.Property !== 'CustomerActivityType' && x.Property !== 'AccountSource' && x.Property !== 'InterestedProduct');
      this.obj.MoreActions = this.obj.MoreActions?.filter(x => x.systemName !== ActionType.UpdateStatus && x.systemName !== ActionType.UpdateStatusSuccess && x.systemName !== ActionType.GroupCustomer)
    }
    if (type !== 'customer-iframe') this.properties = this.properties?.filter(x => x.Property !== 'CompanyName');
    if (type == 'customer-iframe') {
      this.obj.Actions = this.obj.Actions?.filter(x => x.systemName !== ActionType.Edit);
    }
    if (type == 'customer-expired') {
      this.obj.MoreActions = this.obj.MoreActions?.filter(x => x.systemName !== ActionType.UpdateStatus && x.systemName !== ActionType.UpdateStatusSuccess)
    }
    if (type !== 'customer-affiliate') {
      this.properties = this.properties?.filter(x => x.Property !== 'CustomerRefCode');
    }

    this.setPageSize(20);
    await this.render(this.obj);
    this.summaryText = 'Tổng số giây: ' + this.itemTotal;

    // button assign support
    this.allowAssignSupport = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSupport);
    if (this.allowAssignSupport) {
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share-alt',
        className: 'btn btn-success',
        name: ActionType.AssignSupport,
        systemName: ActionType.AssignSupport,
        click: ((item) => {
          let cloneItems = this.originalItems && this.originalItems.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để phân CSKH');
            return;
          }
          this.assign(cloneItems, AssignType.Support, type);
        })
      });
    }

    // button assign sale
    this.allowAssignSale = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSale);
    if (this.allowAssignSale) {
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share-alt',
        name: ActionType.AssignSale,
        className: 'btn btn-primary',
        systemName: ActionType.AssignSale,
        click: ((item) => {
          let cloneItems = this.originalItems && this.originalItems.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để phân sale');
            return;
          }
          this.assign(cloneItems, AssignType.Sale, type);
        })
      });
    }

    // button create request
    this.allowGroupCustomer = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.GroupCustomer);
    if (this.allowGroupCustomer) {
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share-alt',
        className: 'btn btn-warning',
        name: ActionType.GroupCustomer,
        systemName: ActionType.GroupCustomer,
        click: ((item) => {
          let cloneItems = this.originalItems && this.originalItems.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để tạo yêu cầu gộp khách hàng');
            return;
          }
          this.groupCustomer(cloneItems);
        })
      });
    }
    this.toggleCheckable();

    // refresh
    if (!this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(() => {
        this.loadItems();
        this.checkAll = false;
        this.selectedIds = null;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids.unsubscribe();
      this.subscribeRefreshGrids = null;
  }
  }

  public asynLoad() {
    // load sale
    let type = this.params && this.params["type"];
    let ids = this.items && this.items.map(c => c.Id);
    if (ids && ids.length > 0) {
      let idsString = ids.join(',');
      this.crmService.getLastNoteItems(idsString).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let items: any[] = result.Object;
          items.forEach((item: any) => {
            let itemDb = this.items.find(c => c.Id == item.Id);
            if (itemDb) {
              let text: string = '',
                FilterLastTimeSupport: string = itemDb['FilterLastTimeSupport'] || '',
                status: MCRMCustomerNoteCallStatusType = <MCRMCustomerNoteCallStatusType>item.Status;
              if (status) {
                let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES.find(c => c.value == status);
                if (option) text += '<p>Kết quả: ' + option.label + '</p>';
              }
              if (this.gridType != 'customer-expired') {
                text += '<p>' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</p>';
                text += item.Note ? '<p>Ghi chú: ' + UtilityExHelper.escapeHtml(item.Note) + '</p>' : '';
              }

              itemDb['FilterLastTimeSupport'] = FilterLastTimeSupport.replace('<div class="kt-spinner kt-spinner--v2 kt-spinner--primary" style="margin-top: 12px;"></div>', text);
            }
          });
        }
      });
    }
    let meeyIds = this.items && this.items.map((c: any) => c.MeeyId);
    if (ids && ids.length > 0) {
      this.userService.GetAllWalletByMeeyIds(meeyIds).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let items: MLUserEntity[] = result.Object;
          this.items.forEach((item: any) => {
            let itemDb = items.find(c => c.MeeyId == item.MeeyId);
            if (itemDb) {
              item['WalletBalance'] = itemDb.Balance || itemDb.DiscountBalance1 || itemDb.DiscountBalance2;
              if (!this.allowViewDetail) {
                item['Balance'] = '';
              } else {
                let text: string = '',
                  mainMoney = itemDb.Balance == null ? '--' : itemDb.Balance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                  discountBalance1 = itemDb.DiscountBalance1 == null ? '--' : itemDb.DiscountBalance1.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                  discountBalance2 = itemDb.DiscountBalance2 == null ? '--' : itemDb.DiscountBalance2.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
                item['Balance'] = text;
              }
            } else {
              let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
              item['Balance'] = text;
            }
          });
        }
      });
    }
  }

  loadComplete(): void {
    this.toggleCheckable();
    this.summaryText = 'Tổng số giây: ' + this.itemTotal;
  }

  addNew() {
    let obj: NavigationStateData = {
      prevData: this.itemData,
      prevUrl: '/admin/meeycrm/customer',
    };
    this.router.navigate(['/admin/meeycrm/customer/add'], { state: { params: JSON.stringify(obj) } });
  }
  SyncCrm() {
    let obj: NavigationStateData = {
      prevData: this.itemData,
      prevUrl: '/admin/meeycrm/customer',
    };
    this.router.navigate(['/admin/meeycrm/customer/synccrm'], { state: { params: JSON.stringify(obj) } });
  }
  
  addNote(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: { item: item },
      object: MCRMAddNoteComponent,
      title: 'Thêm/sửa ghi chú khách hàng [' + item.Code + ']',
    }, async () => {
      this.loadItems();
    });
  }
  view(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      object: item,
      prevData: this.itemData,
      prevUrl: '/admin/meeycrm/customer',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + item.Id;
    this.setUrlState(obj, 'mcrmcustomer');
    window.open(url, "_blank");
  }
  edit(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      object: item,
      prevData: this.itemData,
      prevUrl: '/admin/meeycrm/customer',
    };
    this.router.navigate(['/admin/meeycrm/customer/edit'], { state: { params: JSON.stringify(obj) } });
  }
  addNoteCall(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      objectExtra: { item: item },
      confirmText: 'Lưu thông tin',
      size: ModalSizeType.ExtraLarge,
      object: MCRMAddNoteCallComponent,
      title: 'Nghe/Gọi điện cho khách hàng [' + item.Code + ']',
    }, async () => {
      this.loadItems();
    });
  }
  history(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Lịch sử tài khoản',
      objectExtra: {
        id: item.Id,
        meeyId: item.MeeyId
      },
      size: ModalSizeType.ExtraLarge,
      object: MCRMHistoryCustomerComponent,
    });
  }
  async addNoteEmail(item: any, email?: string) {
    let user = this.signInGoogle.currentUser();
    let login = true;
    if (user) {
      if (user?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
        this.userGoogle = user
        login = false;
        this.dialogService.WapperAsync({
          cancelText: 'Hủy',
          objectExtra: {
            item: item,
            user: this.userGoogle
          },
          confirmText: 'Gửi Email',
          size: ModalSizeType.ExtraLarge,
          object: MCRMAddNoteEmailComponent,
          title: 'Gửi email cho khách hàng [' + item.Code + ']',
        }, async () => {
          this.loadItems();
        });
      } else {
        this.signInGoogle.signOut()
      }
    }

    if (login) {
      this.dialogService.WapperAsync({
        cancelText: 'Đóng',
        confirmText: 'Tiếp tục',
        size: ModalSizeType.Medium,
        title: 'Kết nối tài khoản mail',
        object: PopupSigninGmailComponent,
      }, async () => {
        setTimeout(async () => {
          try {
            if (this.userGoogle) {
              if (this.userGoogle?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
                this.dialogService.WapperAsync({
                  cancelText: 'Hủy',
                  objectExtra: {
                    item: item,
                    email: email,
                    user: this.userGoogle
                  },
                  confirmText: 'Gửi Email',
                  size: ModalSizeType.ExtraLarge,
                  object: MCRMAddNoteEmailComponent,
                  title: 'Gửi email cho khách hàng [' + item.Code + ']',
                }, async () => {
                  this.loadItems();
                });
              } else {
                this.popupSigninErrorMail('<p>Email: <a>' + this.userGoogle.getBasicProfile().getEmail() + '</a> không hợp lệ, Vui lòng chọn loại tài khoản email <a>(@meeyland.com)</a></p>')
              }
            } else {
              await this.signInGoogle.signIn().then(() => {
                if (this.userGoogle) {
                  if (this.userGoogle?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
                    this.dialogService.WapperAsync({
                      cancelText: 'Hủy',
                      objectExtra: {
                        item: item,
                        email: email,
                        user: this.userGoogle
                      },
                      confirmText: 'Gửi Email',
                      size: ModalSizeType.ExtraLarge,
                      object: MCRMAddNoteEmailComponent,
                      title: 'Gửi email cho khách hàng [' + item.Code + ']',
                    }, async () => {
                      this.loadItems();
                    });
                  } else {
                    this.popupSigninErrorMail('<p>Email: <a>' + this.userGoogle.getBasicProfile().getEmail() + '</a> không hợp lệ, Vui lòng chọn loại tài khoản email <a>(@meeyland.com)</a></p>')
                  }
                }
              }).catch(error => {
                this.popupSigninErrorMail('<p>Vui lòng đăng nhập tài khoản gmail của bạn!</p>')
              })
            }
          } catch (error) {
            this.signInGoogle.signOut()
          }
        }, 500);
      })
    }
  }

  popupSigninErrorMail(message) {
    setTimeout(() => {
      this.dialogService.WapperAsync({
        cancelText: 'Đóng',
        objectExtra: {
          message: message,
        },
        size: ModalSizeType.Medium,
        title: 'Lỗi kết nối tài khoản email',
        object: PopupSigninGmailComponent,
      }, null, null, null, async () => {
        await this.signInGoogle.signOut();
      });
    })
  }

  updateStatus(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: { item: item },
      object: UpdateStatusComponent,
      title: 'Chuyển trạng thái khách hàng [' + item.Code + ']',
    }, async () => {
      this.loadItems();
    });
  }
  receiveCustomer(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Nhận khách',
      size: ModalSizeType.Large,
      objectExtra: { item: item },
      object: ReceiveCustomerComponent,
      title: 'Nhận khách hàng [' + item.Code + ']',
    }, async () => {
      this.loadItems();
    });
  }
  groupCustomer(items: any[]) {
    if (items && items.length > 0) {
      let cloneItems = _.cloneDeep(items);
      cloneItems.forEach((item: any, index: number) => {
        item.Index = index + 1;
      });
      this.dialogService.WapperAsync({
        cancelText: 'Hủy bỏ',
        confirmText: 'Xác nhận',
        title: 'Gộp khách hàng',
        size: ModalSizeType.ExtraLarge,
        objectExtra: {
          items: cloneItems,
        },
        object: GroupCustomerComponent,
      }, async () => {
        // this.loadItems();
        this.checkAll = false;
        this.selectedIds = null;
      });
    } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để tạo yêu cầu');
  }
  updateStatusSuccess(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: { item: item },
      object: UpdateStatusSuccessComponent,
      title: 'Chuyển trạng thái thành công cho khách hàng  [' + item.Code + ']',
    }, async () => {
      this.loadItems();
    });
  }
  assign(items: any[], type: AssignType, tab: string) {
    if (items && items.length > 0) {
      let cloneItems = _.cloneDeep(items);
      cloneItems.forEach((item: any, index: number) => {
        item.Index = index + 1;
      });
      this.dialogService.WapperAsync({
        cancelText: 'Hủy bỏ',
        confirmText: 'Xác nhận',
        size: ModalSizeType.ExtraLarge,
        title: 'Điều chuyển khách hàng',
        objectExtra: {
          type: type,
          tab: tab,
          items: cloneItems,
        },
        object: AssignCustomerComponent,
      }, async () => {
        this.loadItems();
        this.checkAll = false;
        this.selectedIds = null;
      });
    } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để điều chuyển');
  }

  renderSubTable(item: any) {
    this.renderSubTableComponent(item, MCRMCustomerListChildComponent, {
      rootId: item.Id
    });
  }
  eventCheckChange(count: number) {
    let allowAssignSale = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSale);
    if (allowAssignSale) {
      let button = this.obj.Features.find(c => c.systemName == ActionType.AssignSale);
      if (button) {
        button.hide = !count;
      }
    }

    let allowAssignSupport = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSupport);
    if (allowAssignSupport) {
      let button = this.obj.Features.find(c => c.systemName == ActionType.AssignSupport);
      if (button) {
        button.hide = !count;
      }
    }

    let allowGroupCustomer = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.GroupCustomer);
    if (allowGroupCustomer) {
      let button = this.obj.Features.find(c => c.systemName == ActionType.GroupCustomer);
      if (button) {
        button.hide = !count;
      }
    }
  }

  public quickViewProfile(id: number) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      objectExtra: { id: id },
      size: ModalSizeType.Large,
      title: 'Thông tin tài khoản',
      object: ModalViewProfileComponent,
    });
  }
  quickView(item: BaseEntity, type: string) {
    let originalItem = this.originalItems.find(c => c.Id == item.Id);
    if (originalItem) {
      switch (type) {
        case 'view': this.view(item); break;
        case 'sale': {
          let saleId = originalItem['SaleId'] || originalItem['PrevSaleId'];
          this.quickViewProfile(saleId);
        } break;
        case 'support': {
          let supportId = originalItem['SupportId'];
          this.quickViewProfile(supportId);
        } break;
        case 'lead': {
          let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customerlead/view?id=' + originalItem['LeadId'];
          window.open(url, "_blank");
          break;
        }
        case 'user': {
          let obj: NavigationStateData = {
            prevUrl: '/admin/mluser',
          };
          let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + originalItem['MeeyId'];
          this.setUrlState(obj, 'mluser');
          window.open(url, "_blank");
          break;
        }
        default: {
          if (type.indexOf('@') >= 0) {
            this.addNoteEmail(originalItem, type);
          } else {
            this.makeCall(originalItem, type);
          }
        } break;
      }
    }
  }

  private toggleCheckable() {
    this.obj.Checkable = this.allowAssignSale || this.allowAssignSupport;
    if (!this.obj.Checkable) {
      this.obj.Checkable = this.allowGroupCustomer && this.itemData && this.itemData.Search && this.itemData.Search.length > 0;
    }
  }
  async makeCall(item: any, phone: string) {
    let obj: MCRMCallLogDto = {
      Phone: phone,
      Opening: false,
      Customer: item,
      TypeName: 'Cuộc gọi đi',
      MCRMCustomerId: item.Id,
      Type: MCRMCallLogType.Outbound,
      Message: 'Kết nối tới tổng đài...',
      Extension: this.authen.account.ExtPhoneNumber
    };
    this.dataService.addCallItem(obj);
    await this.crmService.makeCall({
      PrefixNumber: 1,
      Phone: obj.Phone,
      CustomerId: obj.MCRMCustomerId,
    }).then((result: ResultApi) => {
      let message = result && result.Description;
      if (ResultApi.IsSuccess(result)) {
        obj.Message = 'Đang đổ chuông...';
      } else {
        obj.Message = message;
        this.dataService.closeCallItem(obj);
      }
    }, (e) => {
      ToastrHelper.Exception(e);
    });
  }
  private setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }

  loadComponent(type) {
    switch (type) {
      case 'customer':
        this.obj.CustomFilters = ['FilterTaxCode', 'FilterAccountSource', 'CityId', 'FilterLastTimeSupport', 'FilterSupportId', 'FilterCustomerType', 'DistrictId', 'CustomerPotentialType', 'FilterSaleId', 'FilterCustomerStatusType', 'FilterSupportExpire', 'FilterCreatedDate', 'FilterUpdatedDate','FilterInterestedProductId'];
        this.obj.Url = '/admin/MCRMCustomer/GetIndividualCustomer';
        this.obj.StatisticalComponent = StatisticalCustomerComponent;
        this.obj.Features.unshift({
          name: "Xuất dữ liệu",
          icon: "la la-download",
          className: 'btn btn-success',
          systemName: ActionType.Export,
          click: () => {
            if (this.itemData?.Paging?.Total > 50000) {
              this.dialogService.Alert('Thông báo', 'File export tối đa 50 nghìn dòng!');
              this.export();
            } else this.export()
          },
        });
        break;
      case 'customer-expired':
        this.obj.CustomFilters = ['FilterTaxCode', 'CustomerStoreType', 'CityId', 'FilterLastTimeSupport', 'FilterSupportId', 'CustomerStatusType', 'DistrictId', 'CustomerPotentialType', 'FilterSaleId', 'FilterCustomerType', 'CustomerActivityType', 'FilterAccountSource', 'FilterSupportExpire2','FilterCreatedDate','FilterInterestedProductId'];
        this.obj.Url = '/admin/MCRMCustomer/GetExpireCustomer';
        this.obj.Features.unshift({
          name: "Xuất dữ liệu",
          icon: "la la-download",
          className: 'btn btn-success',
          systemName: ActionType.Export,
          click: () => {
            if (this.itemData?.Paging?.Total > 50000) {
              this.dialogService.Alert('Thông báo', 'File export tối đa 50 nghìn dòng!');
              this.export();
            } else this.export()
          },
        });
        break;
      case 'customer-business':
        this.obj.CustomFilters = ['FilterTaxCode', 'CustomerStoreType', 'CityId', 'FilterLastTimeSupport', 'FilterSupportId', 'CustomerStatusType', 'DistrictId', 'CustomerPotentialType', 'FilterSaleId', 'FilterCustomerType', 'FilterAccountSource'];
        this.obj.Url = '/admin/MCRMCustomer/GetBusinessCustomer';
        this.obj.StatisticalComponent = StatisticalCustomerComponent;
        break;
      case 'customer-affiliate':
        this.obj.CustomFilters = ['FilterTaxCode', 'FilterCustomerType', 'CityId', 'FilterSupportId', 'FilterCustomerRef', 'DistrictId'];
        this.obj.Url = '/admin/MCRMCustomer/GetCustomerAffiliate';
        this.obj.StatisticalComponent = StatisticalCustomerComponent;
        break;
      case 'customer-iframe':
        this.obj.CustomFilters = ['FilterSaleId', 'FilterCustomerType', 'CityId', 'FilterIframeContractId', 'FilterSupportId', 'FilterTaxCode', 'DistrictId'];
        this.obj.Url = '/admin/MCRMCustomer/GetCustomerIframe';
        break;
    }
  }
  async export() {
    if (this.items && this.items.length > 0) {
      this.loading = true;
      let typename = this.params && this.params["type"];
      let type = 1;
      if (typename == 'customer-expired') type = 2;
      let objData: TableData = this.itemData;
      objData.Export = {
        Type: ExportType.Excel,
      }
      let urlExport = '/admin/MCRMCustomer/ExportData/' + type + '';
      let fileName = "Danh sách khách hàng CRM_" + new Date().getTime();
      return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
        this.loading = false
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            break;
          case HttpEventType.Response:
            let extension = 'xlsx';
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = fileName + '.' + extension;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }
        return true;
      }).catch(ex => {
        this.loading = false;
      });
    }
    else {
      ToastrHelper.Error('Không có dữ liệu xuất excel');
    }
  }

  public downloadFile() {
    let url = AppConfig.ApiUrl.replace('/api', '/Reports/FileImportCRM.xlsx');;
    let link: any = document.createElement("a");
    link.href = url;
    link.download = 'FileImportCRM.xlsx';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  }
  public async readFile(item: any, resultUploads: any[]): Promise<void> {
    if (resultUploads && resultUploads.length > 0) {
      let items: any[] = resultUploads[0];
      if (!items && items.length == 0) {
        ToastrHelper.Error('Không có dữ liệu cần nhập vào CRM');
        return;
      }

      this.dialogService.WapperAsync({
        cancelText: 'Đóng',
        confirmText: 'Xuất dữ liệu',
        title: 'Dữ liệu nhập vào CRM',
        size: ModalSizeType.ExtraLarge,
        objectExtra: {
          items: items,
        },
        object: MCRMCustomerListImportComponent,
      }, async () => {
        await this.loadItems();
      }, null, null, async () => {
        await this.loadItems();
      });
    }
  }
}