import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { MPOProjectJuridicalComponent } from '../project.juridical/project.juridical.component';

@Component({
    selector: 'mpo-project-info',
    templateUrl: './project.info.component.html',
    styleUrls: [
        './project.info.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class MPOProjectInfoComponent extends EditComponent implements OnInit {
    @ViewChild('uploadLogo') uploadLogo: EditorComponent;
    @ViewChild('uploadBanner') uploadBanner: EditorComponent;
    @ViewChild('uploadImages') uploadImages: EditorComponent;

    id: string;
    viewer: boolean;
    isProduct: boolean;
    loadingText: string;
    @Input() params: any;
    coordinates: number[];
    validTabs: string[] = [];
    loading: boolean = false;
    dialog: AdminDialogService;
    service: MPOProjectService;
    notNeedCheckChange: boolean = false;
    item: MPOProjectEntity = new MPOProjectEntity();

    dialogPopupBannerArchive: DialogData;
    dialogPopupImageArchive: DialogData;
    dialogPopupFileArchive: DialogData;
    @Output() validTabChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    constructor() {
        super();
        this.dialog = AppInjector.get(AdminDialogService);
        this.service = AppInjector.get(MPOProjectService);
    }

    async ngOnInit() {
        if (this.params && this.params['item'])
            this.item = this.getParam('item');
        this.viewer = this.params && this.params['viewer'];
        this.isProduct = this.params && this.params['isProduct'];
        if (this.item && this.item.Lat && this.item.Lng) {
            this.coordinates = [this.item.Lat, this.item.Lng];
        }

        if (this.item && this.item?.ProjectMeeyId) {
            this.dialogPopupBannerArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: false, ProjectMeeyId: this.item.ProjectMeeyId });
            this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
            this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
        }
    }

    latLngChange() {
        if (this.item.Lat && this.item.Lng) {
            this.coordinates = [this.item.Lat, this.item.Lng];
            this.service.lookupAddress(this.item.Lat, this.item.Lng).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object;
                    this.item.CityId = obj.CityId;
                    this.item.WardId = obj.WardId;
                    this.item.DistrictId = obj.DistrictId;
                } else this.dialog.AlertResult('Thông báo', result);
            });
        }
    }

    projectChange() {
        if (this.item.ProjectId) {
            this.service.selectProject(this.item.ProjectId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object;
                    if (obj.Coordinates && obj.Coordinates.length == 2) {
                        this.coordinates = obj.Coordinates;
                        this.item.Lat = obj.Coordinates[0];
                        this.item.Lng = obj.Coordinates[1];
                    }
                    this.item.Name = obj.Name;
                    this.item.CityId = obj.CityId;
                    this.item.DistrictId = obj.DistrictId;
                    setTimeout(() => this.item.WardId = obj.WardId);
                } else this.dialog.AlertResult('Thông báo', result);
            });
        }
    }

    cityChange(item: OptionItem) {
        this.item.Address = '';
        let coordinates = item?.originalItem.Coordinates;
        if (coordinates) {
            this.coordinates = [coordinates[1], coordinates[0]];
            this.item.Lat = coordinates[1];
            this.item.Lng = coordinates[0];
        }
    }

    wardChange(item: OptionItem) {
        this.item.Address = '';
        let coordinates = item?.originalItem.Coordinates;
        if (coordinates) {
            this.coordinates = [coordinates[1], coordinates[0]];
            this.item.Lat = coordinates[1];
            this.item.Lng = coordinates[0];
        }
    }

    streetChange(item: OptionItem) {
        this.item.Address = '';
        let coordinates = item?.originalItem.Coordinates;
        if (coordinates) {
            this.coordinates = [coordinates[1], coordinates[0]];
            this.item.Lat = coordinates[1];
            this.item.Lng = coordinates[0];
        }
    }

    districtChange(item: OptionItem) {
        this.item.Address = '';
        let coordinates = item?.originalItem.Coordinates;
        if (coordinates) {
            this.coordinates = [coordinates[1], coordinates[0]];
            this.item.Lat = coordinates[1];
            this.item.Lng = coordinates[0];
        }
    }

    pointChange(coordinates: number[]) {
        if (coordinates && coordinates.length == 2) {
            this.item.Lat = coordinates[0];
            this.item.Lng = coordinates[1];

            this.service.lookupAddress(this.item.Lat, this.item.Lng).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object;
                    this.item.CityId = obj.CityId;
                    this.item.WardId = obj.WardId;
                    this.item.DistrictId = obj.DistrictId;
                } else this.dialog.AlertResult('Thông báo', result);
            });
        }
    }

    public async valid(): Promise<boolean> {
        let column = ["Name", "TradeName", "CityId", "DistrictId", "PriceM2Max", "PriceMax", "Description"];
        if (!this.item.IsPublished) {
            column = ['TradeName'];
        }
        let valid = await validation(this.item, column)
        if (valid) {
            if (this.uploadLogo) {
                this.item.Logo = await this.uploadLogo.upload();
            }
            if (this.uploadBanner) {
                this.item.Banner = await this.uploadBanner.upload();
            }
            if (this.uploadImages) {
                this.item.Images = await this.uploadImages.upload();
            }

            if (this.item.Description)
                this.item.DescriptionText = UtilityExHelper.innerTextHtml(this.item.Description);
        }

        return valid;
    }

    public async validInfo(): Promise<boolean> {
        let column = ["Description"];
        let valid = await validation(this.item, column)
        if (valid) {
            if (this.item.Description)
                this.item.DescriptionText = UtilityExHelper.innerTextHtml(this.item.Description);
        }

        return valid;
    }

    changePublish() {
        if (this.notNeedCheckChange)
            return;
        if (!this.item.IsPublished)
            this.isProduct ? this.unpublishProduct('dataMeeyland') : this.unpublish();
        else
            this.isProduct ? this.publishProduct('dataMeeyland') : this.publish();
    }

    async publish() {
        this.loading = true;
        let id = this.item.ProjectMeeyId;
        let valid = await this.validate();
        let published = !this.item.IsPublished;
        if (valid) {
            this.loadingText = 'Đang kiểm tra thông tin dự án...';
            this.service.checkPublish(id).then(async (result: ResultApi) => {
                this.loading = false;
                if (ResultApi.IsSuccess(result)) {
                    this.dialog.ConfirmAsync('Có phải bạn muốn Công khai dự án: <b>' + this.item.TradeName + '</b>', async () => {
                        this.loadingText = 'Đang công khai dự án...';
                        await this.service.publish(id).then(async (result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                //await this.loadItems();
                                setTimeout(() => {
                                    this.dialog.Success('Công khai dự án thành công', 'Công khai');
                                }, 500);
                            } else {
                                this.notNeedCheckChange = true;
                                ToastrHelper.ErrorResult(result);
                                this.item.IsPublished = published;
                                setTimeout(() => this.notNeedCheckChange = false, 1000);
                            }
                        });
                    }, () => {
                        this.notNeedCheckChange = true;
                        this.item.IsPublished = published;
                        setTimeout(() => this.notNeedCheckChange = false, 1000);
                    }, 'Công khai', 'Xác nhận');
                } else {
                    this.notNeedCheckChange = true;
                    ToastrHelper.ErrorResult(result);
                    this.item.IsPublished = published;
                    setTimeout(() => this.notNeedCheckChange = false, 1000);
                }
            });
        } else {
            this.loading = false;
            this.notNeedCheckChange = true;
            this.item.IsPublished = published;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
            this.dialogService.Alert('Cảnh báo', 'Thông tin dự án chưa đầy đủ, vui lòng vào chi tiết dự án để hoàn thiện.')
        }
    }

    unpublish() {
        let published = !this.item.IsPublished;
        this.dialog.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của dự án: <b>' + this.item.TradeName + '</b>', async () => {
            let id = this.item.ProjectMeeyId;
            await this.service.unpublish(id).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    //await this.loadItems();
                    setTimeout(() => {
                        this.dialog.Success('Bỏ công khai dự án thành công', 'Thông báo');
                    }, 500);
                } else {
                    this.notNeedCheckChange = true;
                    ToastrHelper.ErrorResult(result);
                    this.item.IsPublished = published;
                    setTimeout(() => this.notNeedCheckChange = false, 1000);
                }
            });
        }, () => {
            this.notNeedCheckChange = true;
            this.item.IsPublished = published;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
        }, 'Bỏ công khai', 'Xác nhận');
    }

    async publishProduct(product: string) {
        this.loading = true;
        let id = this.item.ProjectMeeyId;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullname": this.authen.account.FullName
                },
                "source": 'admin',
            },
            "isPublished": this.item.IsPublished,
            "project": product,
        };
        let valid = await this.validate();
        if (valid) {
            this.dialog.ConfirmAsync('Có phải bạn muốn Công khai dự án: <b>' + this.item.TradeName + '</b>', async () => {
                await this.service.callApi('MPOProject', 'UpdateInformationProduct/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        //await this.loadItems();
                        setTimeout(() => {
                            this.dialog.Success('Công khai dự án thành công', 'Công khai');
                        }, 500);
                    } else {
                        this.notNeedCheckChange = true;
                        this.item.IsPublished = false;
                        ToastrHelper.ErrorResult(result);
                        setTimeout(() => this.notNeedCheckChange = false, 1000);
                    }
                });
            }, null, 'Công khai', 'Xác nhận');
        } else {
            this.loading = false;
            this.notNeedCheckChange = true;
            this.item.IsPublished = false;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
            this.dialogService.Alert('Cảnh báo', 'Thông tin dự án chưa đầy đủ, vui lòng vào chi tiết dự án để hoàn thiện.')
        }
    }

    unpublishProduct(product: string) {
        let id = this.item.ProjectMeeyId;
        let data = {
            "updatedBy": {
                "data": {
                    "_id": this.authen.account.Id,
                    "fullname": this.authen.account.FullName
                },
                "source": 'admin',
            },
            "isPublished": this.item.IsPublished,
            "project": product,
        };
        this.dialog.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của dự án: <b>' + this.item.TradeName + '</b>', async () => {
            await this.service.callApi('MPOProject', 'UpdateInformationProduct/' + id, data, MethodType.Put).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    //await this.loadItems();
                    setTimeout(() => {
                        this.dialog.Success('Bỏ công khai dự án thành công', 'Thông báo');
                    }, 500);
                } else {
                    this.notNeedCheckChange = true;
                    this.item.IsPublished = false;
                    ToastrHelper.ErrorResult(result);
                    setTimeout(() => this.notNeedCheckChange = false, 1000);
                }
            });
        }, null, 'Bỏ công khai', 'Xác nhận');
    }

    private async validate() {
        this.validTabs = [];
        let projectLocation = <MPOProjectJuridicalComponent>this.getParam('projectLocation');
        let projectUtilities = <MPOProjectJuridicalComponent>this.getParam('projectUtilities');
        let projectJuridical = <MPOProjectJuridicalComponent>this.getParam('projectJuridical');
        let projectSalePolicy = <MPOProjectJuridicalComponent>this.getParam('projectSalePolicy');
        let projectConstruction = <MPOProjectJuridicalComponent>this.getParam('projectConstruction');
        let projectInvestorRelated = <MPOProjectJuridicalComponent>this.getParam('projectInvestorRelated');
        let projectPaymentProgress = <MPOProjectJuridicalComponent>this.getParam('projectPaymentProgress');
        let valid = true; //await this.valid();
        if (!await this.valid()) {
            this.validTabs.push('info');
            valid = false;
        }
        if (!await projectJuridical.valid()) {
            this.validTabs.push('juridical');
            valid = false;
        }
        if (!await projectLocation.valid()) {
            this.validTabs.push('location');
            valid = false;
        }
        if (!await projectUtilities.valid()) {
            this.validTabs.push('utilities');
            valid = false;
        }
        if (!await projectSalePolicy.valid()) {
            this.validTabs.push('salePolicy');
            valid = false;
        }
        if (!await projectConstruction.valid()) {
            this.validTabs.push('construction');
            valid = false;
        }
        if (!await projectInvestorRelated.valid()) {
            this.validTabs.push('investorRelated');
            valid = false;
        }
        if (!await projectPaymentProgress.valid()) {
            this.validTabs.push('paymentProgress');
            valid = false;
        }
        this.validTabChange.emit(this.validTabs);
        return valid;
    }
}