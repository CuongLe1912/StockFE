import { AppInjector } from '../../../../app.module';
import { FileData } from '../../../../_core/domains/data/file.data';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MCRMInvestorInfoComponent } from './investor.info/investor.info.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MCRMDealerGridComponent } from '../component/investor.dealer.grid.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MCRMInvestorImageComponent } from './investor.image/investor.image.component';
import { MCRMInvestorTransactionHistoryComponent } from './investor.transaction/investor.transaction.component';
import { MCRMInvestorEntity, MCRMInvestorImageEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.investor.entity';

@Component({
    templateUrl: './add.investor.component.html',
    styleUrls: ['./add.investor.component.scss']
})
export class MCRMAddInvestorComponent extends EditComponent implements OnInit {
    @ViewChild('investorInfo') investorInfo: MCRMInvestorInfoComponent;
    @ViewChild('investorDealer') investorDealer: MCRMDealerGridComponent;
    @ViewChild('investorImage') investorImage: MCRMInvestorImageComponent;
    @ViewChild('investorTransaction') investorTransaction: MCRMInvestorTransactionHistoryComponent;

    @Input() params: any;
    actions: ActionData[] = [];

    id: string;
    validTabs = [];
    viewer: boolean;
    tab: string = 'info';
    service: AdminApiService;
    loading: boolean = false;
    isAddNew: boolean = false;
    isUpdate: boolean = false;
    loadingInfo: boolean = false;

    item: MCRMInvestorEntity;
    dialog: AdminDialogService;


    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        if (this.params && this.params['tab'])
            this.tab = this.params && this.params['tab'];
        this.viewer = this.getParam('viewer');
        this.isAddNew = this.getParam('isAddNew');
        this.isUpdate = this.getParam('isUpdate');
        if (this.viewer) {
            this.breadcrumbs.push({
                Name: 'Xem chi tiết chủ đầu tư'
            });
        } else {
            this.breadcrumbs.push({
                Name: 'Cập nhật chủ đầu tư'
            });
        }

        await this.loadItem();
        this.renderActions();
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    async loadItem() {
        if (this.id) {
            this.loading = true;
            await this.service.item('mcrminvestor', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    const item = result.Object;
                    this.item = EntityHelper.createEntity(MCRMInvestorEntity, item);
                    // create images
                    this.item.Images = EntityHelper.createEntity(MCRMInvestorImageEntity, {
                        LogoWeb: this.renderImage(item.LogoWeb),
                        LogoApp: this.renderImage(item.LogoApp),
                        LogoMobileWeb: this.renderImage(item.LogoMobileWeb),
                        BackgroundWeb: this.renderImage(item.BackgroundWeb),
                        BackgroundApp: this.renderImage(item.BackgroundApp),
                        BackgroundMobileWeb: this.renderImage(item.BackgroundMobileWeb),
                    });
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
            this.loading = false;
        } else {
            this.item = new MCRMInvestorEntity();
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => this.back())
        ];
        if (this.viewer) {
            actions.push({
                name: 'Sửa',
                icon: 'la la-edit',
                processButton: true,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                click: () => this.edit(this.item)
            });
        } else {
            actions.push({
                name: 'Lưu',
                icon: 'la la-save',
                processButton: true,
                className: 'btn btn-primary',
                systemName: this.isAddNew ? ActionType.AddNew : ActionType.Edit,
                click: async () => await this.confirm()
            });
        }
        this.actions = await this.authen.actionsAllow(MCRMInvestorEntity, actions);
    }

    async confirm() {
        this.processing = true;
        this.validTabs = [];
        let valid = await this.validate();

        if (valid) {
            var splitted = this.item.Email.split("@", 2)
            if (splitted[0]?.length > 64) {
                ToastrHelper.Error("Email không hợp lệ (không nhập quá 64 ký tự trước dấu @)");
                this.processing = false;
                return false;
            }
            let investor = {
                name: this.item.InvestorName,
                taxCode: this.item.TaxCode,
                businessCode: this.item.BusinessCode,
                address: this.item.Address,
                city: this.item.CityId,
                district: this.item.DistrictId,
                ward: this.item.WardId,
                representative: this.item.RepresentativeName,
                email: this.item.Email,
                contractCode: this.item.ContractCode,
                domains: [this.item.Domain],
                startDate: this.item.StartDate,
                endDate: this.item.EndDate,
                warrantyPeriod: this.item.WarrantyPeriod,
                sale: {
                    data: {
                        _id: this.item.SaleId,
                        fullName: this.item.SaleName
                    },
                    source: "admin"
                },
                carer: {
                    data: {
                        _id: this.item.SupportId,
                        fullName: this.item.SupportName
                    },
                    source: "admin"
                },
                logo: [],
                background: [],
            }

            //Logo
            if (this.item.Images.LogoApp) {
                let image = this.item.Images.LogoApp.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 3
                            }
                    })[0];
                if (image)
                    investor.logo.push(image);
            }
            if (this.item.Images.LogoWeb) {
                let image = this.item.Images.LogoWeb.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 1
                            }
                    })[0];
                if (image)
                    investor.logo.push(image);
            }
            if (this.item.Images.LogoMobileWeb) {
                let image = this.item.Images.LogoMobileWeb.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 2
                            }
                    })[0];
                if (image)
                    investor.logo.push(image);
            }
            //Background
            if (this.item.Images.BackgroundApp) {
                let image = this.item.Images.BackgroundApp.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 3
                            }
                    })[0];
                if (image)
                    investor.background.push(image);
            }
            if (this.item.Images.BackgroundWeb) {
                let image = this.item.Images.BackgroundWeb.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 1
                            }
                    })[0];
                if (image)
                    investor.background.push(image);
            }
            if (this.item.Images.BackgroundMobileWeb) {
                let image = this.item.Images.BackgroundMobileWeb.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                    .map(c => {
                        return c._id
                            ? { _id: c._id }
                            : {
                                image: {
                                    s3Key: c.s3Key
                                },
                                platform: 2
                            }
                    })[0];
                if (image)
                    investor.background.push(image);
            }

            if (this.id) {
                investor["isActive"] = this.item.IsActive;
                investor["updatedBy"] = {
                    data: {
                        _id: this.authen.account.Id,
                        fullName: this.authen.account.FullName
                    },
                    source: "admin"
                };
                return await this.service.callApi('mcrminvestor', 'update/' + this.id, investor, MethodType.Post).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        this.back();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            } else {
                investor["dbUri"] = this.item.DBUri;
                investor["phone"] = this.item.Phone;
                investor["isActive"] = true;
                investor["createdBy"] = {
                    data: {
                        _id: this.authen.account.Id,
                        fullName: this.authen.account.FullName
                    },
                    source: "admin"
                };
                return await this.service.callApi('mcrminvestor', 'addnew', investor, MethodType.Post).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        this.back();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            }

        }
        this.processing = false;
    }

    private async validate() {
        let valid = true;
        if (!await this.investorInfo.valid()) {
            console.log(valid)
            this.validTabs.push('info');
            valid = false;
        }
        if (!await this.investorImage.valid()) {
            this.validTabs.push('image');
            valid = false;
        }
        return valid;
    }

    public validTabChange(tabs: string[]) {
        this.validTabs = tabs;
    }

    edit(item: any) {
        let obj: NavigationStateData = {
            id: this.id,
            viewer: false,
            object: {
                isUpdate: true,
            },
            prevData: this.state.prevData,
            prevUrl: "/admin/investor",
        };
        this.router.navigate(["/admin/mcrminvestor/edit"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item._Id,
            viewer: true,
            prevData: this.state.prevData,
            prevUrl: "/admin/investor",
        };
        this.router.navigate(["/admin/mcrminvestor/view"], {
            state: { params: JSON.stringify(obj) },
        });
    }

    private renderImage(image: any): FileData {
        let itemImage: FileData = new FileData();
        if (image) {
            itemImage = {
                Path: image.url,
                Name: image.name,
                ResultUpload: {
                    uri: image.uri,
                    url: image.url,
                    name: image.name,
                    size: image.size,
                    s3Key: image.s3Key,
                    width: image.width,
                    height: image.height,
                    mimeType: image.mimeType,
                }
            }
        }
        return itemImage;
    }

    // back(confirm = false) {

    //     if (this.state) {
    //         if (!this.viewer && !this.isAddNew) this.view(this.item);
    //         else
    //             this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
    //     }
    //     else
    //         window.history.back();

    // }
}
