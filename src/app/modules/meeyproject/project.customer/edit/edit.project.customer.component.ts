import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MPOProjectService } from '../../project.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MPOProjectCustomerEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.customer.entity';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './edit.project.customer.component.html',
    styleUrls: ['./edit.project.customer.component.scss'],
})
export class EditProjectCustomerComponent extends EditComponent implements OnInit {

    id: string;
    viewer: boolean;
    tab: string = 'info';
    @Input() params: any;
    loading: boolean = true;
    disabled: boolean = true;
    service: MPOProjectService;
    item: MPOProjectCustomerEntity = new MPOProjectCustomerEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MPOProjectService);
    }

    async ngOnInit() {
        this.viewer = this.getParam('viewer');
        this.id = this.getParam('id');
        this.breadcrumbs = [];
        this.breadcrumbs.push({
            Name: 'Meey Project'
        });
        this.breadcrumbs.push({
            Name: 'Quản lý khách hàng'
        });
        this.breadcrumbs.push({
            Name: 'Danh sách khách hàng',
            Link: '/admin/mpoproject/customer'
        });
        this.breadcrumbs.push({
            Name: 'Xem thông tin'
        });
        await this.loadItem();
        this.renderActions();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            return true;
        }
        return false;
    }

    private async loadItem() {
        this.item = new MPOProjectCustomerEntity();
        if (this.id) {
            await this.service.callApi('MPOCustomer', 'Item/' + this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOProjectCustomerEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => this.back())
        ];
        // if (this.viewer) {
        //     actions.push({
        //         name: 'Sửa',
        //         icon: 'la la-edit',
        //         processButton: true,
        //         systemName: ActionType.Edit,
        //         className: 'btn btn-primary',
        //         click: () => this.edit(this.item)
        //     });
        // } else {
        //     actions.push({
        //         name: 'Lưu',
        //         icon: 'la la-save',
        //         processButton: true,
        //         className: 'btn btn-primary',
        //         systemName: ActionType.Edit,
        //         click: async () => await this.confirm()
        //     });
        // }
        this.actions = await this.authen.actionsAllow(MPOProjectCustomerEntity, actions);
    }

    selectedTab(tab) {
        this.tab = tab;
    }

    private edit(item: MPOProjectCustomerEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mpoproject',
            prevData: this.state.prevData,
            object: {
                tab: this.tab,
            }
        };
        this.router.navigate(['/admin/mpoproject/edit'], { state: { params: JSON.stringify(obj) } });
    }
}