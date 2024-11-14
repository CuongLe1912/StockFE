import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MBankRecruitmentService } from '../recruitment.service';
import { MBankRecruitmentEntity } from 'src/app/_core/domains/entities/meeybank/mbank.recruitment.entity';

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
    item: MBankRecruitmentEntity;
    @Input() params: any;
    loading: boolean = true;
    service: MBankRecruitmentService;
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(MBankRecruitmentService);
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
                    this.item = EntityHelper.createEntity(MBankRecruitmentEntity, result.Object as MBankRecruitmentEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new MBankRecruitmentEntity();
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];
        this.actions = await this.authen.actionsAllow(MBankRecruitmentEntity, actions);
    }
}
