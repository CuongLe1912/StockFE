import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { MPInvoiceEntity } from '../../../../../_core/domains/entities/meeypay/mp.invoice.entity';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MPInvoiceService } from '../../invoice.service';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';
import { MPInvoiceStatusType } from '../../../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { MPExportInvoiceComponent } from '../export.invoice/export.invoice.component';

@Component({
  selector: 'app-view.invoice',
  templateUrl: './view.invoice.component.html',
  styleUrls: ['./view.invoice.component.scss']
})
export class MPViewInvoiceComponent extends EditComponent implements OnInit {
  @Input() params: any;

  actions: ActionData[] = [];
  loading: boolean = false;

  id: any;
  items: MPInvoiceEntity[];
  item: MPInvoiceEntity;

  showChildrens = false;
  addInvoice = false;

  service: MPInvoiceService;
  constructor() {
    super();
    this.service = AppInjector.get(MPInvoiceService);
  }

  async ngOnInit() {
    this.id = this.getParam("id");

    await this.loadItem();
    this.renderActions();
    this.addBreadcrumb("Đơn hàng")
    this.addBreadcrumb("Quản lý hóa đơn")
    this.addBreadcrumb("Thông tin xuất hóa đơn");
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
    ];
    if (this.item.Status == MPInvoiceStatusType.New) {
      actions.push({
        name: 'Sửa hóa đơn',
        processButton: true,
        icon: 'la la-pencil',
        className: 'btn btn-primary',
        systemName: ActionType.Edit,
        click: () => {
          let obj: NavigationStateData = {
            id: this.id,
            prevUrl: "/admin/mpinvoice",
          };
          this.router.navigate(["/admin/mpinvoice/edit"], {
            state: { params: JSON.stringify(obj) },
          });
        }
      });
      actions.push({
        icon: 'fa fa-upload',
        name: 'Xuất hóa đơn',
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => {
          this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: {
              id: this.item.Id,
            },
            title: 'Xuất hóa đơn',
            object: MPExportInvoiceComponent,
          }, async () => this.back());
        }
      })
    }
    this.actions = await this.authen.actionsAllow(MPInvoiceEntity, actions);
  }

  async loadItem() {
    await this.service.item('MPInvoice', this.id).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = EntityHelper.createEntity(MPInvoiceEntity, result.Object);
        this.items = EntityHelper.createEntities(MPInvoiceEntity, this.item.Childrens);
      }
    });
  }

  public back() {
    if (this.state)
      this.router.navigateByUrl(this.state.prevUrl, { state: { params: JSON.stringify(this.state) } });
    else
      window.history.back();
  }

}
