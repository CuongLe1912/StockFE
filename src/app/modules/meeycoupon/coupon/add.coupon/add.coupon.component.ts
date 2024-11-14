import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCouponService } from '../../coupon.service';
import { Component, Input, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MCCouponEntity } from '../../../../_core/domains/entities/meeycoupon/mc.coupon.entity';
import { MCPopupCustomerListServiceComponent } from '../components/popup.customerlistservices.component';
import { MOServiceGridComponent } from '../../../../modules/meeyorder/services/components/service.grid.component';
import { MCCouponActiveType, MCCouponApplicableType, MCCouponCustomerGroupType, MCCouponCustomerType, MCCouponExpireDateType, MCCouponStatusType, MCCouponType, MCCouponUseType } from '../../../../_core/domains/entities/meeycoupon/enums/coupon.type';

@Component({
    templateUrl: './add.coupon.component.html',
    styleUrls: ['./add.coupon.component.scss'],
})
export class MCAddCouponComponent extends EditComponent {
    @ViewChild('import') import: EditorComponent;
    @Input() params: any;

    itemUseServices: any[] = [];
    itemActivatedServices: any[] = [];
    itemCustomerServices: any[] = [];
    actions: ActionData[] = [];
    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: string;
    router: Router;
    popup: boolean;
    MCCouponType = MCCouponType;
    MCCouponStatusType = MCCouponStatusType;
    MCCouponActiveType = MCCouponActiveType;
    MCCouponCustomerType = MCCouponCustomerType;
    MCCouponExpireDateType = MCCouponExpireDateType;
    MCCouponCustomerGroupType = MCCouponCustomerGroupType;
    state: NavigationStateData;
    item: MCCouponEntity = new MCCouponEntity();

    service: MeeyCouponService;
    authen: AdminAuthService;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.authen = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(MeeyCouponService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.addBreadcrumb(this.id ? 'Sửa Coupon' : 'Thêm mới Coupon');

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
            this.item = new MCCouponEntity();
            this.router.navigate(['/admin/mccoupon/mccoupon/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['Name', 'Code', 'MessageSuccess', 'MessageError', 'NameShow', 'ShowDescription'])) {
                if(this.item.NumberCouponType == MCCouponUseType.Limit){
                    if(!this.item.LimitUser || this.item.LimitUser == 0){
                        ToastrHelper.Error('Số lượng coupon mỗi KH được dùng không được trống');
                        this.processing = false;
                        return false;
                    }
                }
                if(this.item.Type == MCCouponType.DiscountPercent){
                    if(!this.item.AmountPercent || this.item.AmountPercent == 0){
                        ToastrHelper.Error('Mức giảm (%) không được trống');
                        this.processing = false;
                        return false;
                    }
                    if(!this.item.AmountLimit || this.item.AmountLimit == 0){
                        ToastrHelper.Error('Mức giảm tối đa không được trống');
                        this.processing = false;
                        return false;
                    }
                }
                if(this.item.Type == MCCouponType.DiscountCurrency){
                    if(!this.item.Amount || this.item.Amount == 0){
                        ToastrHelper.Error('Mức giảm (VND) không được trống');
                        this.processing = false;
                        return false;
                    }
                }
                if(this.item.Type == MCCouponType.AddMoneyAccount){
                    if(!this.item.Amount || this.item.Amount == 0){
                        ToastrHelper.Error('Mức tiền cộng (VND) không được trống');
                        this.processing = false;
                        return false;
                    }
                }
                if (this.item.ActiveType == MCCouponActiveType.BuyServiceX) {
                    if (!this.itemActivatedServices || this.itemActivatedServices.length == 0) {
                        ToastrHelper.Error('Danh sách mua dịch vụ không được trống');
                        this.processing = false;
                        return false;
                    }
                    this.item.listActivatedServices = this.itemActivatedServices.filter(c => c.Code).map(c => {
                        return c['Code']
                    });
                };
                if (this.item.ActiveType == MCCouponActiveType.ServiceXToExpire
                    || this.item.ActiveType == MCCouponActiveType.UseServiceXLimit) {
                    if (!this.itemActivatedServices || this.itemActivatedServices.length == 0) {
                        ToastrHelper.Error('Danh sách sử dụng dịch vụ không được trống');
                        this.processing = false;
                        return false;
                    }
                    this.item.listActivatedServices = this.itemActivatedServices.filter(c => c.Code).map(c => {
                        return c['Code']
                    });
                };
                if (this.item.CustomerType == MCCouponCustomerType.List
                    || this.item.CustomerType == MCCouponCustomerType.Upload) {
                    if (!this.itemCustomerServices || this.itemCustomerServices.length == 0) {
                        ToastrHelper.Error('Danh sách khách hàng không được trống');
                        this.processing = false;
                        return false;
                    }
                    this.item.listCustomerServices = this.itemCustomerServices.filter(c => c.MeeyId).map(c => {
                        return c['MeeyId']
                    });
                };
                if (this.item.Type == MCCouponType.DiscountPercent
                    || this.item.Type == MCCouponType.DiscountCurrency
                    || this.item.Type == MCCouponType.AddMoneyAccount
                ) {
                    if (!this.itemUseServices || this.itemUseServices.length == 0) {
                        ToastrHelper.Error('Danh sách dịch vụ áp dụng không được trống');
                        this.processing = false;
                        return false;
                    }
                    this.item.listUseServices = this.itemUseServices.filter(c => c.Code).map(c => {
                        return c['Code']
                    });
                };
                if (this.item.ActiveType == MCCouponActiveType.AccountBalanceRemain
                    || this.item.ActiveType == MCCouponActiveType.AccountSpendingLimit) {
                    if (!this.item.Amount) {
                        ToastrHelper.Error('Số tiền không được trống');
                        this.processing = false;
                        return false;
                    }
                };
                if (this.item.Type == MCCouponType.DiscountCurrency
                    || this.item.Type == MCCouponType.DiscountPercent) {
                    if (!this.itemUseServices || this.itemUseServices.length == 0) {
                        ToastrHelper.Error('Danh sách sản phẩm áp dụng không được trống');
                        this.processing = false;
                        return false;
                    }
                    this.item.listUseServices = this.itemUseServices.filter(c => c.Code).map(c => {
                        return c['Code']
                    });
                };
            }
            else 
            {
                this.processing = false;
                return false;
            }
            await this.createItem(complete);
        } else this.processing = false;
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.callApi('mccoupon', 'item/' + this.id).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCCouponEntity, result.Object);
                    if (this.item.listUseServices) {
                        await this.service.callApi('mccoupon', 'ListServicesByIds?ids=' + this.item.listUseServices.join(',')).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                if (result.Object) {
                                    result.Object.forEach(item => {
                                        let priceRoot = 0;
                                        let priceDiscount = 0;
                                        if (item.PriceConfig) {
                                            priceRoot = item.PriceConfig[0].price_root;
                                            priceDiscount = item.PriceConfig[0].price_discount;
                                        }
                                        this.itemUseServices.push({
                                            Id: item.Id,
                                            Name: item.Name,
                                            Code: item.Code,
                                            Root: priceRoot,
                                            ProductId: item.Id,
                                            Discount: priceDiscount,
                                            GroupLoad: this.formatGroupWhenLoadItem(item.Group),
                                        })
                                    })
                                }
                            }
                        })
                    }
                    if (this.item.listActivatedServices) {
                        await this.service.callApi('mccoupon', 'ListServicesByCodes?codes=' + this.item.listActivatedServices.join(',')).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                if (result.Object) {
                                    result.Object.forEach(item => {
                                        let priceRoot = 0;
                                        let priceDiscount = 0;
                                        if (item.PriceConfig) {
                                            priceRoot = item.PriceConfig[0].price_root;
                                            priceDiscount = item.PriceConfig[0].price_discount;
                                        }
                                        //let group = this.formatGroup(item.Group);
                                        
                                        this.itemActivatedServices.push({
                                            Id: item.Id,
                                            Name: item.Name,
                                            Code: item.Code,
                                            Root: priceRoot,
                                            ProductId: item.Id,
                                            Discount: priceDiscount,
                                            GroupLoad: this.formatGroupWhenLoadItem(item.Group),
                                        })
                                    })
                                }
                            }
                        })
                    }
                    if (this.item.listCustomerServices) {
                        await this.service.callApi('mluser', 'getbymeeyids', this.item.listCustomerServices, MethodType.Post).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                if (result.Object) {
                                    result.Object.forEach(item => {
                                        this.itemCustomerServices.push({
                                            Name: item.name,
                                            MeeyId: item._id,
                                            Phone: item.phone,
                                            Email: item.email,
                                            Status: item.status,
                                        })
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            this.item.Type = MCCouponType.DiscountPercent;
            this.item.CustomerType = MCCouponCustomerType.All;
            this.item.ActiveType = MCCouponActiveType.NotApply;
            this.item.NumberCouponType = MCCouponUseType.NotLimit;
            this.item.ExpireDateType = MCCouponExpireDateType.DayCalendar;
            this.item.ApplicableType = MCCouponApplicableType.WebsAndApps;
            this.item.CustomerGroupType = MCCouponCustomerGroupType.NormalCustomer;
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.saveAddNew(!this.id ? 'Tạo Coupon' : 'Sửa Coupon', async () => { await this.confirmAndBack() })
        ];
        this.actions = await this.authen.actionsAllow(MCCouponEntity, actions);
    }
    private async createItem(complete: () => void, note?: boolean): Promise<boolean> {

        // update user
        let obj: MCCouponEntity = _.cloneDeep(this.item);
        if (obj.ExpireDateType == MCCouponExpireDateType.DayCalendar) 
            delete obj.ExpireDate;
        
        return await this.service.addOrUpdateCounpon(obj, this.id).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
                if (!this.id) {
                    ToastrHelper.Success('Tạo coupon thành công');
                } else {
                    ToastrHelper.Success('Sửa coupon thành công');
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

    openPopupActivatedService() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            title: 'Chọn dịch vụ',
            confirmText: 'Chọn',
            object: MOServiceGridComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                listCheckedForCoupon: this.itemActivatedServices,
                choiceComplete: ((items: any[]) => {
                    this.itemActivatedServices = null;
                    setTimeout(() => {
                        this.itemActivatedServices = items;
                    }, 300);
                })
            }
        });
    }
    openPopupUseService() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            title: 'Chọn dịch vụ',
            confirmText: 'Chọn',
            object: MOServiceGridComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                listCheckedForCoupon: this.itemUseServices,
                choiceComplete: ((items: any[]) => {
                    this.itemUseServices = null;
                    setTimeout(() => {
                        this.itemUseServices = items;
                    }, 300);
                })
            }
        });
    }
    openPopupCustomerListService() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            title: 'Chọn khách hàng',
            confirmText: 'Chọn',
            object: MCPopupCustomerListServiceComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                listUncheck: this.itemCustomerServices,
                choiceComplete: ((items: any[]) => {
                    this.itemCustomerServices = items;
                })
            }
        });
    }
    public async uploadFileImport(complete: () => void): Promise<boolean> {
        this.processing = true;
        let dataImport = await this.import.upload();
        let jsonData = dataImport && dataImport.length > 0 ? dataImport[0].Path : null;
        if (jsonData) {
            if (complete) complete();
            this.processing = false;

            let obj = {
                items: jsonData['data'],
            };
            // close and open other popup
            this.dialogService.HideAllDialog();
            setTimeout(() => {
                this.dialogService.WapperAsync({
                    objectExtra: {
                        items : obj.items,
                        //items: obj,
                        listUncheck: this.itemCustomerServices,
                        choiceComplete: ((items: any[]) => {
                            this.itemCustomerServices = items
                        })
                    },
                    cancelText: 'Hủy',
                    confirmText: 'Import',
                    title: 'Xác nhận import',
                    size: ModalSizeType.ExtraLarge,
                    object: MCPopupCustomerListServiceComponent,
                });
            }, 300);
            return true;
        }
        else {
            ToastrHelper.Error('Dữ liệu API bị lỗi hoặc không hợp lệ');
            this.dialogService.HideAllDialog();
        }
        return false;
    }

    itemActivatedServicesChanged(items: any[]) {
        this.itemActivatedServices = items;
    }
    itemUseServicesChanged(items: any[]) {
        this.itemUseServices = items;
    }
    itemCustomerListServicesChanged(items: any[]) {
        this.itemCustomerServices = items;
    }
    formatGroupWhenLoadItem(item: any) {
        let ProviderName = '';
        if (item.provider?.name) {
            ProviderName = item.provider.name + " >> "
        }
        if (item.parent_id) {
            return ProviderName + item.name_parent + " >> " + item.name;
        }
        else {
            return ProviderName + item.name;
        }
    }
}