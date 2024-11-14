import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGQRLeaderEntity } from '../../../../_core/domains/entities/meeygroup/mg.qr.leader.entity';

@Component({
    templateUrl: './edit.qr.leader.component.html',
    styleUrls: [
        './edit.qr.leader.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditQRLeaderComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    item: MGQRLeaderEntity;
    loading: boolean = true;
    service: AdminApiService;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('mgqrleader', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGQRLeaderEntity, result.Object as MGQRLeaderEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGQRLeaderEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                // upload
                let images = await this.uploadImage.image.upload();

                // update user
                let obj: MGQRLeaderEntity = _.cloneDeep(this.item);
                obj.Avatar = images && images.length > 0 ? images[0].Path : '';
                return await this.service.save('mgqrleader', obj).then((result: ResultApi) => {
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
        return false;
    }
}