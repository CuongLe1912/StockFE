import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { DepartmentService } from '../department.service';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { UserDto } from '../../../../_core/domains/objects/user.dto';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { DepartmentDto } from '../../../../_core/domains/objects/department.dto';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { DepartmentEntity } from '../../../../_core/domains/entities/department.entity';
import { ViewChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/view.choice.user.component';

@Component({
    templateUrl: './edit.department.component.html',
    styleUrls: [
        './edit.department.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditDepartmentComponent extends EditComponent implements OnInit {
    @Input() params: any;

    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    loading: boolean = true;
    loadingPermission: boolean;
    item: DepartmentDto = new DepartmentDto();

    service: DepartmentService;
    userService: UserService;
    dialogService: AdminDialogService;
    @ViewChild('viewChoiceUser') viewChoiceUser: ViewChoiceUserComponent;

    constructor() {
        super();
        this.userService = AppInjector.get(UserService);
        this.service = AppInjector.get(DepartmentService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'Sửa phòng ban' : 'Thêm phòng ban');
            }
            this.renderActions();
        }
        this.loadAllUsersByDepartmentId();
        await this.loadItem();
        this.loading = false;
    }

    public async confirmAndBack() {
        let result = await this.confirm();
        if (result) {
            this.back();
        }
    }
    public async confirmAndReset() {
        let result = await this.confirm();
        if (result) {
            this.state.id = null;
            this.item = new DepartmentDto();
            this.router.navigate(['/admin/department/add'], { state: { params: JSON.stringify(this.state) } });
        }
    }
    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: DepartmentDto = _.cloneDeep(this.item);
                obj.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                    this.processing = false;
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
        return false;
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
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }),
                ActionData.history(() => { this.viewHistory(this.item.Id, 'Department') })
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Tạo phòng ban', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(DepartmentEntity, actions);
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