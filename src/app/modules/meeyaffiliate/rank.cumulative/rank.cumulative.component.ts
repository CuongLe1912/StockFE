import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../app.module';
import { validations } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { MAFRankCumulativeService } from './rank.cumulative.service';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { MAFGridHistoryChangeComponent } from './components/grid.history.change';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MAFRankCumulativeEntity } from '../../../_core/domains/entities/meeyaffiliate/rank.cumulative.entity';

@Component({
  selector: 'meey-rank.cumulative',
  templateUrl: './rank.cumulative.component.html',
  styles: ['./rank.cumulative.component.scss']
})
export class MAFRankCumulativeComponent extends EditComponent implements OnInit {
  actions: ActionData[] = [];
  loading: boolean = false;
  isEdit: boolean = false;

  items: MAFRankCumulativeEntity[] = [];

  service: MAFRankCumulativeService;
  constructor() {
    super();
    this.service = AppInjector.get(MAFRankCumulativeService);
  }

  async ngOnInit() {
    this.isEdit = this.getParam("isEdit");
    this.renderActions();
    await this.loadItem();
  }

  private async renderActions() {
    let actions: ActionData[] = [{
      name: 'Lịch sử thay đổi',
      icon: 'la la-history',
      systemName: ActionType.ViewDetail,
      className: 'btn btn-secondary',
      click: () => this.history()
    }];

    if (!this.isEdit) {
      actions.push({
        name: 'Sửa',
        icon: 'la la-edit',
        systemName: ActionType.Edit,
        className: 'btn btn-primary',
        click: () => this.edit()
      });
    } else {
      actions.push(ActionData.back(() => this.back()));
      actions.push({
        name: 'Lưu',
        icon: 'la la-save',
        processButton: true,
        className: 'btn btn-primary',
        systemName: ActionType.Edit,
        click: async () => await this.confirm()
      });
    }
    this.actions = await this.authen.actionsAllow(MAFRankCumulativeEntity, actions);
  }

  async loadItem() {
    await this.service.ActiveItem().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.items = EntityHelper.createEntities(MAFRankCumulativeEntity, result.Object);
      }
    })
  }

  edit() {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafrankcumulative',
      object: {
        isEdit: true,
      }
    };
    this.router.navigate(['/admin/mafrankcumulative/edit'], { state: { params: JSON.stringify(obj) } });
  }

  view() {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafrankcumulative',
      object: {
        isEdit: false,
      }
    };
    this.router.navigate(['/admin/mafrankcumulative'], { state: { params: JSON.stringify(obj) } });
  }

  back() {
    if (this.state) {
      if (this.isEdit) this.view();
      else
        this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
    }
    else
      window.history.back();
  }

  history() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.Large,
      title: 'Lịch sử thay đổi',
      object: MAFGridHistoryChangeComponent,
    });
  }

  public async confirm(): Promise<boolean> {
    if (await validations(this.items)) {
      this.dialogService.ConfirmAsync("Xác nhận thay đổi cấu hình các cấp bậc trong Tiếp thị liên kết?", async () => {
        this.processing = true;
        return await this.service.AddOrUpdate(this.items).then((result: ResultApi) => {
          this.processing = false;
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Thay đổi cấu hình thành công');
            this.view();
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        }, () => {
          return false;
        });
      });

    }
    return false;
  }

}
