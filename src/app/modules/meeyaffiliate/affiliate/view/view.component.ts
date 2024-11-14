import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { MAFAffiliateService } from '../affiliate.service';
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MAFChangeTreeComponent } from '../tree/components/change.tree/change.tree.component';

@Component({
    templateUrl: './view.component.html',
    styleUrls: [
        './view.component.scss',
    ],
})

export class MAFViewComponent extends EditComponent implements OnInit {
    @Input() params: any;
    loading: boolean = true;
    tab: string = 'users';
    id: any;
    item: any;

    constructor(public service: MAFAffiliateService) {
        super();
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params["id"];
        if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
            this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
        }
        this.addBreadcrumb("Chi tiết");
        if (this.state) {
            this.id = this.id || this.state.id;
        }

        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item("MAFAffiliate", this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = result.Object
                    if (this.item.MaxLevel) {
                        let maxLevel = []
                        for (let i = 0; i <= this.item.MaxLevel; i++) {
                            maxLevel.push(i)
                        }
                        sessionStorage.setItem('MAFMaxLevel', JSON.stringify(maxLevel))
                    }
                }
            });
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            {
                name: "Chuyển cây",
                processButton: true,
                icon: 'la la-plus-circle',
                className: 'btn btn-primary',
                systemName: ActionType.Edit,
                click: async () => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Hủy',
                        confirmText: 'Chuyển cây',
                        size: ModalSizeType.Large,
                        objectExtra: {
                            id: this.item.Id,
                        },
                        title: 'Tạo yêu cầu chuyển cây',
                        object: MAFChangeTreeComponent,
                    }, () => this.loadItem());
                }
            }
        ];
        // this.actions = await this.authen.actionsAllow(MOOrdersEntity, actions);
        this.actions = actions;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    viewUser(meeyId: string) {
        let obj: NavigationStateData = {
            prevUrl: '/admin/mluser',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
        this.setUrlState(obj, 'mluser');
        window.open(url, "_blank");
    }

    getObjectType() {
        let option: OptionItem = ConstantHelper.MAF_OBJECT_TYPES.find((c) => c.value == this.item.ObjectType);
        return '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    }

    back() {
        let back = ''
        if (this.router?.routerState?.snapshot?.root?.queryParams["back"]) {
            back = this.router?.routerState?.snapshot?.root?.queryParams["back"];
        }

        if (back && back == 'tree') {
            this.router.navigate(["/admin/mafaffiliate/tree"]);
        } else {
            if (this.state)
                this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
            else
                window.history.back();
        }
    }

}