import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MAFAffiliateService } from '../../affiliate.service';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MessageHelper } from '../../../../../_core/helpers/message.helper';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MafAddNodeEntity } from '../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity';

@Component({
    templateUrl: './add.node.component.html',
    styleUrls: ['./add.node.component.scss'],
})
export class MAFAddNodeComponent implements OnInit {
    messageItem: string;
    processSearchItem: boolean;
    item: MafAddNodeEntity = new MafAddNodeEntity();

    messageChild: string;
    processSearchChild: boolean;
    child: MafAddNodeEntity = new MafAddNodeEntity();

    branchId: string;
    errorMessage: string;
    @Input() params: any;
    service: MAFAffiliateService;
    dialogService: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(MAFAffiliateService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.branchId = this.params && this.params['BranchId'];
    }

    typeChange() {
        this.errorMessage = null;
    }

    async searchItem() {
        let valid = await validation(this.item, ['Search']);
        if (valid) {
            this.messageItem = null;
            this.errorMessage = null;
            this.processSearchItem = true;
            this.service.lookupUser(this.item.Search).then((result: ResultApi) => {
                this.processSearchItem = false;
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.item = EntityHelper.createEntity(MafAddNodeEntity, result.Object);
                } else this.messageItem = !result ? MessageHelper.SystemWrong : result.Description;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
    }

    async searchChild() {
        let valid = await validation(this.child, ['Search']);
        if (valid) {
            this.messageChild = null;
            this.errorMessage = null;
            this.processSearchChild = true;
            this.service.lookupUser(this.child.Search).then((result: ResultApi) => {
                this.processSearchChild = false;
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.child = EntityHelper.createEntity(MafAddNodeEntity, result.Object);
                } else this.messageChild = !result ? MessageHelper.SystemWrong : result.Description;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
    }

    async confirm() {
        this.errorMessage = null;
        let valid = this.item?.MeeyId && this.child?.MeeyId ? true : false;
        if (valid) {
            let obj = {
                BranchId: this.branchId,
                MeeyId: this.item.MeeyId,
                Childs: [this.child.MeeyId]
            };
            return await this.service.addNode(obj).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Thêm mới khách hàng vào cây hoa hồng thanh công');
                    return true;
                }
                this.errorMessage = result && result.Description;
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
}