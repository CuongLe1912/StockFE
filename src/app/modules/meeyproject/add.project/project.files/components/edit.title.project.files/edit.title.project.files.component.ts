import { Component, Input, OnInit } from '@angular/core';
import { MPOProjectService } from '../../../../../../modules/meeyproject/project.service';
import { validation } from '../../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { MPOProjectItemEntity } from '../../../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';

@Component({
  templateUrl: './edit.title.project.files.component.html',
  styleUrls: ['./edit.title.project.files.component.scss']
})
export class MPOEditTitleProjectFilesComponent implements OnInit {
  @Input() params: any;

  item: MPOProjectItemEntity = new MPOProjectItemEntity();
  id: string;
  projectMeeyId: string;

  constructor(private service: MPOProjectService) { }

  ngOnInit() {
    let item = this.params && this.params['item'];
    this.projectMeeyId = this.params && this.params['projectMeeyId'];
    this.id = item && item._id;
    this.item.TitleFile = item && item.title;
  }

  public async confirm(): Promise<boolean> {
    let validator = await validation(this.item, ["TitleFile"]);
    if (validator) {
      let item = {
        title: this.item.TitleFile,
        id: this.id,
      }
      return await this.service.updateItemFiles(this.projectMeeyId, item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Cập nhật tài liệu thành công');
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
