import * as _ from 'lodash';
import { Component } from "@angular/core";
import { EditTeamComponent } from '../../../common/team/edit.team/edit.team.component';

@Component({
    templateUrl: '../../../common/team/edit.team/edit.team.component.html',
    styleUrls: [
        '../../../common/team/edit.team/edit.team.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UserEditTeamComponent extends EditTeamComponent {
    constructor() {
        super();
    }
}