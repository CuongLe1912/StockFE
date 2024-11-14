import * as _ from 'lodash';
import { RoleService } from '../role.service';
import { AppInjector } from '../../../../app.module';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { RoleEntity } from '../../../../_core/domains/entities/role.entity';
import { PermissionDto } from '../../../../_core/domains/objects/permission.dto';
import { PermissionType } from '../../../../_core/domains/enums/permission.type';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";

@Component({
    selector: 'edit-role-permission',
    templateUrl: './edit.permission.component.html',
    styleUrls: [
        './edit.permission.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditRolePermissionComponent implements OnInit, OnChanges {
    permissions: any[];
    service: RoleService;
    loading: boolean = true;
    item: RoleEntity = new RoleEntity();

    id: number;
    popup: boolean;
    @Input() params: any;
    @Input() items: PermissionDto[];
    @Input() readonly: boolean = false;
    @Output() permissionChange: EventEmitter<PermissionDto[]> = new EventEmitter<PermissionDto[]>();

    constructor() {
        this.service = AppInjector.get(RoleService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        await this.loadItem();
        await this.loadPermissions();
        this.loading = false;
    }

    async ngOnChanges() {
        await this.loadPermissions();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let permissions = this.items.filter(c => c.Allow).map(c => {
                return {
                    Id: c.Id,
                    Type: c.SelectedType.value,
                };
            });
            return await this.service.updatePermissions(this.id, permissions).then((result: ResultApi) => {
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
        return false;
    }

    togglePermission(child: any) {
        if (!child.selected) {
            if (child.permissions && child.permissions.length > 0) {
                child.permissions.forEach((item: PermissionDto) => {
                    item.Allow = false;
                    item.Type = item.Types && item.Types[0];
                    item.SelectedType = item.OptionItemTypes && item.OptionItemTypes[0];
                });
            }
            let permissions = this.items.filter(c => c.Allow);
            this.permissionChange.emit(_.cloneDeep(permissions));
        }
    }
    choicePermission(permission: PermissionDto) {
        if (permission && permission.OptionItemTypes && permission.OptionItemTypes.length > 0) {
            permission.SelectedType = permission.OptionItemTypes.find(c => c.selected);
            permission.Type = permission.SelectedType && permission.SelectedType.value;
            this.permissionChange.emit(_.cloneDeep(this.items.filter(c => c.Allow)));
        }
    }
    public choicePermissionType(option: OptionItem, permission: PermissionDto) {
        if (permission && permission.OptionItemTypes && permission.OptionItemTypes.length > 0) {
            if (option) {
                permission.OptionItemTypes.forEach((item: OptionItem) => {
                    item.selected = false;
                });
                option.selected = true;
            }
            this.choicePermission(permission);
        }
    }

    private async loadItem() {
        this.item = new RoleEntity();
        if (this.id) {
            await this.service.item('role', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(RoleEntity, result.Object as RoleEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private groupPermissions() {
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: PermissionDto) => {
                if (item.Types && item.Types.length > 0) {
                    item.OptionItemTypes = [];
                    item.Types.forEach((type: PermissionType) => {
                        let color = 'success',
                            permissionType = ConstantHelper.PERMISSION_TYPES.find(c => c.value == type);
                        switch (type) {
                            case PermissionType.All: color = 'success'; break;
                            case PermissionType.Owner: color = 'brand'; break;
                            case PermissionType.Team: color = 'warning'; break;
                            case PermissionType.Department: color = 'danger'; break;
                        }
                        item.OptionItemTypes.push({
                            value: type,
                            color: color,
                            selected: item.Type == type,
                            label: permissionType && permissionType.label,
                        });
                    });

                    if (item.OptionItemTypes && item.OptionItemTypes.length > 0) {
                        let itemSelected = item.OptionItemTypes.find(c => c.selected) || item.OptionItemTypes[0];
                        item.SelectedType = itemSelected;
                        itemSelected.selected = true;
                    }
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
            this.permissions = groups.map((c: any) => ({
                active: true,
                title: c.group,
                items: c.items,
            }));
        }
    }
    private async loadPermissions() {
        if (this.items) {
            this.groupPermissions();
        } else {
            this.loading = true;
            await this.service.allPermissions(this.id, this.item.OrganizationId).then((result: ResultApi) => {
                this.loading = false;
                if (ResultApi.IsSuccess(result)) {
                    this.items = result.Object as PermissionDto[];
                    this.groupPermissions();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
}