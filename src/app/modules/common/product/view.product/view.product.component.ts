import * as _ from 'lodash';
import { ProductService } from '../product.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ProductDto } from '../../../../_core/domains/objects/product.dto';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ProductEntity } from '../../../../_core/domains/entities/product.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './view.product.component.html',
    styleUrls: [
        './view.product.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewProductComponent extends EditComponent implements OnInit {
    @Input() params: any;

    id: number;
    popup: boolean;
    users: UserDto[];
    loading: boolean = true;
    item: ProductDto = new ProductDto();

    service: ProductService;
    userService: UserService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(ProductService);
        this.userService = AppInjector.get(UserService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb('Xem thông tin sản phẩm');
            }
            this.renderActions();
        }
        this.loadAllUsersByProductId();
        await this.loadItem();
        this.loading = false;
    }

    edit(item: ProductDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/product',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/product/edit'], { state: { params: JSON.stringify(obj) } });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Sửa sản phẩm", () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'product') })
        ];
        this.actions = await this.authen.actionsAllow(ProductEntity, actions);
    }
    private async loadItem() {
        this.item = new ProductDto();
        if (this.id) {
            await this.service.item('product', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(ProductDto, result.Object as ProductDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async loadAllUsersByProductId() {
        if (this.id) {
            await this.userService.allUsersByProductId(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.users = result.Object as UserDto[];
                }
            });
        }
    }
}