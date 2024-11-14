import { Component, ViewChild } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ActionData } from '../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { ExportStatisticComponent } from './export.statistic/export.statistic.component';
import { MShareStatisticType } from '../../../_core/domains/entities/meeyshare/enums/ms.statistic.type';
import { TableStatisticFeedComponentComponent } from './table.statistic/table.statistic.feed.component';
import { MeeyShareStatisticEntity } from '../../../_core/domains/entities/meeyshare/ms.statistic.entity';
import { TableStatisticInteractionComponentComponent } from './table.statistic/table.statistic.interaction.component';

@Component({
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent extends EditComponent {
  statistic: any;
  reportDate: string;
  loading: boolean = false;
  actions: ActionData[] = [];
  reportType = MShareStatisticType.Feed;
  MShareStatisticType = MShareStatisticType;
  item: MeeyShareStatisticEntity = new MeeyShareStatisticEntity();
  @ViewChild('gridFeed') gridFeed: TableStatisticFeedComponentComponent;
  @ViewChild('gridInteraction') gridInteraction: TableStatisticInteractionComponentComponent;

  constructor() {
    super();
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({
      Name: 'Meey Share'
    });
    this.breadcrumbs.push({
      Name: 'Báo cáo số liệu',
    });
    this.choiceReportType(MShareStatisticType.Feed);
  }

  async viewReport(type: MShareStatisticType) {
    this.loading = true;
    switch (type) {
      case MShareStatisticType.Feed: {
        let valid = await validation(this.item);
        if (valid) await this.gridFeed.reloadGrid(this.item.ReportDate);
      } break;
      case MShareStatisticType.Interaction: {
        let valid = await validation(this.item);
        if (valid) await this.gridInteraction.reloadGrid(this.item.ReportDate);
      } break;
    }
    this.updateReportDateText();
    this.loading = false;
  }

  choiceReportType(type: MShareStatisticType) {
    this.reportType = type;
    let date: Date = new Date();
    date.setDate(date.getDate() - 6);
    this.item.ReportDate = [date, new Date()];
    this.updateReportDateText();
  }

  openPopupExport() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.Small,
      title: 'Xuất dữ liệu thô',
      confirmText: 'Xuất dữ liệu',
      object: ExportStatisticComponent,
    });
  }

  private updateReportDateText() {
    this.reportDate = this.item.ReportDate
      ? "(Từ " + UtilityExHelper.dateString(this.item?.ReportDate[0]) + ' - ' + UtilityExHelper.dateString(this.item?.ReportDate[1]) + ")"
      : null;
  }
}
