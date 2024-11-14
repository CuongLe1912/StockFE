import * as _ from 'lodash';
import { ProductService } from '../product.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ButtonType } from '../../../../_core/domains/enums/button.type';
import { ProductDto } from '../../../../_core/domains/objects/product.dto';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { PermissionDto } from '../../../../_core/domains/objects/permission.dto';
import { ProductEntity } from '../../../../_core/domains/entities/product.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { ViewChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/view.choice.user.component';

@Component({
    templateUrl: './edit.product.component.html',
    styleUrls: [
        './edit.product.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProductComponent extends EditComponent implements OnInit {
    @Input() params: any;

    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    items: PermissionDto[];
    loading: boolean = true;
    ButtonType = ButtonType;
    loadingPermission: boolean;
    item: ProductDto = new ProductDto();

    service: ProductService;
    userService: UserService;
    dialogService: AdminDialogService;
    @ViewChild('viewChoiceUser') viewChoiceUser: ViewChoiceUserComponent;

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
                this.addBreadcrumb(this.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm');
            }
            this.renderActions();
        }
        this.loadAllUsersByProductId();
        await this.loadItem();
        this.loading = false;
    }

    public async confirmAndBack() {
        let result = await this.confirm();
        if (result) {
            this.back();
        }
    }
    public async confirmAndReset() {
        let result = await this.confirm();
        if (result) {
            this.state.id = null;
            this.item = new ProductDto();
            this.router.navigate(['/admin/product/add'], { state: { params: JSON.stringify(this.state) } });
        }
    }
    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: ProductDto = _.cloneDeep(this.item);
                obj.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                    this.processing = false;
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
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }),
                ActionData.history(() => { this.viewHistory(this.item.Id, 'Product') })
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Tạo sản phẩm', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(ProductEntity, actions);
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