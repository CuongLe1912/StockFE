import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOReviewContributeEntity } from '../../../../_core/domains/entities/meeyproject/mpo.review.contribute';

@Component({
    templateUrl: './view.project.review.contribute.component.html',
    styleUrls: [
        './view.project.review.contribute.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewProjectReviewContributeComponent extends EditComponent implements OnInit {
    message: string;
    loading: boolean;
    processDuplicate: boolean;
    service: MPOProjectService;
    dialog: AdminDialogService;
    eventService: AdminEventService;
    item: MPOReviewContributeEntity = new MPOReviewContributeEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MPOProjectService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.eventService = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        await this.loadItem();
    }

    private async loadItem() {
        this.loading = true;
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('mporeviewcontribute/item', id).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOReviewContributeEntity, result.Object as MPOReviewContributeEntity);
                    if (!this.item.MeeyId) this.item.MeeyId = 'Ẩn danh';
                    if (!this.item.Seen) {
                        let data = {
                            "updatedBy": {
                                "data": {
                                    "_id": this.authen.account.Id,
                                    "fullname": this.authen.account.FullName
                                },
                                "source": 'admin'
                            }
                        }
                        await this.service.callApi('mporeviewcontribute', 'updatestatus/' + id, data, MethodType.Put).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                this.eventService.RefreshGrids.emit({
                                    Name: 'MPOReviewContribute'
                                });
                            } else {
                                ToastrHelper.ErrorResult(result);
                                return;
                            }
                        });
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                    return;
                }
            });
        }


        this.loading = false;
    }

    async duplicate() {
        if (this.item?.ProjectName) {
            this.processDuplicate = true;
            await this.service.callApi('mporeviewcontribute', 'duplicate/' + this.item.ProjectName, null, MethodType.Get).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.message = result?.Object >= 1 ? "Tên dự án đã tồn tại" : "Tên dự án chưa tồn tại";
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
            this.processDuplicate = false;
        } else {
            ToastrHelper.Error("Tên dự án không đúng");
            return;
        }
    }    

    public async confirm(): Promise<boolean> {
        return true;
    }
}