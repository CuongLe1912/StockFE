import * as _ from 'lodash';
import { UserService } from "../user.service";
import { AppInjector } from "../../../../app.module";
import { RoleService } from "../../role/role.service";
import { Component, Input, OnInit } from "@angular/core";
import { ChoiceUserComponent } from "./choice.user.component";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ViewUserComponent } from "../view.user/view.user.component";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { TeamService } from "../../../../modules/common/team/team.service";
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { UserEntity } from "../../../../_core/domains/entities/user.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { ProductService } from '../../../../modules/common/product/product.service';
import { PositionService } from "../../../../modules/common/position/position.service";
import { DepartmentService } from "../../../../modules/common/department/department.service";

@Component({
    selector: 'view-choice-user',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ViewChoiceUserComponent extends GridComponent implements OnInit {
    id: number;
    type: string;
    addUser: boolean;
    autoSave: boolean;
    groupUser: boolean;
    navigation: boolean;
    deleteUser: boolean;
    choiceComplete: () => void;

    @Input() params: any;
    selectedItems: any[] = [];
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        Reference: UserEntity,
        HideCustomFilter: true,
        Title: 'Xem danh sách nhân viên',
        InlineFilters: ['DepartmentId', 'PositionId'],
        CustomFilters: ['LockedStatus', 'TeamIds', 'RoleIds']
    };

    roleService: RoleService;
    userService: UserService;
    teamService: TeamService;
    productService: ProductService;
    positionService: PositionService;
    departmentService: DepartmentService;

    constructor() {
        super();
        this.roleService = AppInjector.get(RoleService);
        this.userService = AppInjector.get(UserService);
        this.teamService = AppInjector.get(TeamService);
        this.productService = AppInjector.get(ProductService);
        this.positionService = AppInjector.get(PositionService);
        this.departmentService = AppInjector.get(DepartmentService);
        let allowViewUser = this.authen.permissionAllow('user', ActionType.View);
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            allowViewUser
                ? {
                    Property: 'FullName', Title: 'Họ và tên', Type: DataType.String,
                    Click: (item: any) => {
                        this.view(item);
                    }
                }
                : { Property: 'FullName', Title: 'Họ và tên', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Avatar', Title: 'Ảnh đại diện', Type: DataType.Image, Align: 'center' },
            { Property: 'Department', Title: 'Phòng ban', Type: DataType.String },
            { Property: 'Position', Title: 'Vị trí', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.type = this.params && this.params['type'];
        this.id = this.params && this.params['id'] || 0;
        this.addUser = this.params && this.params['addUser'];
        this.autoSave = this.params && this.params['autoSave'];
        this.groupUser = this.params && this.params['groupUser'];
        this.deleteUser = this.params && this.params['deleteUser'];
        this.navigation = this.params && this.params['navigation'];
        this.choiceComplete = this.params && this.params['choiceComplete'];

        if (this.addUser) {
            this.obj.Features.push({
                icon: 'la la-users',
                className: 'btn btn-primary',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: (() => {
                    this.popupChoiceUser();
                })
            });
        }
        if (this.groupUser) {
            let allowViewUser = this.authen.permissionAllow('user', ActionType.View);
            this.properties = [
                { Property: 'Id', Title: 'Id', Type: DataType.Number },
                allowViewUser
                    ? {
                        Property: 'FullName', Title: 'Họ và tên', Type: DataType.String,
                        Format: ((item: any) => {
                            item['Name'] = item['Name'] || UtilityExHelper.escapeHtml(item.FullName);
                            let text = '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                            if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                            if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                            return text;
                        })
                    }
                    : {
                        Property: 'FullName', Title: 'Họ và tên', Type: DataType.String,
                        Format: ((item: any) => {
                            item['Name'] = item['Name'] || UtilityExHelper.escapeHtml(item.FullName);
                            let text = '<p>' + UtilityExHelper.escapeHtml(item.Name) + '</p>';
                            if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                            if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                            return text;
                        })
                    },
                {
                    Property: 'Department', Title: 'Phòng ban', Type: DataType.String,
                    Format: ((item: any) => {
                        return UtilityExHelper.escapeHtml(item.Department);
                    })
                },
                {
                    Property: 'Position', Title: 'Vị trí', Type: DataType.String,
                    Format: ((item: any) => {
                        return UtilityExHelper.escapeHtml(item.Position);
                    })
                },
            ];
        }
        if (this.deleteUser) {
            this.obj.Actions.push({
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.EditMember,
                click: (item: any) => {
                    this.delete(item);
                }
            });
        }
        if (!this.groupUser) this.breadcrumbs = [{ Name: 'Danh sách nhân viên' }];

        if (this.type) {
            switch (this.type.toLowerCase()) {
                case 'team': {
                    this.obj.Url = '/admin/user/ChoiceItems/team/' + this.id;
                } break;
                case 'role': {
                    this.obj.Url = '/admin/user/ChoiceItems/role/' + this.id;
                } break;
                case 'product': {
                    this.obj.Url = '/admin/user/ChoiceItems/product/' + this.id;
                } break;
                case 'position': {
                    this.obj.Url = '/admin/user/ChoiceItems/position/' + this.id;
                } break;
                case 'department': {
                    this.obj.Url = '/admin/user/ChoiceItems/department/' + this.id;
                } break;
            }
            this.setPageSize(10000);
            await this.render(this.obj);
            this.selectedItems = _.cloneDeep(this.items);
        } else this.obj.HideSearch = true;
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            object: ViewUserComponent,
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
            title: 'Xem thông tin nhân viên',
        }, null, null, null, () => {
            if (this.navigation) this.popupViewChoiceUser();
        });
    }

    popupChoiceUser() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Thêm nhân viên',
            object: ChoiceUserComponent,
            confirmText: 'Chọn nhân viên',
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                id: this.id,
                type: this.type,
                autoSave: this.autoSave,
                choiceComplete: ((items: any[]) => {
                    if (!this.items) this.items = [];
                    if (items && items.length > 0) {
                        this.items.unshift(...items);
                        this.renderItems(this.items);
                    }
                }),
                ignoreIds: this.items && this.items.map(c => c.Id),
            },
        }, async () => {
            if (this.choiceComplete)
                this.choiceComplete();
        });
    }

    popupViewChoiceUser() {
        setTimeout(() => {
            let addUser = this.authen.permissionAllow(this.type, ActionType.EditMember);
            let deleteUser = this.authen.permissionAllow(this.type, ActionType.EditMember);
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                confirmText: 'Lưu thay đổi',
                size: ModalSizeType.ExtraLarge,
                object: ViewChoiceUserComponent,
                title: 'Xem danh sách nhân viên',
                objectExtra: {
                    id: this.id,
                    autoSave: true,
                    type: this.type,
                    addUser: addUser,
                    navigation: true,
                    deleteUser: deleteUser
                },
            }, async () => {
                this.loadItems();
            });
        }, 100);
    }

    public delete(item: any) {
        this.dialogService.Confirm('Có phải bạn muốn xóa nhân viên <b>' + (item.Name || item.FullName) + '</b> khỏi danh sách?', () => {
            if (!this.obj.IgnoreIds)
                this.obj.IgnoreIds = [];
            this.obj.IgnoreIds.push(item.Id);
            this.items = this.items.filter(c => c.Id != item.Id);
        });
    }
    public async confirm(): Promise<boolean> {
        if (this.id) {
            let type: string = this.params && this.params['type'];
            switch (type) {
                case 'role': return await this.confirmByRole(this.id);
                case 'team': return await this.confirmByTeam(this.id);
                case 'product': return await this.confirmByProduct(this.id);
                case 'position': return await this.confirmByPosition(this.id);
                case 'department': return await this.confirmByDepartment(this.id);
            }
        }
        return false;
    }

    private async confirmByRole(roleId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.roleService.updateUsers(roleId, ids).then((result: ResultApi) => {
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
    private async confirmByTeam(teamId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.teamService.updateUsers(teamId, ids).then((result: ResultApi) => {
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
    private async confirmByProduct(productId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.productService.updateUsers(productId, ids).then((result: ResultApi) => {
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
    private async confirmByPosition(positionId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.positionService.updateUsers(positionId, ids).then((result: ResultApi) => {
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
    private async confirmByDepartment(departmentId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.departmentService.updateUsers(departmentId, ids).then((result: ResultApi) => {
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