import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { validation } from '../../../../../_core/decorators/validator';
import { OptionItem } from '../../../../../_core/domains/data/option.item';
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MCRMInvestorImageComponent } from '../investor.image/investor.image.component';
import { MCRMInvestorEntity } from '../../../../../_core/domains/entities/meeycrm/mcrm.investor.entity';

@Component({
    selector: 'mcrm-investor-info',
    templateUrl: './investor.info.component.html',
    styleUrls: [
        './investor.info.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class MCRMInvestorInfoComponent extends EditComponent implements OnInit {

    id: string;
    viewer: boolean;
    @Input() params: any;
    validTabs: string[] = [];
    loading: boolean = false;
    item!: MCRMInvestorEntity;
    isUpdate: boolean = false;
    dialog: AdminDialogService;
    @Output() validTabChange: EventEmitter<string[]> = new EventEmitter<string[]>();


    constructor() {
        super();
        this.dialog = AppInjector.get(AdminDialogService);
    }

    saleChange(option: OptionItem) {
        if (option.originalItem?.Email) {
            this.item.SaleName = option.originalItem.Email
        } else
            this.item.SaleName = '';
    }

    supportChange(option: OptionItem) {
        if (option.originalItem?.Email) {
            this.item.SupportName = option.originalItem.Email
        } else
            this.item.SupportName = '';
    }

    async ngOnInit() {
        if (this.params && this.params['item'])
            this.item = this.getParam('item');
        this.viewer = this.params && this.params['viewer'];
        this.isUpdate = this.params && this.params['isUpdate'];
    }

    public async valid(): Promise<boolean> {
        let column = ["InvestorName", "TaxCode", "BusinessCode", "Address", "CityId", "DistrictId", "WardId", "RepresentativeName", "Phone", "Email", "ContractCode", "Domain", "StartDate", "EndDate", "WarrantyPeriod", "SaleId", "SupportId", "DBUri"];
        let valid = await validation(this.item, column)
        return valid;
    }

    private async validate() {
        this.validTabs = [];
        let investorImages = <MCRMInvestorImageComponent>this.getParam('image');
        let valid = true; //await this.valid();
        if (!await this.valid()) {
            this.validTabs.push('info');
            valid = false;
        }
        if (!await investorImages.valid()) {
            this.validTabs.push('image');
            valid = false;
        }
        this.validTabChange.emit(this.validTabs);
        return valid;
    }
}