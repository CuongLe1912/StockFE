import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLPopupResultArticleComponent } from '../popup.result.article/popup.result.article.component';

@Component({
    templateUrl: './sync.article.component.html',
    styleUrls: ['./sync.article.component.scss'],
})
export class MLSyncArticleComponent implements OnInit {
    ids: number[] = [];
    @Input() params: any;
    ActionType = ActionType;
    disabled: boolean = true;
    items: MLArticleEntity[];
    service: MLArticleService;
    dialog: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(MLArticleService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        this.ids = this.items && this.items.filter(c => c[ActionType.SyncArticle] == true).map(c => { return c.Id });
        this.toggleDisableButton();
    }

    closePopup() {
        this.dialog.HideAllDialog();
    }

    async confirm() {
        if (this.ids && this.ids.length > 0) {
            return await this.service.sync(this.ids).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object == true) {
                        let message = 'Đồng bộ ' + this.ids.length + ' tin thành công';
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
                                    title: 'Kết quả đồng bộ tin',
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

    removedItems(items: MLArticleEntity[]) {
        this.ids = this.items && items.map(c => { return c.Id });
    }

    async toggleDisableButton() {
        this.disabled = !(this.ids && this.ids.length > 0);
    }
}