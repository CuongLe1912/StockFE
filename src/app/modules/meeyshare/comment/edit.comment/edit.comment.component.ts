import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../_core/helpers/app.config';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { MeeyShareCommentEntity } from '../../../../_core/domains/entities/meeyshare/ms.comment.entity';
import { MShareCommentStatus } from '../../../../_core/domains/entities/meeyshare/enums/ms.status.type';

@Component({
    templateUrl: './edit.comment.component.html',
    styleUrls: [
        './edit.comment.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCommentComponent extends EditComponent implements OnInit {
    id: string;
    @Input() params: any;
    viewer: boolean = true;
    loading: boolean = true;
    event: AdminEventService;
    item: MeeyShareCommentEntity;
    MShareCommentStatus = MShareCommentStatus;

    constructor() {
        super();
        this.state = this.getUrlState();
        this.event = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        await this.loadItem();
        this.loading = false;
    }

    viewComment() {
        let url = this.item.FeedUrl;
        window.open(url, '_blank');
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('meeyShareComment', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeeyShareCommentEntity, result.Object as MeeyShareCommentEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MeeyShareCommentEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = this.item.Status == MShareCommentStatus.Hidden
                ? await validation(this.item, ['Reason'])
                : true;
            if (valid) {
                let data = {
                    "isActive": this.item.Status == MShareCommentStatus.Hidden ? false : true,
                    "hiddenReason": this.item.Status == MShareCommentStatus.Hidden ? this.item.Reason : null
                };

                return await this.service.callApiByUrl('meeyShareComment/update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Cập nhật bình luận thành công');
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
}