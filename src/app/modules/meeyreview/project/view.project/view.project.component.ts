import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MeeyReviewProjectEntity } from '../../../../_core/domains/entities/meeyreview/mrv.project.entity';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { AppInjector } from '../../../../app.module';

@Component({
  templateUrl: './view.project.component.html',
  styleUrls: ['./view.project.component.scss']
})
export class ViewProjectComponent implements OnInit {

  @Input() params: any;
  viewer: boolean;
  loading: boolean;
  service: AdminApiService;
  dialog: AdminDialogService;
  item: MeeyReviewProjectEntity;
  id: string;
  isActived: boolean;
  @ViewChild('uploadImage') uploadImage: EditorComponent;

  constructor() {
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
      await this.service.item('meeyreviewproject/items', this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MeeyReviewProjectEntity, result.Object as MeeyReviewProjectEntity);
        } else ToastrHelper.ErrorResult(result);
      })
    } else this.item = new MeeyReviewProjectEntity();
  }
}
