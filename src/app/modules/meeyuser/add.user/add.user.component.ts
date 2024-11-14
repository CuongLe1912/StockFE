declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { GenderType } from '../../../_core/domains/enums/gender.type';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLUSerInterestedProductType, MLUserType } from '../../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MCRMCustomerLeadEntity } from '../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MLAddUserAffiliateComponent } from '../components/add.user.affiliate/add.user.affiliate.component';

@Component({
    templateUrl: './add.user.component.html',
    styleUrls: ['./add.user.component.scss'],
})
export class MLAddUserComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];

    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: number;
    leadId: number;
    router: Router;
    MLUserType = MLUserType;
    state: NavigationStateData;
    item: MLUserEntity = new MLUserEntity();

    service: MLUserService;
    authen: AdminAuthService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;
    @ViewChild('uploadFile') uploadFile: EditorComponent;
    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MLUserService);
        this.authen = AppInjector.get(AdminAuthService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.leadId = this.getParam('leadId');
        if (!this.leadId) {
            this.id = this.getParam('id');
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'Sửa tài khoản' : 'Thêm mới tài khoản');
            }
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
            this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['Name', 'Phone', 'Email', 'Website','InterestedProductId'])) {
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

                if(this.item.Type == MLUserType.Brokers || this.item.Type == MLUserType.BrokerIndividual){
                    // upload file
                    let fileBroker = await this.uploadFile.upload();
                    this.item.BrokerCertificate = fileBroker && fileBroker.length > 0 ? fileBroker[0].Path : '';
                    this.item.NameBrokerCertificate = fileBroker && fileBroker.length > 0 ? fileBroker[0].Name : '';
                }
                else{
                    this.item.BrokerCertificate = "";
                    this.item.NameBrokerCertificate = "";
                }
                // Save
                if (ResultApi.IsSuccess(result) && result.Object) {
                    let customer = result.Object,
                        message = customer.Exists + ' đã tồn tại với mã: <b>' + customer.Code + '</b>';
                    if (customer.Sale) message += '<br />[Sale chăm sóc: <b>' + customer.Sale + '</b>]';
                    message += '<br /><br /><p style="color: red">Bạn vẫn muốn tạo tài khoản với khách hàng này?</p>';
                    this.processing = false;
                    this.dialogService.ConfirmAsync(message, async () => {
                        return await this.mapMeeyId(complete, true);
                    }, null, 'Xác nhận tạo tài khoản', 'Tiếp tục tạo tài khoản');
                    return false;
                } else return await this.mapMeeyId(complete);
            } else this.processing = false;
        }
        return false;
    }

    mapMeeyId(complete: () => void, note?: boolean): Promise<boolean> {
        if (this.authen?.account?.RefCode && this.authen?.account?.MeeyId) {
            return this.createItem(complete, note);
        } else {
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua, Tạo tài khoản',
                confirmText: 'Đồng ý',
                object: MLAddUserAffiliateComponent,
                title: 'Thông báo',
                size: ModalSizeType.Large,
            }, async () => {
                return this.createItem(complete, note);
            }, null, null,
                async () => {
                    return this.createItem(complete, note);
                });
        }
    }

    private async loadItem() {
        this.item.Type = MLUserType.Owner;
        this.item.Gender = GenderType.Unknow;
        this.service.profile().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                if (result.Object && result.Object?.RefCode) {
                    this.authen.account.MeeyId = result.Object?.MeeyId;
                    this.authen.account.RefCode = result.Object?.RefCode;
                }
            }
        });
        this.item.InterestedProductId = MLUSerInterestedProductType.MeeyId;
        if (this.leadId) {
            await this.service.callApi('MCRMCustomerLead', 'Item/' + this.leadId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let customer: MCRMCustomerLeadEntity = EntityHelper.createEntity(MCRMCustomerLeadEntity, result.Object);
                    if (customer) {
                        this.item.Name = customer.Name;
                        this.item.Email = customer.Email;
                        this.item.Phone = customer.Phone;
                        this.item.CityId = customer.CityId;
                        this.item.WardId = customer.WardId;
                        this.item.SaleId = customer.SaleId;
                        this.item.Gender = customer.Gender;
                        this.item.Address = customer.Address;
                        this.item.Birthday = customer.Birthday;
                        this.item.IdentityCard = customer.IdCard;
                        this.item.SupportId = customer.SupportId;
                        this.item.DistrictId = customer.DistrictId;
                        this.item.Description = customer.Description;
                        this.item.Type = <MLUserType>(<any>customer.CustomerType);
                    }
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.saveAddNew('Tạo tài khoản', async () => { await this.confirmAndBack() })
        ];
        this.actions = await this.authen.actionsAllow(MLUserEntity, actions);
    }
    private async createItem(complete: () => void, note?: boolean): Promise<boolean> {
        // upload
        let images = await this.uploadAvatar.image.upload();

        // update user
        let obj: MLUserEntity = _.cloneDeep(this.item);
        obj.Avatar = images && images.length > 0 ? images[0].Path : '';
        obj.LeadId = this.leadId;
        return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
                if (this.id) ToastrHelper.Success('Tạo tài khoản thành công');
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