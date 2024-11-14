import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../app.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { InvestorUnitService } from './mpo.investor.unit.service';
import { DataType } from '../../../_core/domains/enums/data.type';
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { SaveType } from '../../../_core/domains/entities/meeyproject/enums/mpo.save.type';
import { MPOProjectInvestorUnitEntity } from '../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOProjectInvestorRelatedComponentUnitComponent } from '../add.project/project.investor.related/project.investor.related.unit/project.investor.related.unit.component';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class InvestorUnitComponent extends GridComponent implements OnInit {
  allowEdit: boolean = true;
  authService: AdminAuthService;

  constructor(public apiService: InvestorUnitService) {
    super();
    this.authService = AppInjector.get(AdminAuthService);
  }

  obj: GridData = {
    Reference: MPOProjectInvestorUnitEntity,
    Size: ModalSizeType.Large,
    Imports: [],
    Exports: [],
    Filters: [],
    HideSearch: true,
    UpdatedBy: false,
    CustomFilters: ['NameSearch', 'CreatedAt', 'CreatedBySearch', 'ActiveSearch', 'Unit'],
    Features: [
      ActionData.addNew(() => { this.open(SaveType.ADD, '') }),
      ActionData.reload(() => { this.loadItems(); }),
    ],
    Actions: [
      ActionData.edit((item: any) => {
        this.open(SaveType.UPDATE, item);
      }),
      ActionData.delete((item: any) => {
        this.deleteUnit(item);
      })],
    AsynLoad: () => this.asynLoad(),
  };

  async asynLoad() {
    let listUnitType: any = [];
    await this.service.callApi("MPOProjectInvestor", 'LookupUnit').then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        listUnitType = result.Object;
      }
    });
    this.items.forEach((item: any) => {
      item['RelatedUnitTypeName'] = listUnitType?.filter(x => x._id == item.RelatedUnitType)[0]?.name ?? '';
    })
  }

  deleteUnit(id: any) {
    this.obj.ReferenceName = 'MPOProjectInvestorUnit/DeleteRelatedUnit';
    if (typeof (id) == 'object') {
      id = id.Id;
    }
    if (this.obj && this.obj.Reference) {
      this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu này?', () => {
        this.apiService.delete(id).then((result: ResultApi) => {
          if (result && result.Type == ResultType.Success) {
            ToastrHelper.Success('Xóa thành công đơn vị');
            this.loadItems();
          } else ToastrHelper.ErrorResult(result);
        });
      });
    }
  }

  async ngOnInit() {
    this.properties = [
      { Property: 'index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80, DisableOrder: true },
      { Property: "Name", Title: "Tên đơn vị liên quan", Type: DataType.String, DisableOrder: true },
      { Property: "RelatedUnitTypeName", Title: "Loại đơn vị", Type: DataType.String, DisableOrder: true, },
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
    this.obj.Url = "admin/MPOProjectInvestorUnit/GetRelatedUnit";
    this.render(this.obj);
    await this.allowPermissions();
  }

  private async allowPermissions() {
    this.allowEdit = await this.authService.permissionAllow('MPOProjectInvestorUnit', this.ActionType.Edit);
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

  open(type: SaveType, item: any) {
    let _title = type == SaveType.ADD ? 'Thêm mới' : 'Sửa';
    let objEx = item ?? {};
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      title: _title + ' đơn vị liên quan',
      objectExtra: {
        ...objEx,
        isUnit: true,
        saveType: type
      },
      object: MPOProjectInvestorRelatedComponentUnitComponent,
    }, async () => {
      await this.loadItems();
    });
  }

  async quickView(item: any, type: string) {
    return await this.apiService.updateStatus(item).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        ToastrHelper.Success('Cập nhật trạng thái đơn vị liên quan thành công');
        this.loadItems();
        return true;
      } else {
        ToastrHelper.ErrorResult(result);
        return false;
      }
    });
  }
}
