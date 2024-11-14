import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MRNewsEntity } from '../../../../_core/domains/entities/meeyredt/mr.news.entity';

@Component({
    templateUrl: './edit.news.component.html',
    styleUrls: [
        './edit.news.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditNewsComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    viewer: boolean;
    tab: string = 'vn';
    item: MRNewsEntity;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        if (this.id)
            this.addBreadcrumb(!this.viewer ? 'Sửa bài viết' : 'Thêm mới bài viết');
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mrnews', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MRNewsEntity, result.Object as MRNewsEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MRNewsEntity();
    }
    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        if (!this.viewer)
            actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }));
        this.actions = await this.authen.actionsAllow(MRNewsEntity, actions);
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                this.processing = true;
                // upload
                let images = await this.uploadImage.image.upload();
                let resultUploadImage = images.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0]
                // update user
                let data = {
                    "category": [this.item.CategoryId],
                    "title": this.item.TitleVn,
                    "summary": this.item.SummaryVn,
                    "content": this.item.ContentVn,
                    "author": {
                        "data": {
                            "id": this.authen.account.Id,
                            "fullname": this.authen.account.FullName
                        }
                    }
                };
                if (resultUploadImage && resultUploadImage[0]?.s3Key)
                    data['s3Key'] = resultUploadImage[0]?.s3Key;
                if (!this.id) {
                    return await this.service.callApi('mrnews', 'AddNew', data, MethodType.Post).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
                            if (complete) complete();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        this.processing = false;
                        return false;
                    });
                } else {
                    return await this.service.callApi('mrnews', 'update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
                            if (complete) complete();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        this.processing = false;
                        return false;
                    });
                }
            }
        }
        return false;
    }
}