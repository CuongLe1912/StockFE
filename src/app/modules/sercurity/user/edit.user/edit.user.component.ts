declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { TreeData } from '../../../../_core/domains/data/tree.data';
import { validation } from '../../../../_core/decorators/validator';
import { LockUserComponent } from '../lock.user/lock.user.component';
import { RoleDto } from '../../../../_core/domains/objects/role.dto';
import { TeamDto } from '../../../../_core/domains/objects/team.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { StatusType } from '../../../../_core/domains/enums/status.type';
import { UserViewRoleComponent } from '../_components/view.role.component';
import { UserEditRoleComponent } from '../_components/edit.role.component';
import { UserViewTeamComponent } from '../_components/view.team.component';
import { UserEditTeamComponent } from '../_components/edit.team.component';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ProductDto } from '../../../../_core/domains/objects/product.dto';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { UserEntity } from '../../../../_core/domains/entities/user.entity';
import { DistrictDto } from '../../../../_core/domains/objects/district.dto';
import { AdminUserUpdateDto } from '../../../../_core/domains/objects/user.dto';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { PermissionDto } from '../../../../_core/domains/objects/permission.dto';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { OrganizationDto } from '../../../../_core/domains/objects/organization.dto';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './edit.user.component.html',
    styleUrls: ['./edit.user.component.scss'],
})
export class EditUserComponent extends EditComponent {
    @Input() params: any;
    districts: DistrictDto[];
    organizationDistricts: any[];
    organizations: OrganizationDto[];
    organizationProductId: number = 1;
    organizationTeams: OrganizationDto[];
    organizationProduct: OrganizationDto;

    allowAddRole: boolean;
    allowAddTeam: boolean;
    loading: boolean = true;
    loadingProduct: boolean;
    loadingLocation: boolean;
    loadingPermission: boolean;
    loadingRoleOrganization: boolean;
    loadingTeamOrganization: boolean;

    id: number;
    popup: boolean;
    router: Router;
    searchRole: string;
    searchTeam: string;
    state: NavigationStateData;
    tab: string = 'information';
    innerTab: string = 'kt_tab_roles';
    item: AdminUserUpdateDto = new AdminUserUpdateDto();

    service: UserService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(UserService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);

        this.organizations = [];
        this.organizationTeams = [];
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.allowAddRole = await this.authen.permissionAllow('role', ActionType.AddNew);
        this.allowAddTeam = await this.authen.permissionAllow('team', ActionType.AddNew);
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'Sửa nhân viên' : 'Thêm nhân viên');
            }
            this.renderActions();
        }

        await this.loadItem();
        this.loading = false;

        await this.loadRoles();
        await this.loadTeams();
        await this.loadProducts();
        await this.loadLocations();
        await this.loadPermissions();
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }
    selectedInnerTab(tab: string) {
        this.innerTab = tab;
    }
    toggleOrganization(organization: OrganizationDto) {
        organization.Active = !organization.Active;
    }
    toggleOrganizationPermission(organization: OrganizationDto) {
        organization.PermissionActive = !organization.PermissionActive;
    }

    openPopupRole(id?: number) {
        if (id) {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: { id: id },
                title: 'Xem thông tin quyền',
                object: UserViewRoleComponent,
                size: ModalSizeType.FullScreen,
            });
        } else {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                title: 'Thêm quyền',
                confirmText: 'Tạo quyền',
                object: UserEditRoleComponent,
                size: ModalSizeType.FullScreen,
            }, async () => {
                await this.loadRoles();
                await this.loadPermissions();
            });
        }
    }

    async refreshRoles() {
        await this.loadRoles();
        await this.loadPermissions();
    }
    async roleOrganizationChange() {
        await this.loadRoles();
        await this.loadPermissions();
    }
    async allowRole(role: RoleDto) {
        role.Allow = true;
        let item = this.organizations.find(c => c.Id == role.OrganizationId);
        if (item) {
            item.Roles = item.AllRoles.filter(c => c.OrganizationId == role.OrganizationId).filter(c => c.Allow);
        }
        await this.loadPermissions();
    }
    async removeRole(role: RoleDto) {
        role.Allow = false;
        let item = this.organizations.find(c => c.Id == role.OrganizationId);
        if (item) {
            item.Roles = item.AllRoles.filter(c => c.OrganizationId == role.OrganizationId).filter(c => c.Allow);
        }
        await this.loadPermissions();
    }
    filterRole(text: string, organization: OrganizationDto) {
        if (organization && organization.Roles) {
            organization.FilterRoles = text
                ? organization.AllRoles.filter(c =>
                    (c.Name && c.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
                    (c.Code && c.Code.toLowerCase().indexOf(text.toLowerCase()) >= 0))
                : organization.AllRoles;
        }
    }

    async refreshTeams() {
        await this.loadTeams();
    }
    allowTeam(team: TeamDto) {
        team.Allow = true;
        let item = this.organizationTeams.find(c => c.Id == team.OrganizationId);
        if (item) {
            item.Teams = item.AllTeams.filter(c => c.OrganizationId == team.OrganizationId).filter(c => c.Allow);
        }
    }
    removeTeam(team: TeamDto) {
        team.Allow = false;
        let item = this.organizationTeams.find(c => c.Id == team.OrganizationId);
        if (item) {
            item.Teams = item.AllTeams.filter(c => c.OrganizationId == team.OrganizationId).filter(c => c.Allow);
        }
    }
    openPopupTeam(id?: number) {
        if (id) {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: { id: id },
                title: 'Xem thông tin nhóm',
                object: UserViewTeamComponent,
                size: ModalSizeType.FullScreen,
            });
        } else {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                title: 'Thêm mới nhóm',
                confirmText: 'Tạo nhóm',
                object: UserEditTeamComponent,
                size: ModalSizeType.FullScreen,
            }, async () => {
                await this.loadTeams();
            });
        }
    }
    async teamOrganizationChange() {
        await this.loadTeams();
    }
    filterTeam(text: string, organization: OrganizationDto) {
        if (organization && organization.Teams) {
            organization.FilterTeams = text
                ? organization.AllTeams.filter(c =>
                    (c.Name && c.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
                    (c.Code && c.Code.toLowerCase().indexOf(text.toLowerCase()) >= 0))
                : organization.AllTeams;
        }
    }

    async refreshProducts() {
        await this.loadProducts();
    }
    openPopupProduct(id?: number) {
        if (id) {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: { id: id },
                title: 'Xem thông tin sản phẩm',
                object: UserViewTeamComponent,
                size: ModalSizeType.FullScreen,
            });
        } else {
            this.dialog.WapperAsync({
                cancelText: 'Đóng',
                title: 'Thêm mới nhóm',
                confirmText: 'Tạo nhóm',
                object: UserEditTeamComponent,
                size: ModalSizeType.FullScreen,
            }, async () => {
                await this.loadTeams();
            });
        }
    }
    allowProduct(product: ProductDto) {
        product.Allow = true;
        let item = this.organizationProduct;
        if (item) {
            item.Products = item.AllProducts.filter(c => c.Allow);
        }
    }
    removeProduct(product: ProductDto) {
        product.Allow = false;
        let item = this.organizationProduct;
        if (item) {
            item.Products = item.AllProducts.filter(c => c.Allow);
        }
    }
    async productOrganizationChange() {
        await this.loadProducts();
    }
    filterProduct(text: string, organization: OrganizationDto) {
        if (organization && organization.Products) {
            organization.FilterProducts = text
                ? organization.AllProducts.filter(c => (c.Name && c.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0))
                : organization.AllProducts;
        }
    }

    permissionChange(items: PermissionDto[], organization: OrganizationDto) {
        organization.Permissions = items && items.filter(c => c.Allow);
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new AdminUserUpdateDto();
            this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['FullName', 'Phone', 'Email'])) {
                this.processing = true;

                // upload
                let images = await this.uploadAvatar.image.upload();

                // update user
                let obj: AdminUserUpdateDto = _.cloneDeep(this.item);
                obj.Avatar = images && images.length > 0 ? images[0].Path : '';
                obj.RoleIds = this.organizations && this.organizations.flatMap(c => c.Roles).map(c => c.Id);
                obj.ProductIds = this.organizationProduct && this.organizationProduct.Products.map(c => c.Id);
                obj.TeamIds = this.organizationTeams && this.organizationTeams.flatMap(c => c.Teams).map(c => c.Id);
                obj.DistrictIds = this.organizationDistricts && this.organizationDistricts.flatMap(c => c.items).map(c => c.Id);
                obj.Permissions = this.organizations && this.organizations.flatMap(c => c.Permissions).filter(c => c.Allow).filter(c => !c.ReadOnly)
                    .map(c => {
                        return {
                            Id: c.Id,
                            Type: c.SelectedType.value,
                        };
                    });
                return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        if (this.id) ToastrHelper.Success('Lưu dữ liệu thành công');
                        else {
                            this.dialog.Alert('Thông báo', '<p>Tạo tài khoản nhân viên thành công</p><p>Hệ thống đã gửi Email thông báo tới nhân viên</p>')
                        }
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            } else this.processing = false;
        }
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('user', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AdminUserUpdateDto, result.Object);
                    this.item.Id = this.id;
                    let text = this.item.Locked ? 'Bị khóa' : 'Hoạt động',
                        status = this.item.Locked ? StatusType.Warning : StatusType.Success;
                    this.item["Status"] = UtilityExHelper.formatText(text, status);
                }
            });
        }
    }
    private async loadRoles() {
        if (!this.item.RoleOrganizationId ||
            this.item.RoleOrganizationId.length == 0 ||
            this.item.RoleOrganizationId.toString() == '[]') {
            if (this.item.RoleOrganizationId &&
                this.item.RoleOrganizationId.toString() == '[]')
                this.item.RoleOrganizationId = null;
            this.organizations.forEach((item: OrganizationDto) => {
                item.AllPermissions = [];
                item.Permissions = [];
            });
            this.organizations = [];
            return;
        }
        this.organizations = [];
        this.loadingRoleOrganization = true;
        await this.service.allRoles(this.id, this.item.RoleOrganizationId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let roles = result.Object as RoleDto[];
                if (roles && roles.length > 0) {
                    roles.forEach((role: RoleDto) => {
                        let item = this.organizations.find(c => c.Id == role.OrganizationId);
                        if (!item) {
                            item = {
                                Active: true,
                                Permissions: [],
                                AllPermissions: [],
                                Id: role.OrganizationId,
                                Name: role.Organization,
                                AllRoles: roles.filter(c => c.OrganizationId == role.OrganizationId),
                                FilterRoles: roles.filter(c => c.OrganizationId == role.OrganizationId),
                                Roles: roles.filter(c => c.OrganizationId == role.OrganizationId).filter(c => c.Allow),
                            };
                            this.organizations.push(item);
                        }
                    });
                }
            }
            this.loadingRoleOrganization = false;
        });
    }
    private async loadTeams() {
        if (!this.item.TeamOrganizationId ||
            this.item.TeamOrganizationId.length == 0 ||
            this.item.TeamOrganizationId.toString() == '[]') {
            if (this.item.TeamOrganizationId &&
                this.item.TeamOrganizationId.toString() == '[]')
                this.item.TeamOrganizationId = null;
            this.organizationTeams = [];
            return;
        }
        this.organizationTeams = [];
        this.loadingTeamOrganization = true;
        await this.service.allTeams(this.id, this.item.TeamOrganizationId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let teams = result.Object as TeamDto[];
                if (teams && teams.length > 0) {
                    teams.forEach((team: TeamDto) => {
                        let item = this.organizationTeams.find(c => c.Id == team.OrganizationId);
                        if (!item) {
                            item = {
                                Active: true,
                                Id: team.OrganizationId,
                                Name: team.Organization,
                                AllTeams: teams.filter(c => c.OrganizationId == team.OrganizationId),
                                FilterTeams: teams.filter(c => c.OrganizationId == team.OrganizationId),
                                Teams: teams.filter(c => c.OrganizationId == team.OrganizationId).filter(c => c.Allow),
                            };
                            this.organizationTeams.push(item);
                        }
                    });
                }
            }
            this.loadingTeamOrganization = false;
        });
    }
    private async loadProducts() {
        this.loadingProduct = true;
        await this.service.allProducts(this.id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let products = result.Object as ProductDto[];
                if (products && products.length > 0) {
                    this.organizationProduct = {
                        Active: true,
                        Name: 'Product',
                        AllProducts: products,
                        FilterProducts: products,
                        Id: this.organizationProductId,
                        Products: products.filter(c => c.Allow),
                    };
                }
            }
            this.loadingProduct = false;
        });
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }),
                this.item.Locked
                    ? {
                        icon: 'la la-unlock',
                        name: ActionType.UnLock,
                        systemName: ActionType.UnLock,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            this.dialogService.ConfirmAsync('Xác nhận mở khóa cho tài khoản <b>' + this.item.FullName + '</b>', async () => {
                                await this.service.unLockUser(this.item.Id).then(async (result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        ToastrHelper.Success('Mở khóa tài khoản thành công');
                                        await this.loadItem();
                                        this.renderActions();
                                    } else ToastrHelper.ErrorResult(result);
                                });
                            });
                        })
                    }
                    : {
                        icon: 'la la-lock',
                        name: ActionType.Lock,
                        systemName: ActionType.Lock,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            this.dialogService.WapperAsync({
                                cancelText: 'Đóng',
                                title: 'Khóa tài khoản',
                                confirmText: 'Xác nhận',
                                object: LockUserComponent,
                                size: ModalSizeType.Large,
                                objectExtra: { id: this.item.Id },
                            }, async () => {
                                await this.loadItem();
                                this.renderActions();
                            });
                        })
                    },
                this.item.Locked
                    ? null
                    : {
                        icon: 'la la-key',
                        name: ActionType.ResetPassword,
                        systemName: ActionType.ResetPassword,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            this.dialogService.ConfirmAsync('Xác nhận thực hiện Thiết lập lại mật khẩu cho tài khoản <b>' + this.item.FullName + '</b>', async () => {
                                await this.service.adminResetPassword(this.item.Id).then((result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        if (result.Object) ToastrHelper.Success('Hệ thống đã gửi email thiết lập mật khẩu mới cho nhân viên');
                                        else ToastrHelper.Error('Không thể gửi Email cho nhân viên');
                                    } else ToastrHelper.ErrorResult(result);
                                });
                            });
                        })
                    },
                ActionData.history(() => { this.viewHistory(this.item.Id, 'user') })
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Tạo nhân viên', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(UserEntity, actions);
    }
    private async loadLocations() {
        this.districts = [];
        this.loadingLocation = true;
        await this.service.allDistricts(this.id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.districts = result.Object as DistrictDto[];
                if (this.districts && this.districts.length > 0) {
                    this.organizationDistricts = this.groupDistricts(this.districts);
                    let groups = _(this.districts)
                        .groupBy((c: DistrictDto) => c.CityId)
                        .map((value: DistrictDto[], key: number) => ({ id: key, items: value }))
                        .value();
                    if (groups && groups.length > 0) {
                        let treeDatas: TreeData[] = [];
                        groups.forEach((group: any) => {
                            let city = this.districts.find(c => c.CityId == group.id).City,
                                childs = (group.items as DistrictDto[]).map(c => {
                                    return {
                                        id: c.Id,
                                        text: c.Title,
                                        icon: 'la la-arrow-right',
                                        state: { opened: false, selected: c.Allow }
                                    }
                                });
                            let item: TreeData = {
                                text: city,
                                id: group.id,
                                children: childs,
                                icon: 'la la-map-marker',
                                state: { opened: false }
                            };
                            treeDatas.push(item);
                        });

                        if (treeDatas && treeDatas.length > 0) {
                            $('#tree-location').jstree({
                                plugins: ['wholerow', 'checkbox', 'sort', 'search'],
                                core: {
                                    data: treeDatas,
                                    themes: { responsive: true },
                                }
                            }).on('changed.jstree', (e, data) => {
                                let i: number, j: number, items: TreeData[] = [];
                                for (i = 0, j = data.selected.length; i < j; i++) {
                                    items.push(data.instance.get_node(data.selected[i]));
                                }
                                let ids = items.filter(c => c.parent != '#').map(c => parseInt(c.id.toString())),
                                    districts = this.districts.filter(c => ids.indexOf(c.Id) >= 0);
                                if (districts && districts.length > 0) {
                                    districts.forEach((item: DistrictDto) => {
                                        item.Allow = true;
                                    });
                                    this.organizationDistricts = this.groupDistricts(districts);
                                } else this.organizationDistricts = [];
                            });
                        }
                    }
                }
            }
            this.loadingLocation = false;
        });
    }
    private async loadPermissions() {
        if (!this.item.RoleOrganizationId ||
            this.item.RoleOrganizationId.length == 0 ||
            this.item.RoleOrganizationId.toString() == '[]') {
            if (this.item.RoleOrganizationId &&
                this.item.RoleOrganizationId.toString() == '[]')
                this.item.RoleOrganizationId = null;
            this.organizations.forEach((item: OrganizationDto) => {
                item.AllPermissions = [];
                item.Permissions = [];
            });
            this.organizations = [];
            return;
        }
        this.loadingPermission = true;
        let roleIds = this.item.RoleOrganizationId
            ? this.organizations.filter(c => this.item.RoleOrganizationId.indexOf(c.Id) >= 0).flatMap(c => c.Roles).filter(c => c.Allow).map(c => c.Id)
            : this.organizations.flatMap(c => c.Roles).filter(c => c.Allow).map(c => c.Id);
        await this.service.allPermissions(this.id, roleIds, this.item.RoleOrganizationId).then((result: ResultApi) => {
            this.loadingPermission = false;
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as PermissionDto[];
                this.organizations.forEach((item: OrganizationDto) => {
                    item.AllPermissions = items && items.filter(c => c.OrganizationId == item.Id);
                    item.Permissions = item.AllPermissions.filter(c => c.Allow);
                });
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
    private groupDistricts(districts: DistrictDto[]) {
        return _(districts.filter(c => c.Allow))
            .groupBy((x: DistrictDto) => x.City)
            .map((value: DistrictDto[], key: string) => ({ name: key, items: value }))
            .value();
    }
}