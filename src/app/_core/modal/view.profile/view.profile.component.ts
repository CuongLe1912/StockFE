declare var toastr: any;
import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../domains/data/result.api';
import { EntityHelper } from '../../helpers/entity.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminUserProfileDto } from '../../domains/objects/user.dto';
import { AdminDataService } from '../../services/admin.data.service';

@Component({
    templateUrl: 'view.profile.component.html',
})
export class ModalViewProfileComponent implements OnInit {
    @Input() params: any
    loading: boolean = true;
    item: AdminUserProfileDto = new AdminUserProfileDto();

    constructor(
        public data: AdminDataService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    async confirm() {
        return true;
    }

    private async loadItem() {
        let id = this.params && this.params['id'],
            email = this.params && this.params['email'];
        if (email) {
            await this.service.profileByEmail(email).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AdminUserProfileDto, result.Object);
                }
            });
        } else {
            await this.service.profile(id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AdminUserProfileDto, result.Object);
                }
            });
        }
    }
}
