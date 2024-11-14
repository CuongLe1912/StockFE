import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../app.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { InvestorTypeService } from './mpo.investor.type.service';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AddModalInvestorTypeComponent } from './add-modal/add-modal.component';
import { MPOProjectInvestorUnitTypeEntity } from '../../../_core/domains/entities/meeyproject/mpo.investor.type.entity';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})

export class InvestorTypeComponent extends GridComponent implements OnInit {
  allowEdit: boolean = true;
  authService: AdminAuthService;

  constructor(public apiService: InvestorTypeService) {
    super();
    this.authService = AppInjector.get(AdminAuthService);
  }

  obj: GridData = {
    Reference: MPOProjectInvestorUnitTypeEntity,
    Size: ModalSizeType.Large,
    Imports: [],
    Exports: [],
    Filters: [],
    HideSearch: true,
    UpdatedBy: false,
    CustomFilters: ['Name', 'CreatedAt', 'CreatedBySearch', 'ActiveSearch'],
    Features: [
      ActionData.addNew(() => { this.open(null, false) }),
      ActionData.reload(() => { this.loadItems(); }),
    ],
    Actions: [
      ActionData.viewDetail((item: any) => {
        this.open(item);
      }),
      ActionData.edit((item: any) => {
        this.open(item, false);
      }),
      ActionData.delete((item: any) => {
        this.deleteType(item);
      })],
  };

  deleteType(id: any) {
    this.obj.ReferenceName = 'mpoprojectInvestor/DeleteInvestorUnitType';
    if (typeof (id) == 'object') {
      id = id.Id;
    }
    if (this.obj && this.obj.Reference) {
      this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu này?', () => {
        this.apiService.deleteType(id).then((result: ResultApi) => {
          if (result && result.Type == ResultType.Success) {
            ToastrHelper.Success('Xóa thành công loại đơn vị');
            this.loadItems();
          } else ToastrHelper.ErrorResult(result);
        });
      });
    }
  }

  async ngOnInit() {
    this.properties = [
      { Property: 'index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80, DisableOrder: true },
      { Property: "Name", Title: "Tên loại đơn vị", Type: DataType.String, DisableOrder: true },
      { Property: "CreatedBy", Title: "Người tạo", Type: DataType.String, DisableOrder: true },
      { Property: "CreatedAt", Title: "Ngày tạo", Type: DataType.DateTime, Align: 'center', PipeType: PipeType.Date, DisableOrder: true },
      {
        Property: "Active", Title: "Kích hoạt", Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          let checked = item.Active;
          item.isActive = checked;
          let text = '';
          if (this.allowEdit) {
            text = '<p class="d-flex align-items-center justify-content-center">'
              + '<a routerLink="quickView" type="verified">'
              + '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
              + (checked
                ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
                : '<input type="checkbox" name="select">')
              + '<span></span></label></span></a></p>';
          } else {
            text = '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
              + (checked
                ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
                : '<input type="checkbox" name="select">')
              + '<span></span></label></span>';
          }
          return text;
        }
      },
    ]
    this.obj.Url = "admin/MPOProjectInvestorUnitType/GetInvestorUnitType";
    this.render(this.obj);
    await this.allowPermissions();
  }

  private async allowPermissions() {
    this.allowEdit = await this.authService.permissionAllow('MPOProjectInvestorUnitType', this.ActionType.Edit);
  }

  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 30;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.index = (pagesize * (pageindex - 1)) + (index + 1);
      });
    }
  }

  open(item: any, viewer = true) {
    let _title = item?.Id ? 'Chi tiết' : 'Thêm mới';
    let obj: any = {
      cancelText: 'Đóng',
      title: _title + ' loại đơn vị',
      size: ModalSizeType.Medium,
      className: 'modal-body-project',
      objectExtra: {
        item: item,
        viewer: viewer,
      },
      object: AddModalInvestorTypeComponent,
    };
    if (!viewer) obj.confirmText = 'Xác nhận';

    this.dialogService.WapperAsync(obj, async () => {
      await this.loadItems();
    });
  }

  async quickView(item: any, type: string) {
    return await this.apiService.updateStatus(item).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        ToastrHelper.Success('Cập nhật trạng thái loại đơn vị thành công');
        this.loadItems();
        return true;
      } else {
        ToastrHelper.ErrorResult(result);
        return false;
      }
    });
  }
}
