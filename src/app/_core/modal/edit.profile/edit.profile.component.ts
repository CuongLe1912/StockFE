declare var toastr: any;
import * as _ from 'lodash';
import { validation } from '../../decorators/validator';
import { ResultApi } from '../../domains/data/result.api';
import { EntityHelper } from '../../helpers/entity.helper';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { EditorComponent } from '../../editor/editor.component';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminUserProfileDto } from '../../domains/objects/user.dto';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminDataService } from '../../services/admin.data.service';

@Component({
    templateUrl: 'edit.profile.component.html',
})
export class ModalEditProfileComponent implements OnInit {
    loading: boolean = true;
    item: AdminUserProfileDto = new AdminUserProfileDto();
    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

    constructor(
        public data: AdminDataService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    async confirm() {
        let valid = await validation(this.item, ['FullName', 'Phone']);
        if (valid) {
            // upload
            let images = await this.uploadAvatar.image.upload();
            
            // save profile
            let obj: AdminUserProfileDto = _.cloneDeep(this.item);
            obj.Avatar = images && images.length > 0 ? images[0].Path : '';
            return await this.service.updateProfile(obj).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật thông tin tài khoản thành công');
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, () => {
                return false;
            });
        } return false;
    }

    private async loadItem() {
        await this.service.profile().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(AdminUserProfileDto, result.Object);
            }
        });
    }
}
