import { Component } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { MPOStatisticEntity } from '../../../_core/domains/entities/meeyproject/mpo.project.statistic.entity';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class MPOStatisticComponent extends EditComponent {
  actions: ActionData[] = [];
  loading: boolean = false;
  item: MPOStatisticEntity = new MPOStatisticEntity();
  statistic: any;
  reportDate: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({
      Name: 'Meey Project'
    });
    this.breadcrumbs.push({
      Name: 'Báo cáo số liệu',
    });

    let date: Date = new Date();
    date.setDate(date.getDate() - 6);
    
    this.item.Date = [
      date,
      new Date()
    ];
    this.reportDate = "(Từ " + UtilityExHelper.dateString(this.item?.Date[0]) + ' - ' + UtilityExHelper.dateString(this.item?.Date[1]) + ")"
    this.loadItem();
  }

  async loadItem() {
    this.loading = true;
    let valid = await validation(this.item);
    if (valid) {
      let startDate = UtilityExHelper.dateString(this.item?.Date[0]);
      let endDate = UtilityExHelper.dateString(this.item?.Date[1]);
      this.reportDate = "(Từ " + startDate + ' - ' + endDate + ")"
      let url = 'Videos?startDate=' + startDate + '&endDate=' + endDate;
      await this.service.callApi('MPOStatistic', url).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          if (result.Object.project) {
            this.statistic = result.Object;
          } else ToastrHelper.Error(result.Object.message);
        } else
          ToastrHelper.ErrorResult(result);
      });
    }
    this.loading = false;
  }

}
