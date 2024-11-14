import * as _ from 'lodash';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MShareNewsType } from '../../../../_core/domains/entities/meeyshare/enums/ms.news.type';
import { MeeyShareNewsEntity } from '../../../../_core/domains/entities/meeyshare/ms.news.entity';
import { MShareStatusType } from '../../../../_core/domains/entities/meeyshare/enums/ms.status.type';

@Component({
    templateUrl: './edit.news.component.html',
    styleUrls: [
        './edit.news.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditNewsComponent extends EditComponent implements OnInit {
    id: number;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    item: MeeyShareNewsEntity;
    MShareNewsType = MShareNewsType;

    constructor() {
        super();
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        this.addBreadcrumb(this.id ? 'Sửa bài viết' : 'Thêm mới bài viết');

        // load item
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    commentChange() {
        if (this.item.Comment &&
            (this.item.Status == MShareStatusType.Draft || this.item.Status == MShareStatusType.Reject))
            this.item.Status = MShareStatusType.Published;
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns: string[] = [];
            if (this.item.Type != MShareNewsType.MPS_VIDEO)
                columns.push('Comment');
            let valid = columns.length > 0 ? await validation(this.item, columns) : true;
            if (valid) {
                this.processing = true;
                if (!this.id) {
                    let obj: MeeyShareNewsEntity = _.cloneDeep(this.item);
                    return await this.service.callApi('meeyShareNews', 'AddNew', obj, MethodType.Post).then((result: ResultApi) => {
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
                } else {
                    let obj: MeeyShareNewsEntity = _.cloneDeep(this.item);
                    let data = {
                        comment: obj.Comment,
                        status: <number>obj.Status,
                        author: {
                            "data": {
                                "id": this.authen.account.Id,
                                "fullname": this.authen.account.FullName
                            }
                        }
                    };
                    return await this.service.callApi('meeyShareNews', 'update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
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
        }
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('meeyShareNews', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeeyShareNewsEntity, result.Object as MeeyShareNewsEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MeeyShareNewsEntity();
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        if (!this.viewer)
            actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }));
        this.actions = await this.authen.actionsAllow(MeeyShareNewsEntity, actions);
    }
}