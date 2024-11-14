import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGProductEntity } from '../../../../_core/domains/entities/meeygroup/mg.product.entity';

@Component({
    templateUrl: './edit.product.component.html',
    styleUrls: [
        './edit.product.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProductComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    item: MGProductEntity;
    loading: boolean = true;
    service: AdminApiService;
    @ViewChild('uploadIcon') uploadIcon: EditorComponent;
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
            await this.service.item('mgproduct', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGProductEntity, result.Object as MGProductEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGProductEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                // upload
                let icons = await this.uploadIcon.image.upload();

                // upload
                let images = await this.uploadImage.image.upload();

                // update user
                let obj: MGProductEntity = _.cloneDeep(this.item);
                obj.Icon = icons && icons.length > 0 ? icons[0].Path : '';
                obj.Image = images && images.length > 0 ? images[0].Path : '';
                return await this.service.save('mgproduct', obj).then((result: ResultApi) => {
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
