import { UserService } from "../user.service";
import { AppInjector } from "../../../../app.module";
import { RoleService } from "../../role/role.service";
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ViewUserComponent } from "../view.user/view.user.component";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { TeamService } from "../../../../modules/common/team/team.service";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { UserEntity } from "../../../../_core/domains/entities/user.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PositionService } from "../../../../modules/common/position/position.service";
import { DepartmentService } from "../../../../modules/common/department/department.service";
import { ProductService } from "../../../../modules/common/product/product.service";

@Component({
    selector: 'choice-user',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ChoiceUserComponent extends GridComponent implements OnInit {
    id: number;
    type: string;
    autoSave: boolean;
    navigation: boolean;
    ignoreIds: number[];
    @Input() params: any;
    selectedItems: UserEntity[] = [];
    choiceComplete: (ids?: any[]) => void;
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [
            ActionData.addNew(() => { this.openNewTabAddNewUser(); }),
            ActionData.reload(() => { this.loadItems(); }),
        ],
        IsPopup: true,
        Checkable: true,
        UpdatedBy: false,
        Reference: UserEntity,
        HideCustomFilter: true,
        Title: 'Chọn nhân viên',
        InlineFilters: ['DepartmentId', 'PositionId'],
        CustomFilters: ['LockedStatus', 'TeamIds', 'RoleIds']
    };

    roleService: RoleService;
    userService: UserService;
    teamService: TeamService;
    positionService: PositionService;
    productService: ProductService;
    departmentService: DepartmentService;

    constructor() {
        super();
        this.roleService = AppInjector.get(RoleService);
        this.userService = AppInjector.get(UserService);
        this.teamService = AppInjector.get(TeamService);
        this.productService = AppInjector.get(ProductService);
        this.positionService = AppInjector.get(PositionService);
        this.departmentService = AppInjector.get(DepartmentService);
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Title: 'Họ và tên', Type: DataType.String,
                Click: (item: any) => {
                    this.view(item);
                },
                Format: ((item: any) => {
                    item['Name'] = UtilityExHelper.escapeHtml(item.FullName);
                    return item.FullName;
                })
            },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Department', Title: 'Phòng ban', Type: DataType.String },
            { Property: 'Position', Title: 'Vị trí', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.type = this.params && this.params['type'];
        this.id = this.params && this.params['id'] || 0;
        this.autoSave = this.params && this.params['autoSave'];
        this.ignoreIds = this.params && this.params['ignoreIds'];
        this.navigation = this.params && this.params['navigation'];
        this.choiceComplete = this.params && this.params['choiceComplete'];
        if (this.type) {
            switch (this.type.toLowerCase()) {
                case 'team': {
                    this.obj.Url = '/admin/user/IgnoreItems/team/' + this.id;
                } break;
                case 'role': {
                    this.obj.Url = '/admin/user/IgnoreItems/role/' + this.id;
                } break;
                case 'product': {
                    this.obj.Url = '/admin/user/IgnoreItems/product/' + this.id;
                } break;
                case 'position': {
                    this.obj.Url = '/admin/user/IgnoreItems/position/' + this.id;
                } break;
                case 'department': {
                    this.obj.Url = '/admin/user/IgnoreItems/department/' + this.id;
                } break;
            }
        }
        this.obj.IgnoreIds = this.ignoreIds;
        this.setPageSize(10000);

        await this.render(this.obj);
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            object: ViewUserComponent,
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
            title: 'Xem thông tin nhân viên',
        }, null, null, null, () => {
            if (this.navigation) this.popupChoiceUser();
        });
    }

    checkAllChange() {
        if (this.checkAll) {
            this.items.forEach((item: UserEntity) => {
                item.Checked = true;
                if (item.Checked) {
                    let exists = this.selectedItems.findIndex(c => c.Id == item.Id) >= 0;
                    if (!exists) this.selectedItems.push(item);
                }
            });
        } else this.selectedItems = [];
    }

    popupChoiceUser() {
        setTimeout(() => {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: this.params,
                object: ChoiceUserComponent,
                title: 'Danh sách nhân viên',
                size: ModalSizeType.ExtraLarge,
            });
        }, 100);
    }

    openNewTabAddNewUser() {
        let newRelativeUrl = this.router.createUrlTree(['/admin/user/add']);
        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    checkChange(evt: any, item: UserEntity) {
        item.Checked = evt.target.checked;
        if (item.Checked) {
            let exists = this.selectedItems.findIndex(c => c.Id == item.Id) >= 0;
            if (!exists) this.selectedItems.push(item);
        } else this.selectedItems = this.selectedItems.filter(c => c.Id != item.Id);
    }

    public async confirm(): Promise<boolean> {
        if (this.id) {
            if (this.autoSave) {
                let type: string = this.params && this.params['type'];
                switch (type) {
                    case 'role': return await this.confirmByRole(this.id);
                    case 'team': return await this.confirmByTeam(this.id);
                    case 'product': return await this.confirmByProduct(this.id);
                    case 'position': return await this.confirmByPosition(this.id);
                    case 'department': return await this.confirmByDepartment(this.id);
                }
            } else {
                if (this.choiceComplete)
                    this.choiceComplete(this.selectedItems);
                return true;
            }
        } else {
            if (this.choiceComplete) {
                this.choiceComplete(this.selectedItems);
                return true;
            }
        }
        return false;
    }

    private async confirmByRole(roleId: number) {
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        if (ids && ids.length > 0) {
            return await this.roleService.addUsers(roleId, ids).then((result: ResultApi) => {
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
        } return false;
    }
    private async confirmByTeam(teamId: number) {
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        if (ids && ids.length > 0) {
            return await this.teamService.addUsers(teamId, ids).then((result: ResultApi) => {
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
        } return false;
    }
    private async confirmByProduct(productId: number) {
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        return await this.productService.addUsers(productId, ids).then((result: ResultApi) => {
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
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        if (ids && ids.length > 0) {
            return await this.positionService.addUsers(positionId, ids).then((result: ResultApi) => {
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
        } return false;
    }
    private async confirmByDepartment(departmentId: number) {
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        if (ids && ids.length > 0) {
            return await this.departmentService.addUsers(departmentId, ids).then((result: ResultApi) => {
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
        } return false;
    }
}