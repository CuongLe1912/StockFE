import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { MOTransactionRewardService } from "../transactionreward.service";
import { TransactionReWardEntity } from "../../../../_core/domains/entities/meeyorder/transactionward.entity";

@Component({
  selector: 'app-statisticals',
  templateUrl: './statisticals.component.html',
  styleUrls: ['./statisticals.component.scss']
})
export class StatisticalsComponent implements OnInit {
  @Input() params: any;
  item: TransactionReWardEntity = new TransactionReWardEntity();
  total : 0;
  items: any;
  itemsML: any;
  itemsMM: any;
  constructor(private service: MOTransactionRewardService) {
  }

  async ngOnInit() {
    await this.loadItem(0,0);
  }

  async loadItem(startDate:number, endDate:number) {
    await this.service.statistical(startDate, endDate).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.total = result.Object.total
        this.items = result.Object.listAll
        this.itemsML = result.Object.listAllML
        this.itemsMM = result.Object.listAllMM
        this.itemsML.paymentML_tx_user_numb = result.Object.listAllML.payment_tx_user != null ? Object.keys(result.Object.listAllML.payment_tx_user).length ?? 0 : 0;
        this.itemsMM.paymentMM_tx_user_numb = result.Object.listAllMM.payment_tx_user != null ? Object.keys(result.Object.listAllMM.payment_tx_user).length ?? 0 : 0;
        this.items.payment_tx_user_numb = result.Object.listAll.payment_tx_user != null ? Object.keys(result.Object.listAll.payment_tx_user).length : 0;
        this.items.transfer_tx_user_numb = result.Object.listAll.transfer_tx_user != null ? Object.keys(result.Object.listAll.transfer_tx_user).length : 0;
        this.items.charge_tx_user_numb = result.Object.listAll.charge_tx_user ? Object.keys(result.Object.listAll.charge_tx_user).length : 0;
      }
    })
  }
  async searchItem(){
    let startDate = this.item.DateRangeReward == undefined ? 0 : this.item.DateRangeReward[0]?.getTime();
    let endDate  = this.item.DateRangeReward == undefined ? 0 : this.item.DateRangeReward[1]?.getTime();
    await this.loadItem(startDate,endDate);
  }
}
