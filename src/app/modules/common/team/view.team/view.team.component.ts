import * as _ from 'lodash';
import { TeamService } from '../team.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { TeamDto } from '../../../../_core/domains/objects/team.dto';
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { TeamEntity } from '../../../../_core/domains/entities/team.entity';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { ChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/choice.user.component';

@Component({
    templateUrl: './view.team.component.html',
    styleUrls: [
        './view.team.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewTeamComponent extends EditComponent implements OnInit {
    @Input() params: any;

    id: number;
    popup: boolean;
    users: UserDto[];
    loading: boolean = true;
    item: TeamDto = new TeamDto();

    service: TeamService;
    userService: UserService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(TeamService);
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
                this.addBreadcrumb('Xem thông tin nhóm');
            }
            this.renderActions();
        }
        this.loadAllUsersByTeamId();
        await this.loadItem();
        this.loading = false;
    }

    edit(item: TeamDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/team',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/team/edit'], { state: { params: JSON.stringify(obj) } });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Sửa nhóm", () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'team') })
        ];
        this.actions = await this.authen.actionsAllow(TeamEntity, actions);
    }
    private async loadItem() {
        this.item = new TeamDto();
        if (this.id) {
            await this.service.item('team', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(TeamDto, result.Object as TeamDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async loadAllUsersByTeamId() {
        if (this.id) {
            await this.userService.allUsersByTeamId(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.users = result.Object as UserDto[];
                }
            });
        }
    }
}