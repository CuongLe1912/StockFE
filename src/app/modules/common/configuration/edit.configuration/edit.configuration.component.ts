import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { ConfigurationService } from '../configuration.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ConfigurationEntity } from '../../../../_core/domains/entities/configuration.entity';

@Component({
    templateUrl: './edit.configuration.component.html',
    styleUrls: ['./edit.configuration.component.scss'],
})
export class ConfigurationComponent extends EditComponent implements OnInit {
    loading: boolean = true;
    item: ConfigurationEntity;
    service: ConfigurationService;

    constructor() {
        super();
        this.service = AppInjector.get(ConfigurationService);
    }

    async ngOnInit() {
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                return await this.service.save('configuration', this.item).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu cấu hình thành công');
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }

    private async loadItem() {
        this.loading = true;
        await this.service.get().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(ConfigurationEntity, result.Object);
            } else this.item = new ConfigurationEntity();
        });
        this.loading = false;
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.saveUpdate('Lưu thay đổi', () => { this.confirm() }),
        ]
        this.actions = await this.authen.actionsAllow(ConfigurationEntity, actions);
    }
}