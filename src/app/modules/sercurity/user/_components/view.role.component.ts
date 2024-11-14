import * as _ from 'lodash';
import { Component } from "@angular/core";
import { ViewRoleComponent } from '../../role/view.role/view.role.component';

@Component({
    templateUrl: '../../role/view.role/view.role.component.html',
    styleUrls: [
        '../../role/view.role/view.role.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UserViewRoleComponent extends ViewRoleComponent {
    constructor() {
        super();
    }
}