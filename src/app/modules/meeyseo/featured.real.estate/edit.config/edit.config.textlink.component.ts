import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSConfigTextLinkEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    templateUrl: './edit.config.textlink.component.html',
    styleUrls: [
        './edit.config.textlink.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditConfigTextLinkComponent extends EditComponent implements OnInit {
    id: string;
    loading: boolean;
    structureId: string;
    overview: string = '';
    service: MSSeoService;
    properties: string[] = [];
    isUpadte: boolean = false;
    dialog: AdminDialogService;
    item: MSConfigTextLinkEntity = new MSConfigTextLinkEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        await this.loadItem();
    }

    private async loadItem() {
        this.item = EntityHelper.createEntity(MSConfigTextLinkEntity);
        this.item.Value = this.params && this.params['value'];
    }

    async confirm() {
        let valid = await validation(this.item);
        if (valid) {
            let data = {
                "value": this.item.Value,
                "adminUserId": this.authen.account.Id,
            };
            return await this.service.callApi('MSHighlight', 'UpdateConfigSetting/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật Số text link tối đa hiển thị trên trang thành công');
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
}