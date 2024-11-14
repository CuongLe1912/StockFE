declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GenderType } from '../../../../_core/domains/enums/gender.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MLUserEntity } from '../../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLUSerInterestedProductType, MLUserType } from '../../../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './add.customer.component.html',
    styleUrls: ['./add.customer.component.scss'],
})
export class MCRMAddCustomerComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];

    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: number;
    router: Router;
    popup: boolean;
    meeyId: string;
    MLUserType = MLUserType;
    state: NavigationStateData;
    item: MLUserEntity = new MLUserEntity();
    MLUSerInterestedProductType = MLUSerInterestedProductType;

    service: MeeyCrmService;
    authen: AdminAuthService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MeeyCrmService);
        this.authen = AppInjector.get(AdminAuthService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.meeyId = this.getParam('meeyId');
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        if (this.state) {
            this.id = this.id || this.state.id;
            this.addBreadcrumb(this.id ? 'Sửa khách hàng CRM' : 'Thêm mới khách hàng CRM');
        }
        if (!this.id && this.meeyId) {
            this.addBreadcrumb(this.meeyId ? 'Sửa khách hàng CRM' : 'Thêm mới khách hàng CRM');
        }
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MLUserEntity();
            this.router.navigate(['/admin/meeycrm/customer/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['Name', 'Phone', 'Email', 'Website', 'InterestedProductId'])) {
                // Phone
                let result = await this.service.getByPhoneOrEmail(this.item.Phone);
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.dialogService.Alert('Thông báo lỗi', 'Số điện thoại đã tồn tại trong hệ thống MeeyId');
                    this.processing = false;
                    return false;
                }

                // Email
                result = await this.service.getByPhoneOrEmail(this.item.Email);
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.dialogService.Alert('Thông báo lỗi', 'Email đã tồn tại trong hệ thống MeeyId');
                    this.processing = false;
                    return false;
                }

                // Find on CRM
                result = await this.service.findCustomer({
                    Phone: this.item.Phone,
                    Email: this.item.Email
                });

                // Save
                if (ResultApi.IsSuccess(result) && result.Object) {
                    let customer = result.Object,
                        message = customer.Exists + ' đã tồn tại với mã: <b>' + customer.Code + '</b>';
                    if (customer.Sale) message += '<br />[Sale chăm sóc: <b>' + customer.Sale + '</b>]';
                    message += '<br /><br /><p style="color: red">Bạn vẫn muốn tạo tài khoản với khách hàng này?</p>';
                    this.dialogService.ConfirmAsync(message, async () => {
                        return await this.createItem(complete, true);
                    }, null, 'Xác nhận tạo tài khoản', 'Tiếp tục tạo tài khoản');
                    return false;
                } else return await this.createItem(complete);
            } else this.processing = false;
        }
        return false;
    }

    private async loadItem() {
        this.item.Type = MLUserType.Owner;
        this.item.Gender = GenderType.Unknow;
        this.item.Phone = this.params && this.params['phone'];
        this.item.InterestedProductId = MLUSerInterestedProductType.MeeyId;
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.saveAddNew('Tạo khách hàng', async () => { await this.confirmAndBack() })
        ];
        this.actions = await this.authen.actionsAllow(MCRMCustomerEntity, actions);
    }
    private async createItem(complete: () => void, note?: boolean): Promise<boolean> {
        // upload
        let images = await this.uploadAvatar.image.upload();

        // update user
        let obj: MLUserEntity = _.cloneDeep(this.item);
        obj.Avatar = images && images.length > 0 ? images[0].Path : '';
        return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
                if (this.id || this.meeyId) ToastrHelper.Success('Lưu thông tin khách hàng thành công');
                else {
                    let message = note
                        ? '<p>Tạo tài khoản thành công</p><p>Hệ thống đã gửi Email/SMS thông báo tới khách hàng</p><p style="color: red">Lưu ý: Số điện thoại/Email này trùng trong hệ thống CRM, vui lòng kiểm tra và gộp file khách hàng (nếu cần)</p>'
                        : '<p>Tạo tài khoản thành công</p><p>Hệ thống đã gửi Email/SMS thông báo tới khách hàng</p>';
                    this.dialogService.Alert('Thông báo', message);
                }
                if (complete) complete();
                return true;
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
        }, (e: any) => {
            ToastrHelper.Exception(e);

            return false;
        });
    }
}