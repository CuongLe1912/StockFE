import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MGBannerEntity } from '../../../../_core/domains/entities/meeygroup/mg.banner.entity';
import { MGBannerType } from '../../../../_core/domains/entities/meeygroup/enums/mg.banner.type';

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
    item: MGBannerEntity;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    MGBannerType = MGBannerType;
    @ViewChild('uploadImage') uploadImage: EditorComponent;
    @ViewChild('uploadFile') uploadFile: EditorComponent;

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
            await this.service.item('mgbanner', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    result.Object.File = result.Object.Image;
                    this.item = EntityHelper.createEntity(MGBannerEntity, result.Object as MGBannerEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGBannerEntity();
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }));
        this.actions = await this.authen.actionsAllow(MGBannerEntity, actions);
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MGBannerEntity();
            this.router.navigate(['/admin/meeygroup/banner/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item, ['File','PageId', 'NameVn']);
            if (valid) {
                let obj: MGBannerEntity = _.cloneDeep(this.item);
                 // upload
                 let files = await this.uploadFile.upload();
                 obj.Image = files && files.length > 0 ? files[0].Path : '';
                // save
                return await this.service.save('mgbanner', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        if (complete) complete();
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