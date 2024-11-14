import { Component, Input, OnInit } from '@angular/core';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { MLCompanyAuditingEntity } from '../../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
  selector: 'app-auditing.company',
  templateUrl: './auditing.company.component.html',
  styleUrls: ['./auditing.company.component.scss']
})
export class MLAuditingCompanyComponent extends EditComponent implements OnInit {
  id: any;
  isDetail = false;
  @Input() params: any;
  tab: string = 'statistical';
  detailItems: MLCompanyAuditingEntity[] = [];

  constructor() {
    super();
  }

  async ngOnInit() {
    this.id = this.getParam('id');
    this.breadcrumbs = [];
    this.breadcrumbs.push({ Name: 'Khách hàng' });
    this.breadcrumbs.push({ Name: 'Tài khoản doanh nghiệp' });
    this.breadcrumbs.push({ Name: 'Tài khoản doanh nghiệp', Link: '/admin/mlcompany' });
    this.breadcrumbs.push({ Name: 'Đối soát - Số lượt đã tra' });

    this.actions.push(ActionData.back(() => this.back()));
  }

  selectedTab(tab: string) {
    this.tab = tab;
  }

  closeTab(meeyId: string) {
    this.detailItems = this.detailItems.filter(c => c.MeeyId != meeyId);
    if (this.tab == meeyId) this.tab = 'statistical';
  }

  rowClick(item: MLCompanyAuditingEntity) {
    let detailItem = this.detailItems.find(c => c.MeeyId == item.MeeyId);
    if (!detailItem) {
      this.detailItems.push(item);
      setTimeout(() => this.tab = item.MeeyId, 500);
    } else this.tab = item.MeeyId;
  }

  back() {
    if (this.state) {
      this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
    }
    else
      window.history.back();
  }
}
