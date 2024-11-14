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
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MGNewsEntity } from '../../../../_core/domains/entities/meeygroup/mg.news.entity';

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
    item: MGNewsEntity;
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
            this.addBreadcrumb(this.id ? 'Sửa bài viết' : 'Thêm mới bài viết');
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
            await this.service.item('mgnews', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGNewsEntity, result.Object as MGNewsEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGNewsEntity();
    }
    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MGNewsEntity();
            this.router.navigate(['/admin/meeygroup/news/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }));
        this.actions = await this.authen.actionsAllow(MGNewsEntity, actions);
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                this.processing = true;
                // upload
                let images = await this.uploadImage.image.upload();

                // update user
                let obj: MGNewsEntity = _.cloneDeep(this.item);
                obj.Image = images && images.length > 0 ? images[0].Path : '';
                //slug
                if(obj.TitleVn) obj.SlugVn = UtilityExHelper.ChangeToSlug(obj.TitleVn )
                if(obj.TitleEn) obj.SlugEn = UtilityExHelper.ChangeToSlug(obj.TitleEn )
                return await this.service.callApi('mgnews', 'addOrUpdate', obj, MethodType.Post).then((result: ResultApi) => {
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
        return false;
    }
}