import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MeeyReviewUserEntity } from '../../../../_core/domains/entities/meeyreview/mrv.user.entity';

@Component({
  templateUrl: './add.user.component.html',
  styleUrls: ['./add.user.component.scss']
})
export class AddUserComponent extends EditComponent implements OnInit {
  @Input() params: any;
  viewer: boolean;
  loading: boolean;
  allowVerify: boolean;
  service: AdminApiService;
  dialog: AdminDialogService;
  item: MeeyReviewUserEntity;
  id: string;
  status: any;
  isActived: boolean;
  @ViewChild('uploadImage') uploadImage: EditorComponent;

  constructor() {
    super();
    this.service = AppInjector.get(AdminApiService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    await this.loadItem();
    this.loading = false;
  }

  private async loadItem() {
    
    this.id = this.params && this.params['id'];
    this.viewer = this.params && this.params['viewer'];
    if (this.id) {
      await this.service.item('meeyreviewuser/items', this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MeeyReviewUserEntity, result.Object as MeeyReviewUserEntity);
          if (this.item.Phone == '0') this.item.Phone = '';
          this.item.StatusTypeToogle = this.item.StatusType == 1 ? true : false;
        } else ToastrHelper.ErrorResult(result);
      })
    } else this.item = new MeeyReviewUserEntity();
  }
  changeStatus(): void {
    // let origialItem: any = this.originalItems.find(c => c['_id'] == item['_id']);
    // if (origialItem.status == 1) origialItem.status = 2;
    // else origialItem.status = 1;
    // let data = {
    //   'status': origialItem.status,
    //   'adminUserId': this.authen.account.Id,
    // };
    this.service.callApi('MeeyReviewUser', 'UpdateStatus/', MethodType.Post).then(async (result) => {
      
      // if (ResultApi.IsSuccess(result)) {
      //   this.loadItems();
      //   return;
      // } ToastrHelper.ErrorResult(result);
    }, (e: any) => {
      ToastrHelper.Exception(e);
    });
  }

}
