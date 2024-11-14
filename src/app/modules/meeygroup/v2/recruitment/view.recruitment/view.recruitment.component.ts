import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import {MgRecruitmentEntity} from "../../../../../_core/domains/entities/meeygroup/v2/mg.recruitment.entity";
import { RecruitmentService } from '../recruitment.service';

@Component({
    templateUrl: './view.recruitment.component.html',
    styleUrls: [
        './view.recruitment.component.scss',
    ],
})
export class ViewRecruitmentComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    viewer: boolean;
    tab: string = 'vn';
    item: MgRecruitmentEntity;
    @Input() params: any;
    loading: boolean = true;
    service: RecruitmentService;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(RecruitmentService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
            this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
        }
        this.addBreadcrumb("Chi tiết tin tuyển dụng");
        this.viewer = true;

        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.getItem(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MgRecruitmentEntity, result.Object as MgRecruitmentEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new MgRecruitmentEntity();
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];
        this.actions = await this.authen.actionsAllow(MgRecruitmentEntity, actions);
    }
}
