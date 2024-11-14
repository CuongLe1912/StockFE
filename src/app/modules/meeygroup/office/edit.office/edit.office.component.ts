import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGOfficeEntity } from '../../../../_core/domains/entities/meeygroup/mg.office.entity';

@Component({
    templateUrl: './edit.office.component.html',
    styleUrls: [
        './edit.office.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditOfficeComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    item: MGOfficeEntity;
    @Input() params: any;
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
            await this.service.item('mgoffice', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGOfficeEntity, result.Object as MGOfficeEntity);
                    if(this.item.Lat) this.item["Lat"] = `${this.item.Lat}`;
                    if(this.item.Lng) this.item["Lng"] = `${this.item.Lng}`;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGOfficeEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                // upload
                let images = await this.uploadImage.image.upload();

                // update user
                let obj: MGOfficeEntity = _.cloneDeep(this.item);
                obj.Image = images && images.length > 0 ? images[0].Path : '';
                return await this.service.save('mgoffice', obj).then((result: ResultApi) => {
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