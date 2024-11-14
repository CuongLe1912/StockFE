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
import { MRBannerEntity } from '../../../../_core/domains/entities/meeyredt/mr.banner.entity';

@Component({
    templateUrl: './edit.banner.component.html',
    styleUrls: [
        './edit.banner.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditBannerComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    viewer: boolean;
    tab: string = 'vn';
    item: MRBannerEntity;
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
        this.id = this.params && this.params['id'];
        if (this.state) {
            this.viewer = this.state.viewer;
            this.id = this.id || this.state.id;
            this.addBreadcrumb(this.id ? 'Sửa banner' : 'Thêm mới banner');
        }
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mrbanner', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MRBannerEntity, result.Object as MRBannerEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MRBannerEntity();
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
        this.actions = await this.authen.actionsAllow(MRBannerEntity, actions);
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item, ['Text1', 'Text2']);
            if (valid) {
                this.processing = true;
                // upload
                let images = await this.uploadImage.image.upload();
                let resultUploadImage = images.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0]
                // update user
                let data = {
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
                    return await this.service.callApi('mrbanner', 'Add', data, MethodType.Post).then((result: ResultApi) => {
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
                    return await this.service.callApi('mrbanner', 'update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
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