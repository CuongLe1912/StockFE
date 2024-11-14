import * as _ from 'lodash';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';

@Component({
    templateUrl: './popup.view.user.component.html',
    styleUrls: ['./popup.view.user.component.scss'],
})
export class MLPopupViewUserComponent implements OnInit {
    @Input() params: any;
    service: MLUserService;
    loading: boolean = true;
    dialogService: AdminDialogService;
    item: MLUserEntity = new MLUserEntity();

    constructor() {
        this.service = AppInjector.get(MLUserService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MLUserEntity();
        let meeyId = this.params && this.params['meeyId'];
        if (meeyId) {
            await this.service.getUserByMeeyId(meeyId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLUserEntity, result.Object as MLUserEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            let email = this.params && this.params['email'];
            if (email) {
                await this.service.getByPhoneOrEmail(email).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.item = EntityHelper.createEntity(MLUserEntity, result.Object as MLUserEntity);
                    } else {
                        let phone = this.params && this.params['phone'];
                        if (phone) {
                            await this.service.getByPhoneOrEmail(phone).then((result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    this.item = EntityHelper.createEntity(MLUserEntity, result.Object as MLUserEntity);
                                } else {
                                    this.dialogService.HideAllDialog();
                                    let message = result && result.Description;
                                    this.dialogService.Alert('Thông báo', message);
                                }
                            });
                        }
                    }
                });
            } else {
                let phone = this.params && this.params['phone'];
                if (phone) {
                    await this.service.getByPhoneOrEmail(phone).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            this.item = EntityHelper.createEntity(MLUserEntity, result.Object as MLUserEntity);
                        } else {
                            this.dialogService.HideAllDialog();
                            let message = result && result.Description;
                            this.dialogService.Alert('Thông báo', message);
                        }
                    });
                }
            }
        }
    }
}