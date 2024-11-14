import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { MGProfileEntity } from '../../../../../_core/domains/entities/meeygroup/v2/mg.profile.entity';
import { MGProfileStatusType } from "../../../../../_core/domains/entities/meeygroup/enums/mg.profile.type";

@Component({
    templateUrl: './edit.profile.component.html',
    styleUrls: [
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditProfileComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    // isNew: boolean;
    viewer: boolean;
    updateStatus: boolean;
    item: MGProfileEntity;
    status: MGProfileStatusType;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    @ViewChild('uploadFile') uploadFile: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        // this.isNew = this.params && this.params['isNew'];
        this.viewer = this.params && this.params['viewer'];
        this.updateStatus = this.params && this.params['updateStatus'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mgprofile', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGProfileEntity, result.Object as MGProfileEntity);
                    if (this.updateStatus) this.item.StatusUpdate = this.item.Status;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGProfileEntity();
    }

    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                this.processing = true;
                let obj: MGProfileEntity = _.cloneDeep(this.item);
                // if (this.isNew) {
                //     obj.Status = MGProfileStatusType.New;
                //     // upload file
                //     let files = await this.uploadFile.upload();
                //     obj.File = files && files.length > 0 ? files[0].Path : '';
                // } else 
                if (this.updateStatus) {
                    obj.Status = this.status;
                } else {
                    // upload file
                    let files = await this.uploadFile.upload();
                    obj.File = files && files.length > 0 ? files[0].Path : '';
                }

                return await this.service.save('mgprofile', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        // if (this.isNew) { ToastrHelper.Success('Tạo hồ sơ thành công') } else
                        if (this.updateStatus) { ToastrHelper.Success('Cập nhật trạng thái thành công') }
                        else ToastrHelper.Success('Lưu dữ liệu thành công');
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
        return false;
    }

    async changeStatus(status: MGProfileStatusType) {
        if (status) {
            this.status = status;
        }
    }

}