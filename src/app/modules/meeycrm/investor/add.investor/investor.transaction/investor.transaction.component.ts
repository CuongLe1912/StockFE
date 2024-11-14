import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MCRMInvestorEntity } from '../../../../../_core/domains/entities/meeycrm/mcrm.investor.entity';
import { MCRMInvestorOrderHistoryGridComponent } from '../../component/investor.orderhistory.grid.component';
import { MCRMInvestorTransactionHistoryGridComponent } from '../../component/investor.transactionhistory.grid.component';

@Component({
    selector: 'mcrm-investor-transaction',
    templateUrl: './investor.transaction.component.html',
    styleUrls: [
        './investor.transaction.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class MCRMInvestorTransactionHistoryComponent extends EditComponent implements OnInit {
    @ViewChild('investorOrderGrid') investorInfo: MCRMInvestorOrderHistoryGridComponent;
    @ViewChild('investorTransactionGrid') investorDealer: MCRMInvestorTransactionHistoryGridComponent;

    id: string;
    viewer: boolean;
    @Input() params: any;
    validTabs: string[] = [];
    loading: boolean = false;
    dialog: AdminDialogService;
    item: MCRMInvestorEntity = new MCRMInvestorEntity();


    constructor() {
        super();
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        if (this.params && this.params['item'])
            this.item = this.getParam('item');
        this.viewer = this.params && this.params['viewer'];
    }
}