import * as _ from 'lodash';
import { Component } from "@angular/core";
import { EditRoleComponent } from '../../role/edit.role/edit.role.component';

@Component({
    templateUrl: '../../role/edit.role/edit.role.component.html',
    styleUrls: [
        '../../role/edit.role/edit.role.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UserEditRoleComponent extends EditRoleComponent {
    constructor() {
        super();
    }
}