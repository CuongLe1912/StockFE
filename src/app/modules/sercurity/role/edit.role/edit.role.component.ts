import * as _ from 'lodash';
import { RoleService } from '../role.service';
import { AppInjector } from '../../../../app.module';
import { UserService } from '../../user/user.service';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { RoleDto } from '../../../../_core/domains/objects/role.dto';
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ButtonType } from '../../../../_core/domains/enums/button.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { RoleEntity } from '../../../../_core/domains/entities/role.entity';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { PermissionType } from '../../../../_core/domains/enums/permission.type';
import { PermissionDto } from '../../../../_core/domains/objects/permission.dto';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { ViewChoiceUserComponent } from '../../user/choice.user/view.choice.user.component';

@Component({
    templateUrl: './edit.role.component.html',
    styleUrls: [
        './edit.role.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditRoleComponent extends EditComponent implements OnInit {
    @Input() params: any;
    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    items: PermissionDto[];
    loading: boolean = true;
    ButtonType = ButtonType;
    loadingPermission: boolean;
    item: RoleDto = new RoleDto();

    service: RoleService;
    userService: UserService;
    dialogService: AdminDialogService;
    @ViewChild('viewChoiceUser') viewChoiceUser: ViewChoiceUserComponent;

    constructor() {
        super();
        this.service = AppInjector.get(RoleService);
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
                this.addBreadcrumb(this.id ? 'Sửa quyền' : 'Thêm quyền');
            }
            this.renderActions();
        }
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
            this.item = new RoleDto();
            this.router.navigate(['/admin/role/add'], { state: { params: JSON.stringify(this.state) } });
        }
    }
    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (this.popup) {
                this.processing = true;
                if (await validation(this.item)) {
                    this.item.Permissions = this.items.filter(c => c.Allow);
                    this.item.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                    if (this.item.Permissions && this.item.Permissions.length > 0) {
                        let obj = _.cloneDeep(this.item);
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
                    } else {
                        this.dialogService.Alert('Thông báo', 'Cần gán quyền với ít nhất 1 chức năng');
                        return false;
                    }
                } else this.processing = false;
            } else {
                this.processing = true;
                if (await validation(this.item)) {
                    this.item.Permissions = this.items.filter(c => c.Allow);
                    this.item.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                    if (this.item.Permissions && this.item.Permissions.length > 0) {
                        let message = this.id ? 'Bạn có xác nhận sửa quyền này không?' : 'Bạn có xác nhận tạo quyền này không?';
                        this.dialogService.ConfirmAsync(message, async () => {
                            let obj = _.cloneDeep(this.item);
                            return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                                this.processing = false;
                                if (ResultApi.IsSuccess(result)) {
                                    ToastrHelper.Success(this.id ? 'Sửa quyền thành công' : 'Tạo quyền thành công');
                                    this.back();
                                    return true;
                                } else {
                                    ToastrHelper.ErrorResult(result);
                                    return false;
                                }
                            }, () => {
                                return false;
                            });
                        }, () => this.processing = false);
                    } else {
                        this.dialogService.Alert('Thông báo', 'Cần gán quyền với ít nhất 1 chức năng');
                        this.processing = false;
                        return false;
                    }
                } else this.processing = false;
            }
        }
        return false;
    }

    public async organizationChange() {
        await this.loadPermissions();
    }
    permissionChange(permissions: PermissionDto[]) {
        this.item.Permissions = permissions.filter(c => c.Allow);
    }

    private async loadItem() {
        this.item = new RoleDto();
        if (this.id) {
            await this.service.item('role', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(RoleDto, result.Object as RoleDto);
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
                ActionData.history(() => { this.viewHistory(this.item.Id, 'role') })
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Tạo quyền', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(RoleEntity, actions);
    }
    private async loadPermissions() {
        if (!this.item.OrganizationId) {
            this.permissions = [];
            this.items = [];
            return;
        }
        this.loadingPermission = true;
        await this.service.allPermissions(this.id, this.item.OrganizationId).then((result: ResultApi) => {
            this.loadingPermission = false;
            if (ResultApi.IsSuccess(result)) {
                this.items = result.Object as PermissionDto[];
                if (this.items && this.items.length > 0) {
                    this.items.forEach((item: PermissionDto) => {
                        let selectedType = item.Type
                            ? item.Type
                            : item.Types && item.Types.length > 0
                                ? item.Types[0]
                                : PermissionType.All;
                        if (item.Types && item.Types.length > 0) {
                            item.OptionItemTypes = [];
                            item.Types.forEach((type: PermissionType) => {
                                let permissionType = ConstantHelper.PERMISSION_TYPES.find(c => c.value == type),
                                    color = 'success';
                                switch (type) {
                                    case PermissionType.All: color = 'success'; break;
                                    case PermissionType.Owner: color = 'brand'; break;
                                    case PermissionType.Team: color = 'warning'; break;
                                    case PermissionType.Department: color = 'danger'; break;
                                }
                                item.OptionItemTypes.push({
                                    value: type,
                                    color: color,
                                    selected: selectedType == type,
                                    label: permissionType && permissionType.label,
                                });
                            });
                            item.SelectedType = item.OptionItemTypes.find(c => c.selected);
                        }
                    });
                    let groups = _(this.items)
                        .groupBy((x: PermissionDto) => x.Group)
                        .map((value: PermissionDto[], key: string) => ({ group: key, items: value }))
                        .value();
                    if (groups && groups.length > 0) {
                        groups.forEach((group: any) => {
                            if (group.items && group.items.length > 0) {
                                group.items = _(group.items)
                                    .groupBy((x: PermissionDto) => x.Title)
                                    .map((value: PermissionDto[], key: string) => ({
                                        title: key,
                                        permissions: value,
                                        id: UtilityExHelper.randomText(8),
                                        selected: value.findIndex(c => c.Allow) >= 0,
                                    }))
                                    .value();
                            }
                        });
                    }
                    this.permissions = groups;
                }
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
}