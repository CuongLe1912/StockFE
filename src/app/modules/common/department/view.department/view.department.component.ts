import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { DepartmentService } from '../department.service';
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { DepartmentDto } from '../../../../_core/domains/objects/department.dto';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { DepartmentEntity } from '../../../../_core/domains/entities/department.entity';
import { ChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/choice.user.component';

@Component({
    templateUrl: './view.department.component.html',
    styleUrls: [
        './view.department.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewDepartmentComponent extends EditComponent implements OnInit {
    @Input() params: any;

    id: number;
    popup: boolean;
    viewer: boolean;
    users: UserDto[];
    loading: boolean = true;
    item: DepartmentDto = new DepartmentDto();

    service: DepartmentService;
    userService: UserService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(DepartmentService);
        this.userService = AppInjector.get(UserService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.viewer = this.params && this.params['viewer'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb('Xem thông tin phòng ban');
            }
            this.renderActions();
        }
        this.loadAllUsersByDepartmentId();
        await this.loadItem();
        this.loading = false;
    }

    edit(item: DepartmentDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/department',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/department/edit'], { state: { params: JSON.stringify(obj) } });
    }

    openPopupEditMember() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Nhân viên',
            confirmText: 'Lưu thay đổi',
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: this.item.Id, type: 'department' },
        }, async () => {
            this.loadAllUsersByDepartmentId();
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Sửa phòng ban", () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'department') })
        ];
        this.actions = await this.authen.actionsAllow(DepartmentEntity, actions);
    }
    private async loadItem() {
        this.item = new DepartmentDto();
        if (this.id) {
            await this.service.item('department', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(DepartmentDto, result.Object as DepartmentDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async loadAllUsersByDepartmentId() {
        if (this.id) {
            await this.userService.allUsersByDepartmentId(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.users = result.Object as UserDto[];
                }
            });
        }
    }
}