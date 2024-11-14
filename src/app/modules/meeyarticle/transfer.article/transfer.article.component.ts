import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { StoreHelper } from '../../../_core/helpers/store.helper';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLPopupResultArticleComponent } from '../popup.result.article/popup.result.article.component';
import { MLArticleEntity, MLArticleTransferDto } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './transfer.article.component.html',
    styleUrls: ['./transfer.article.component.scss'],
})
export class MLTransferArticleComponent implements OnInit {
    ids: number[] = [];
    @Input() params: any;
    auth: AdminAuthService;
    ActionType = ActionType;
    disabled: boolean = true;
    items: MLArticleEntity[];
    service: MLArticleService;
    dialog: AdminDialogService;
    key = 'MLArticleTransferDto.Department';
    item: MLArticleTransferDto = new MLArticleTransferDto();

    constructor() {
        this.auth = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(MLArticleService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.item.Coordinator = this.auth.account && this.auth.account.Email;
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        this.item.DepartmentId = StoreHelper.loadStoreItem(this.key);
        this.ids = this.items && this.items.filter(c => c[ActionType.TransferArticle] == true).map(c => { return c.Id });
    }

    closePopup() {
        this.dialog.HideAllDialog();
    }

    async confirm() {
        let valid = await validation(this.item, ['Reason']);
        if (valid && this.item && this.ids && this.ids.length > 0) {
            return await this.service.transfer(this.ids, this.item).then((result: ResultApi) => {
                StoreHelper.storeItem(this.key, this.item.DepartmentId);
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object == true) {
                        let message = 'Điều chuyển ' + this.ids.length + ' tin thành công';
                        ToastrHelper.Success(message);
                        return true;
                    } else {
                        let items = result.Object as any[];
                        if (items && items.length > 0) {
                            items.forEach((item: any, index: number) => {
                                let itemDb = this.items.find(c => c.MeeyId == item.MeeyId);
                                if (itemDb) {
                                    itemDb.Index = index + 1;
                                    itemDb['Status'] = item.Status;
                                    itemDb['Reason'] = item.Message;
                                }
                            });
                            setTimeout(() => {
                                this.dialog.WapperAsync({
                                    size: ModalSizeType.Large,
                                    title: 'Kết quả điều chuyển tin',
                                    object: MLPopupResultArticleComponent,
                                    objectExtra: { items: _.cloneDeep(this.items) }
                                });
                            }, 500);
                        }
                        let success = this.items.filter(c => c['Status'] == 'Thành công').length;
                        return success > 0;
                    }
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    async toggleDisableButton() {
        let valid = await validation(this.item, ['DepartmentId', 'SupportId'], true);
        this.disabled = !(valid && this.ids && this.ids.length > 0);
    }

    removedItems(items: MLArticleEntity[]) {
        this.ids = this.items && items.map(c => { return c.Id });
    }
}