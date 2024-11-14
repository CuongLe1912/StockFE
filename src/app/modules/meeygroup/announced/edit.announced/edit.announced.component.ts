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
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MGAnnouncedEntity } from '../../../../_core/domains/entities/meeygroup/mg.announced.entity';
import { MGAnnouncedStatusType } from '../../../../_core/domains/entities/meeygroup/enums/mg.announced.type';

@Component({
    templateUrl: './edit.announced.component.html',
    styleUrls: [
        './edit.announced.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditAnnouncedComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    approve: boolean = false;
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    item: MGAnnouncedEntity;
    loading: boolean = true;
    service: AdminApiService;
    tabType: string = 'link';
    @ViewChild('uploadFile') uploadFile: EditorComponent;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        this.approve = this.getParam('approve');
        if (this.state) {
            this.viewer = this.state.viewer;
            this.id = this.id || this.state.id;
            if (this.id) {
                if (this.approve) {
                    this.addBreadcrumb('Duyệt thông báo')
                }
                if (!this.approve && !this.viewer) {
                    this.addBreadcrumb('Sửa thông báo')
                }
                if (this.viewer && !this.approve) {
                    this.addBreadcrumb('Xem chi tiết')
                }
            } else {
                this.addBreadcrumb('Thêm mới thông báo')
            }

        }
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    selectedTabType(type: string) {
        this.tabType = type;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mgannounced', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGAnnouncedEntity, result.Object as MGAnnouncedEntity);
                    if (this.item.Link) this.tabType = 'link';
                    else if (this.item.File) this.tabType = 'file';
                    else if (this.item.Image) this.tabType = 'image';
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGAnnouncedEntity();
    }
    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MGAnnouncedEntity();
            this.router.navigate(['/admin/meeygroup/announced/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        if (!this.approve && !this.viewer)
            actions.push(ActionData.saveUpdate('Lưu thay đổi', async () => { await this.confirmAndBack() }));
        if (this.approve) {
            actions.push(
                {
                    name: 'Từ chối duyệt',
                    className: 'btn btn-outline-secondary',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.reject();
                    }
                });
            actions.push(
                {
                    name: 'Duyệt',
                    className: 'btn btn-primary',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.success();
                    }
                });
        }
        this.actions = await this.authen.actionsAllow(MGAnnouncedEntity, actions);
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                this.processing = true;
                let obj: MGAnnouncedEntity = _.cloneDeep(this.item);
                obj.Status = this.item.CategoryId == 8 ? MGAnnouncedStatusType.Pending : obj.Status = MGAnnouncedStatusType.Success;
                // upload image
                let images = await this.uploadImage.image.upload();
                obj.Image = images && images.length > 0 ? images[0].Path : '';

                // upload file
                if (this.tabType == 'file') {
                    obj.Link = null;
                    let files = await this.uploadFile.upload();
                    obj.File = files && files.length > 0 ? files[0].Path : '';
                } else obj.File = null;
                return await this.service.save('mgannounced', obj).then((result: ResultApi) => {
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
    success() {
        this.service.callApi('MGAnnounced', 'Approve/' + this.id, null, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Duyệt bản ghi');
                this.back();
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
    reject() {
        this.service.callApi('MGAnnounced', 'Reject/' + this.id, null, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Từ chối duyệt bản ghi');
                this.back();
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
}