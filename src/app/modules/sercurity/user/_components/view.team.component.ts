import * as _ from 'lodash';
import { Component } from "@angular/core";
import { ViewTeamComponent } from '../../../common/team/view.team/view.team.component';

@Component({
    templateUrl: '../../../common/team/view.team/view.team.component.html',
    styleUrls: [
        '../../../common/team/view.team/view.team.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class UserViewTeamComponent extends ViewTeamComponent {
    constructor() {
        super();
    }
}