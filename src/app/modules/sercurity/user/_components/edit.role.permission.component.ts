import * as _ from 'lodash';
import { Component } from "@angular/core";
import { EditRolePermissionComponent } from '../../role/edit.permission/edit.permission.component';

@Component({
    selector: 'user-edit-role-permission',
    templateUrl: '../../role/edit.permission/edit.permission.component.html',
    styleUrls: [
        '../../role/edit.permission/edit.permission.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UserEditRolePermissionComponent extends EditRolePermissionComponent {
    constructor() {
        super();
    }
}