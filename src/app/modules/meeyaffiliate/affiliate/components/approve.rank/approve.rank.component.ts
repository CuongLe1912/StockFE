import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MafAffiliateEntity } from '../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MAFAffiliateService } from '../../affiliate.service';

@Component({
  templateUrl: './approve.rank.component.html',
  styleUrls: ['./approve.rank.component.scss']
})
export class MAFApproveRankComponent extends EditComponent implements OnInit {
  @Input() params: any;
  disabled: boolean = true;

  item: MafAffiliateEntity = new MafAffiliateEntity();
  service: MAFAffiliateService;
  isApprove: boolean = false;

  constructor() {
    super();
    this.service = AppInjector.get(MAFAffiliateService);
  }

  ngOnInit() {
    this.item = this.getParam("item");
    if (this.item.AllowApproveRankCumulative) {
      this.disabled = false;
      this.isApprove = true;
    }
  }

  public async confirm(): Promise<boolean> {
    if (this.item) {
      return await this.service.approveRank(this.item.Id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Xác nhận duyệt chuyển cấp thành: ' + this.item.RankCumulativeNext);
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
