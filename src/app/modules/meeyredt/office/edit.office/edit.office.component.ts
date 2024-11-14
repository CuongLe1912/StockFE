import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MROfficeEntity } from '../../../../_core/domains/entities/meeyredt/mr.office.entity';

@Component({
    templateUrl: './edit.office.component.html',
    styleUrls: [
        './edit.office.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditOfficeComponent implements OnInit {
    id: string;
    viewer: boolean;
    tab: string = 'vn';
    item: MROfficeEntity;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    authen: AdminAuthService;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.authen = AppInjector.get(AdminAuthService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        this.id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (this.id) {
            await this.service.item('mroffice', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MROfficeEntity, result.Object as MROfficeEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MROfficeEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                // upload
                let images = await this.uploadImage.image.upload();
                let resultUploadImage = images.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0]

                let data = {
                    "topic": this.item.TopicVn,
                    "title": this.item.TitleVn,
                    "content": this.item.ContentVn,
                    "location": {
                        "lat": this.item.Lat,
                        "lng": this.item.Lng
                    },
                    "author": {
                        "data": {
                            "id": this.authen.account.Id,
                            "fullname": this.authen.account.FullName
                        }
                    }
                };
                if (resultUploadImage && resultUploadImage[0]?.s3Key)
                    data['s3Key'] = resultUploadImage[0]?.s3Key;
                if (this.id) {
                    return await this.service.callApi('mroffice', 'update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        return false;
                    });
                } else {
                    return await this.service.callApi('mroffice', 'AddNew', data, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
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
        }
        return false;
    }
}