declare var $: any
import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { validation } from '../../../_core/decorators/validator';
import { FileData } from '../../../_core/domains/data/file.data';
import { StoreHelper } from '../../../_core/helpers/store.helper';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ButtonType } from '../../../_core/domains/enums/button.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { DecoratorHelper } from '../../../_core/helpers/decorator.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLPopupPaymentComponent } from '../popup.payment/popup.payment.component';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLPopupPushArticleComponent } from '../popup.push.article/popup.push.article.component';
import { MLScheduleDateType } from '../../../_core/domains/entities/meeyland/enums/ml.schedule.type';
import { MLPopupScheduleArticleComponent } from '../popup.schedule.article/popup.schedule.article.component';
import { MLArticleEntity, MLArticlePackageConfig, MLArticleVideo } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleNeedType, MLArticlePackageType, MLArticlePostType, MLArticleReferenceType, MLArtilceMediateType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: './add.article.component.html',
    styleUrls: ['./add.article.component.scss'],
})
export class MLAddArticleComponent extends EditComponent implements OnInit, OnDestroy {
    id: number;
    tab: string;
    code: string;
    options: any;
    interval: any;
    meeyId: string;
    fields: string[];
    totalDay: number;
    totalHour: number;
    totalTime: number;
    pricePush: number;
    subscriptions: any;
    priceLabel: string;
    hideSticky: boolean;
    numberVideo: number;
    @Input() params: any;
    item: MLArticleEntity;
    rentPriceText: string;
    subscriptionPush: any;
    loadingParser: boolean;
    priceNumberText: string;
    loading: boolean = true;
    disableAddress: boolean;
    ButtonType = ButtonType;
    service: MLArticleService;
    firstLoad: boolean = true;
    rentPriceNumberText: string;
    selectedProject: OptionItem;
    needType: MLArticleNeedType;
    times: {
        day: string,
        timeGolds: OptionItem[],
        timeOthers: OptionItem[]
    }[];
    totalPriceNumberText: string;
    pathName: string = 'mlarticle';
    eventService: AdminEventService;
    allowViewArticleHistory: boolean;
    enableEventChange: boolean = false;
    hiddenReviewTypes: boolean = false;
    MLArticleNeedType = MLArticleNeedType;
    MLScheduleDateType = MLScheduleDateType;
    MLArtilceMediateType = MLArtilceMediateType;
    MLArticleReferenceType = MLArticleReferenceType;
    @ViewChild('uploadImage') uploadImage: EditorComponent;
    @ViewChild('uploadVideo') uploadVideo: EditorComponent;
    price: MLArticlePackageConfig = new MLArticlePackageConfig();

    constructor() {
        super();
        this.pathName = location.pathname
            .replace('/admin/', '')
            .replace('/view', '')
            .replace('/edit', '')
            .replace('/add', '');
        this.eventService = AppInjector.get(AdminEventService);
        this.service = AppInjector.get(MLArticleService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.code = this.getParam('code');
        this.meeyId = this.getParam('meeyId');
        this.needType = this.getParam('needType');
        if (!this.state) {
            this.state = new NavigationStateData();
            this.state.prevUrl = '/admin/' + this.pathName;
        }
        await this.loadSubscriptions();
        await this.loadItem();
        if (this.item) {
            await this.renderActions();
            this.addBreadcrumb(this.item && this.item.Id ? 'Sửa tin đăng [' + this.item.Code + ']' : 'Đăng tin hộ');
            this.loading = false;

            this.interval = setInterval(() => {
                let now = new Date();
                if (this.item && !this.item.Id && this.item.PublishTime < now) {
                    this.enableEventChange = false;
                    this.item.PublishTime = new Date();
                    this.updateExpireTime();
                    setTimeout(() => this.enableEventChange = true, 2000);
                }
            }, 2000);
            setTimeout(() => this.enableEventChange = true, 5000);
        } else this.loading = false;
    }

    ngOnDestroy() {
        if (this.interval)
            clearInterval(this.interval);
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }
    async customerPhoneOnBlur() {
        let valid = await validation(this.item, ['CustomerPhone']);
        if (valid) {
            this.service.findUseerByPhoneOrEmail(this.item.CustomerPhone).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object as MLUserEntity;
                    if (obj) {
                        this.item.UserMeeyId = obj.MeeyId;
                        this.item.CustomerName = obj.Name;
                        this.item.CustomerEmail = obj.Email;
                        this.item.ContactName = this.item.CustomerName;
                        this.item.ContactPhone = this.item.CustomerPhone;
                        this.item.ContactEmail = this.item.CustomerEmail;
                    }
                } else {
                    this.item.UserMeeyId = null;
                    this.item.ContactName = null;
                    this.item.CustomerName = null;
                    this.item.ContactPhone = null;
                    this.item.ContactEmail = null;
                    this.item.CustomerEmail = null;
                    let properties = DecoratorHelper.decoratorProperties(MLArticleEntity, false);
                    if (properties && properties.length > 0) {
                        let property = properties.find(c => c.property == 'CustomerPhone');
                        if (property) {
                            property.error = 'Số điện thoại không tìm thấy trong hệ thống';
                            this.eventService.Validate.emit(property);
                        }
                    }
                }
            });
        } else {
            this.item.UserMeeyId = null;
            this.item.CustomerName = null;
            this.item.CustomerEmail = null;
        }
    }

    needChange() {
        this.updatePriceText();
        this.updatePriceLabel();
        this.updateRentPriceText();
        if (this.enableEventChange) {
            this.loadConfig();
            this.updateUnitPrice();
            this.updateCommission();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    areaChange() {
        if (this.enableEventChange) {
            if (this.item.Area) {
                this.item.Area = parseFloat(this.item.Area.toString().replace(',', '.').toString());
                if (this.item.Area > 0) {
                    if (this.item.Facade) {
                        this.item.Facade = parseFloat(this.item.Facade.toString().replace(',', '.').toString());
                        this.item.Depth = parseFloat((this.item.Area / this.item.Facade).toFixed(2));
                    }
                    else if (this.item.Depth) {
                        this.item.Depth = parseFloat(this.item.Depth.toString().replace(',', '.').toString());
                        this.item.Facade = parseFloat((this.item.Area / this.item.Depth).toFixed(2));
                    }
                }
            }
            this.updatePriceText();
            this.updateCommission();
            this.updateRentPriceText();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    cityChange() {
        if (this.enableEventChange) {
            this.item.Coordinates = null;
            this.enableEventChange = false;
            this.item.ProjectMeeyId = null;
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    depthChange() {
        if (this.enableEventChange) {
            if (this.item.Depth) {
                this.item.Depth = parseFloat(this.item.Depth.toString().replace(',', '.').toString());
                if (this.item.Depth > 0) {
                    if (this.item.Area) {
                        let round = this.item.Depth && this.item.Facade
                            ? this.item.Depth * this.item.Facade
                            : null;
                        if (!(round && Math.round(this.item.Area) == Math.round(round))) {
                            this.item.Area = parseFloat(this.item.Area.toString().replace(',', '.').toString());
                            this.item.Facade = parseFloat((this.item.Area / this.item.Depth).toFixed(2));
                        }
                    } else if (this.item.Facade) {
                        this.item.Facade = parseFloat(this.item.Facade.toString().replace(',', '.').toString());
                        this.item.Area = parseFloat((this.item.Facade * this.item.Depth).toFixed(2));
                    }
                }
            }
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    priceChange() {
        if (this.enableEventChange) {
            if (this.item.Price) {
                this.item.Price = parseFloat(this.item.Price.toString().replace(',', '.').toString());
            }
            this.updatePriceText();
            this.updateCommission();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    floorChange() {
        if (this.enableEventChange) {
            let round = Math.floor(this.item.Floor),
                floor = Math.abs(this.item.Floor - round);
            if (floor == 0.5)
                return;
            else if (floor < 0.5)
                this.item.Floor = round;
            else
                this.item.Floor = round + 1;
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    facadeChange() {
        if (this.enableEventChange) {
            if (this.item.Facade) {
                this.item.Facade = parseFloat(this.item.Facade.toString().replace(',', '.').toString());
                if (this.item.Facade > 0) {
                    if (this.item.Area) {
                        let round = this.item.Depth && this.item.Facade
                            ? this.item.Depth * this.item.Facade
                            : null;
                        if (!(round && Math.round(this.item.Area) == Math.round(round))) {
                            this.item.Area = parseFloat(this.item.Area.toString().replace(',', '.').toString());
                            this.item.Depth = parseFloat((this.item.Area / this.item.Facade).toFixed(2));
                        }
                    } else if (this.item.Depth) {
                        this.item.Depth = parseFloat(this.item.Depth.toString().replace(',', '.').toString());
                        this.item.Area = parseFloat((this.item.Facade * this.item.Depth).toFixed(2));
                    }
                }
            }
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    vipTypeChange() {
        // clear
        this.item.PushTime = null;
        this.item.PostType = null;
        this.item.PostDays = null;
        this.item.AutoPost = false;
        this.item.PushTimes = null;
        this.item.PostNumber = null;
        this.item.MaxPostNumber = null;
        this.item.PostByEachDay = null;
        if (this.item.VipType == 'normal' && !this.item.PublishDayNumber)
            this.item.PublishDayNumber = 30;

        // update
        this.updatePushTimes();
        this.updateExpireTime();
        let priceConfig = StoreHelper.MLArticlePriceConfigs && StoreHelper.MLArticlePriceConfigs.find(c => c.Type == this.item.VipType);
        if (priceConfig) {
            this.loadSubscriptionPush(priceConfig.Id);
        }

        if (this.item.PublishTime) {
            let scheduleDays: Date[] = [];
            if (this.item.ScheduleDays && this.item.ScheduleDays.length > 0) {
                let activeDay = this.item.VipType == 'normal'
                    ? this.item.PublishDayNumber || 90
                    : this.item.PublishDayChoice || 7;
                if (activeDay > 90) activeDay = 90;
                for (let i = 0; i < activeDay; i++) {
                    let publishDate: Date = _.cloneDeep(new Date(this.item.PublishTime));
                    publishDate.setDate(publishDate.getDate() + i + 1);
                    scheduleDays.push(publishDate);
                }
                this.item.ScheduleDays = scheduleDays;
            }
        }
    }
    projectChange() {
        this.disableAddress = this.item.ProjectMeeyIds && this.item.ProjectMeeyIds.length > 0 ? true : false;
        if (this.enableEventChange) {
            this.item.Coordinates = null;
            this.enableEventChange = false;
            let projectId = this.needType == MLArticleNeedType.Sell
                ? this.item.ProjectMeeyId
                : this.item.ProjectMeeyIds;
            if (projectId) {
                this.service.selectedProject(projectId).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result) && result.Object) {
                        if (this.needType == MLArticleNeedType.Sell) {
                            let item = result.Object && result.Object[0];
                            if (item) {
                                this.item.CityMeeyId = item.CityId;
                                this.item.DistrictMeeyId = item.DistrictId;
                                this.item.WardMeeyId = item.WardId;
                                this.item.StreetMeeyId = item.StreetId;
                                this.item.Address = item.Address;
                            }
                        } else {
                            let items = result.Object as any[];
                            if (items && items.length > 0) {
                                this.item.CityMeeyId = items[0].CityId;
                                this.item.DistrictMeeyIds = items.map(c => c.DistrictId);
                                this.item.WardMeeyIds = items.map(c => c.WardId);
                                this.item.StreetMeeyIds = items.map(c => c.StreetId);
                            } else {
                                this.item.Address = null;
                                this.item.CityMeeyId = null;
                                this.item.WardMeeyIds = null;
                                this.item.StreetMeeyIds = null;
                                this.item.DistrictMeeyIds = null;
                            }
                        }

                    }
                });
            } else {
                this.item.Address = null;
                this.item.CityMeeyId = null;
                this.item.WardMeeyId = null;
                this.item.WardMeeyIds = null;
                this.item.StreetMeeyId = null;
                this.item.StreetMeeyIds = null;
                this.item.DistrictMeeyId = null;
                this.item.DistrictMeeyIds = null;
            }
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    districtChange() {
        if (this.enableEventChange) {
            this.item.Coordinates = null;
            this.enableEventChange = false;
            this.item.ProjectMeeyId = null;
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    unitAreaChange() {
        if (this.enableEventChange) {
            this.updatePriceText();
            this.updateCommission();
            this.updateRentPriceText();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    rentPriceChange() {
        if (this.enableEventChange) {
            if (this.item.RentPrice) {
                this.item.RentPrice = parseFloat(this.item.RentPrice.toString().replace(',', '.').toString());
            }
            this.updateRentPriceText();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    unitPriceChange() {
        if (this.enableEventChange) {
            this.updatePriceText();
            this.updateCommission();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    updateExpireTime() {
        if (this.enableEventChange) {
            if (this.item.PublishTime) {
                let date = _.cloneDeep(this.item.PublishTime);
                if (this.item.VipType == 'normal') {
                    this.item.PublishDayChoice = null;
                    this.item.VipTypeName = 'Tin thường';
                } else if (this.item.VipType) {
                    this.item.PublishDayNumber = null;
                    this.item.VipTypeName = 'VIP ' + this.item.VipType.replace('vip_', '').replace('vip', '');
                }
                let day = this.item.VipType == 'normal'
                    ? this.item.PublishDayNumber
                    : this.item.PublishDayChoice || 7;
                if (date && day) {
                    date = new Date(date);
                    date.setDate(date.getDate() + parseInt(day.toString()));
                    this.item.ExpireTime = date;
                } else this.item.ExpireTime = null;
                this.updatePackagePrice();
            } else {
                this.price = null;
                this.item.AutoPost = false;
                this.item.AllowSchedule = false;
            }
        }
    }
    objectTypeChange() {
        if (this.enableEventChange) {
            this.loadConfig();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    typeOfHouseChange() {
        if (this.enableEventChange) {
            this.loadConfig();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    publishTimeChange() {
        if (this.item.AutoPost && this.enableEventChange) {
            this.item.PostByEachDay = null;
            this.item.MaxPostNumber = null;
            this.item.PostNumber = null;
            this.item.AutoPost = false;
            this.item.PushTimes = null;
            this.item.PushTime = null;
            this.item.PostType = null;
            this.item.PostDays = null;
            this.updatePushTimes();
        }
        this.updateExpireTime();
    }
    numberFloorChange() {
        if (this.enableEventChange) {
            let round = Math.floor(this.item.NumberFloor),
                floor = Math.abs(this.item.NumberFloor - round);
            if (floor == 0.5)
                return;
            else if (floor < 0.5)
                this.item.NumberFloor = round;
            else
                this.item.NumberFloor = round + 1;
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    reviewTypesChange() {
        if (this.enableEventChange) {
            this.hiddenReviewTypes = !this.item.ReviewTypes || this.item.ReviewTypes.length == 0 || this.item.ReviewTypes.toString() == '[]';
            if (this.item.ReviewTypes && !this.item.ScheduleDateType)
                this.item.ScheduleDateType = MLScheduleDateType.All;
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    addMoreVideoYoube() {
        let count = this.numberVideo + 3;
        if (count <= 30) {
            this.numberVideo = count;
            for (let i = 0; i < this.numberVideo; i++) {
                if (!this.item.VideoYoutubes[i]) {
                    this.item.VideoYoutubes[i] = EntityHelper.createEntity(MLArticleVideo);
                }
            }
        }
    }
    unitRentPriceChange() {
        if (this.enableEventChange) {
            this.updateRentPriceText();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    perCommissionChange() {
        if (this.enableEventChange) {
            this.updateCommission();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    removeMoreVideoYoube() {
        let count = this.numberVideo - 3;
        if (count >= 3) {
            for (let i = count; i < this.numberVideo; i++) {
                this.item.VideoYoutubes[i] = null;
            }
            this.item.VideoYoutubes = this.item.VideoYoutubes.filter(c => c);
            this.numberVideo = this.item.VideoYoutubes.length;
            for (let i = 0; i < this.numberVideo; i++) {
                if (!this.item.VideoYoutubes[i]) {
                    this.item.VideoYoutubes[i] = EntityHelper.createEntity(MLArticleVideo);
                }
            }
        }
    }
    scheduleDateTypeChange() {

    }
    publishDayNumberChange() {
        if (this.enableEventChange) {
            if (this.item.PushTime &&
                this.item.ExpireTime &&
                this.item.MaxPostNumber < this.item.PublishDayNumber) {
                let day1 = this.item.PushTime.getTime(),
                    day2 = this.item.ExpireTime.getTime(),
                    difference = Math.abs(day2 - day1),
                    days = difference / (1000 * 3600 * 24);
                this.item.MaxPostNumber = Math.round(days + 1);
            } else if (this.item.PublishDayNumber < this.item.PostNumber) {
                this.item.PostByEachDay = null;
                this.item.MaxPostNumber = null;
                this.item.PostNumber = null;
                this.item.AutoPost = false;
                this.item.PushTimes = null;
                this.item.PushTime = null;
                this.item.PostType = null;
                this.item.PostDays = null;
                this.updatePushTimes();
            }
            this.updateExpireTime();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }
    publishDayChoiceChange() {
        if (this.enableEventChange) {
            if (this.item.PushTime &&
                this.item.ExpireTime &&
                this.item.MaxPostNumber < this.item.PublishDayChoice) {
                let day1 = this.item.PushTime.getTime(),
                    day2 = this.item.ExpireTime.getTime(),
                    difference = Math.abs(day2 - day1),
                    days = difference / (1000 * 3600 * 24);
                this.item.MaxPostNumber = Math.round(days + 1);
            } else if (this.item.PublishDayChoice < this.item.PostNumber) {
                this.item.PostByEachDay = null;
                this.item.MaxPostNumber = null;
                this.item.PostNumber = null;
                this.item.AutoPost = false;
                this.item.PushTimes = null;
                this.item.PushTime = null;
                this.item.PostType = null;
                this.item.PostDays = null;
                this.updatePushTimes();
            }
            this.updateExpireTime();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }

    closeStiky() {
        this.hideSticky = true;
    }
    changeNeedType() {
        this.needType = this.needType == MLArticleNeedType.Buy
            ? MLArticleNeedType.Sell
            : MLArticleNeedType.Buy;
    }
    async parserData() {
        if (this.item.Link) {
            this.loadingParser = true;
            await this.service.parserData(this.item.Link).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLArticleEntity, result.Object);
                    setTimeout(() => {
                        this.updatePriceText();
                        this.customerPhoneOnBlur();
                        let price = StoreHelper.MLArticlePriceConfigs.find(c => c.Type == MLArticlePackageType.Normal);
                        if (price) {
                            this.item.VipType = 'normal';
                            this.item.VipTypeName = 'Thường';
                            this.item.PublishDayNumber = 30;
                            this.item.PublishTime = new Date();
                        }
                        this.item.ShowPriceFlg = true;
                        this.item.AutoPost = false;
                        setTimeout(() => {
                            this.enableEventChange = true;
                            this.updateExpireTime();
                        }, 1000);
                    }, 500);
                } else ToastrHelper.ErrorResult(result);
            });
            this.loadingParser = false;
        }
    }
    popupPushArticle() {
        if (!this.item.PublishTime) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn ngày đăng tin để sử dụng tính năng này');
            this.item.AutoPost = false;
            return;
        }
        if (this.item.AutoPost) {
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua',
                confirmText: 'Đồng ý',
                title: 'Đặt lịch đẩy tin',
                size: ModalSizeType.Medium,
                object: MLPopupPushArticleComponent,
                objectExtra: {
                    pricePush: this.pricePush,
                    item: _.cloneDeep(this.item)
                },
            }, async (obj: MLArticleEntity) => {
                if (obj) {
                    this.item.PostByEachDay = obj.PostByEachDay;
                    this.item.MaxPostNumber = obj.MaxPostNumber;
                    this.item.PostNumber = obj.PostNumber;
                    this.item.PushTimes = obj.PushTimes;
                    this.item.PostType = obj.PostType;
                    this.item.PostDays = obj.PostDays;
                    this.item.PushTime = obj.PushTime;
                    this.updatePushTimes();
                }
            }, null, null, () => {
                if (!this.item.PushTimes || this.item.PushTimes.length == 0)
                    this.item.AutoPost = false;
            });
        } else {
            this.item.PostByEachDay = null;
            this.item.MaxPostNumber = null;
            this.item.PostNumber = null;
            this.item.PushTimes = null;
            this.item.PushTime = null;
            this.item.PostType = null;
            this.item.PostDays = null;
            this.updatePushTimes();
        }
    }
    popupScheduleArticle() {
        if (!this.item.PublishTime) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn ngày đăng tin để sử dụng tính năng này');
            this.item.AllowSchedule = false;
            return;
        }
        if (this.item.AllowSchedule) {
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua',
                confirmText: 'Đồng ý',
                title: 'Đặt lịch xem nhà',
                size: ModalSizeType.Medium,
                object: MLPopupScheduleArticleComponent,
                objectExtra: { item: _.cloneDeep(this.item) },
            }, async (obj: MLArticleEntity) => {
                if (obj) {
                    this.item.ReviewTypes = obj.ReviewTypes;
                    this.item.ScheduleDays = obj.ScheduleDays;
                    this.item.ScheduleTimes = obj.ScheduleTimes;
                    this.item.ReviewTypeStrings = obj.ReviewTypeStrings;
                }
            }, null, null, () => {
                if (!this.item.ScheduleTimes || this.item.ScheduleTimes.length == 0)
                    this.item.AllowSchedule = false;
            });
        } else {
            this.item.ReviewTypes = null;
            this.item.ScheduleDays = null;
            this.item.ScheduleTimes = null;
            this.item.ReviewTypeStrings = null;
        }
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MLArticleEntity();
            this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete?: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            let columns = this.needType == MLArticleNeedType.Sell
                ? ['UserMeeyId', 'ObjectType', 'ContactPhone', 'ContactName', 'ContactEmail', 'CityMeeyId', 'DistrictMeeyId', 'NeedMeeyId', 'TypeHouse', 'Title', 'Content', 'Area', 'Images']
                : ['UserMeeyId', 'ObjectType', 'ContactPhone', 'ContactName', 'ContactEmail', 'CityMeeyId', 'DistrictMeeyIds', 'NeedMeeyId', 'TypeHouse', 'Title', 'Content', 'PriceFromTo', 'AreaFromTo', 'Images'];
            if (this.item.UnitPrice && this.item.UnitPrice == 'thuong_luong')
                columns.push('Price');
            if (this.item.Area)
                columns.push('UnitArea');
            if (this.item.Price)
                columns.push('UnitPrice');
            if (this.item.RentPrice)
                columns.push('UnitRentPrice');
            if (!this.item.Id) {
                columns.push('ExpireTime');
                if (this.item.VipType == 'normal')
                    columns.push('PublishDayNumber');
                columns.push(...['CustomerPhone', 'CustomerEmail', 'PublishTime']);
            }
            let valid: boolean = await validation(this.item, columns);
            if (valid && this.item.VideoYoutubes && this.item.VideoYoutubes.length > 0) {
                for (let i = 0; i < this.item.VideoYoutubes.length; i++) {
                    let item = this.item.VideoYoutubes[i];
                    if (item) {
                        valid = await validation(item);
                        if (!valid) break;
                    }
                }
                if (valid) {
                    let videos = this.item.VideoYoutubes.filter(c => c.Url).map(c => c.Url);
                    let unique = videos.filter((v, i, a) => a.indexOf(v) === i);
                    if (videos.length != unique.length) {
                        valid = false;
                        this.dialogService.Error('Đường dẫn youtube không được giống nhau', 'Lỗi dữ liệu');
                    }
                }
            }
            if (valid) {
                this.processing = true;

                // upload
                let images = this.uploadImage && await this.uploadImage.image.upload();
                let videos = this.uploadVideo && await this.uploadVideo.video.upload();

                // prepare object
                let obj: MLArticleEntity = _.cloneDeep(this.item);
                obj.Videos = videos && videos.map(c => c.Path).filter(c => c && c.length > 0);
                if (images && images.length > 0) {
                    obj.Images = images.filter(c => c.Selected).map((c: FileData) => {
                        return {
                            Url: c.Path,
                            Name: c.Name,
                            Note: c.Note,
                        }
                    }) || [];
                    obj.Images.push(...images && images.filter(c => !c.Selected).map((c: FileData) => {
                        return {
                            Url: c.Path,
                            Name: c.Name,
                            Note: c.Note,
                        }
                    }));
                }
                return await this.service.addOrUpdateV4(obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        if (this.item.Id) {
                            ToastrHelper.Success('Sửa tin đăng thành công');
                            if (complete) complete();
                        } else {
                            if (this.item.TotalAmount) {
                                ToastrHelper.Success('Tạo tin đăng thành công, vui lòng tiếp tục thanh toán');
                                this.item.Code = result.Object?.article?.code;
                                this.item.OrderId = result.Object?.orderId;
                                this.item.ChargeAmount = result.Object?.chargeAmount;
                                this.item.BundlePostAmount = result.Object?.bundlePostAmount;
                                this.item.BundlePushAmount = result.Object?.bundlePushAmount;
                                this.popupPayment();
                                return false;
                            } else {
                                let date = (new Date()).getTime(),
                                    publish = this.item.PublishTime.getTime(),
                                    message = date >= publish
                                        ? 'Đăng tin thành công! Tin đang ở trạng thái Tin đang đăng'
                                        : 'Đăng tin thành công! Tin đang ở trạng thái Tin chờ đăng';
                                ToastrHelper.Success(message, 'Thông báo');
                                if (complete) complete();
                            }
                        }
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            } else this.processing = false;
        }
        return false;
    }

    private loadConfig() {
        this.fields = null;
        this.options = null;
        this.enableEventChange = false;
        if (this.item.ObjectType != null &&
            this.item.NeedMeeyId && this.item.TypeHouse) {
            let item = {
                Need: this.item.NeedMeeyId,
                ObjectType: this.item.ObjectType,
                TypeOfHouses: this.item.TypeHouse,
            };
            this.service.loadConfig(item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let options = result.Object as any[],
                        names = options && options.map(c => c.Id);
                    if (options && options.length > 0) {
                        this.fields = names;
                        options.forEach((option: any) => {
                            if (option.Options && option.Options.length > 0) {
                                if (!this.options) this.options = {};
                                this.options[option.Id] = option.Options.map((c: any) => new OptionItem(c.Id, c.Name));
                            }
                        });
                    }
                }
            });
        } else this.fields = [];
    }
    private popupPayment() {
        if (this.item.OrderId && this.item.UserMeeyId && this.item.TotalAmount) {
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua',
                confirmText: 'Thanh toán',
                title: 'Xác nhận thanh toán',
                size: ModalSizeType.ExtraLarge,
                object: MLPopupPaymentComponent,
                objectExtra: {
                    pricePush: this.pricePush,
                    item: _.cloneDeep(this.item),
                    price: _.cloneDeep(this.price),
                    totalTime: _.cloneDeep(this.totalTime),
                },
            }, async (obj: any) => {
                this.back();
            }, null, null, () => {
                this.back();
            });
        }
    }
    private async loadItem() {
        this.enableEventChange = false;
        if (this.meeyId) {
            await this.service.itemByMeeyId(this.meeyId).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.id) {
            await this.service.item('mlarticle', this.id).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.code) {
            await this.service.itemByCode(this.code).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else {
            this.item = EntityHelper.createEntity(MLArticleEntity, new MLArticleEntity());
            let price = StoreHelper.MLArticlePriceConfigs.find(c => c.Type == MLArticlePackageType.Normal);
            if (price) {
                this.item.VipType = 'normal';
                this.item.VipTypeName = 'Thường';
                this.item.PublishDayNumber = 30;
                this.item.PublishTime = new Date();
            }
            this.item.ShowPriceFlg = true;
            this.item.AutoPost = false;
            setTimeout(() => {
                this.enableEventChange = true;
                this.updateExpireTime();
            }, 1000);
        }

        // need type
        if (this.item?.NeedMeeyId && !this.needType) {
            let needStrings = ['can_mua', 'can_thue', 'mua_sang_nhuong'];
            this.needType = needStrings.indexOf(this.item.NeedMeeyId) >= 0
                ? MLArticleNeedType.Buy
                : MLArticleNeedType.Sell;
        }

        if (this.item) {
            this.updateCommission();
            this.updatePackagePrice();
            this.hiddenReviewTypes = !this.item.ReviewTypes || this.item.ReviewTypes.length == 0 || this.item.ReviewTypes.toString() == '[]';

            // video youtube
            if (!this.item.VideoYoutubes)
                this.item.VideoYoutubes = [];
            this.numberVideo = this.item.VideoYoutubes.length || 3;
            for (let i = 0; i < this.numberVideo; i++) {
                let item = this.item.VideoYoutubes[i];
                this.item.VideoYoutubes[i] = EntityHelper.createEntity(MLArticleVideo, item);
            }

            // drag-drop
            if (this.item && this.item.Content) {
                UtilityExHelper.activeDragable(this.id);
            }
        }
    }
    private updatePushTimes() {
        this.totalDay = 0; this.totalHour = 0; this.totalTime = 0;
        let pushTime = this.item.PushTime,
            expireTime = this.item.ExpireTime;
        if (pushTime && expireTime) {
            let pushHour = pushTime.getHours(),
                expireHour = expireTime.getHours(),
                pushMinute = pushTime.getMinutes(),
                expireMinute = expireTime.getMinutes(),
                toDay = UtilityExHelper.dateString(new Date()),
                expireDay = UtilityExHelper.dateString(expireTime);
            if (this.item.PushTimes && this.item.PushTimes.length > 0) {
                if (this.item.PostType == MLArticlePostType.Repeat) {
                    this.totalDay = this.item.PostNumber;
                    this.totalHour = this.item.PushTimes[0].Times && this.item.PushTimes[0].Times.length;
                    for (let i = 0; i < this.totalDay; i++) {
                        let times = this.item.PushTimes[0].Times,
                            choiceDate: Date = _.cloneDeep(pushTime);
                        choiceDate.setDate(choiceDate.getDate() + i);
                        let choiceDay = UtilityExHelper.dateString(choiceDate);
                        times.forEach((itemTime: string) => {
                            this.totalTime += 1;
                            let hour = parseInt(itemTime.split(':')[0]),
                                minute = parseInt(itemTime.split(':')[1]);
                            if (toDay == choiceDay) {
                                if (pushHour > hour) this.totalTime -= 1;
                                else if (pushHour == hour && pushMinute > minute) this.totalTime -= 1;
                            }
                            if (expireDay == choiceDay) {
                                if (expireHour < hour) this.totalTime -= 1;
                                else if (expireHour == hour && expireMinute < minute) this.totalTime -= 1;
                            }
                        });
                    }
                } else {
                    let time: number = 0;
                    this.totalDay = this.item.PostDays && this.item.PostDays.length;
                    this.totalHour = this.item.PushTimes[0].Times && this.item.PushTimes[0].Times.length;
                    if (this.item.PostByEachDay) {
                        this.item.PushTimes.forEach(element => {
                            time += element.Times ? element.Times.length : 0;
                        });
                        this.totalHour = 0;
                        this.totalTime = time;
                    } else {
                        if (!this.item.PostDays) this.item.PostDays = [];
                        this.item.PostDays.forEach((choiceDate: Date) => {
                            let times = this.item.PushTimes[0].Times,
                                choiceDay = UtilityExHelper.dateString(choiceDate);
                            times.forEach((itemTime: string) => {
                                this.totalTime += 1;
                                let hour = parseInt(itemTime.split(':')[0]),
                                    minute = parseInt(itemTime.split(':')[1]);
                                if (toDay == choiceDay) {
                                    if (pushHour > hour) this.totalTime -= 1;
                                    else if (pushHour == hour && pushMinute > minute) this.totalTime -= 1;
                                }
                                if (expireDay == choiceDay) {
                                    if (expireHour < hour) this.totalTime -= 1;
                                    else if (expireHour == hour && expireMinute < minute) this.totalTime -= 1;
                                }
                            });
                        });
                    }
                }
            }
        }
        this.item.TotalAmount = ((this.price && this.price.TotalPriceFinal) || 0) + ((this.totalTime * this.pricePush) || 0);
    }
    private updatePriceText() {
        this.priceNumberText = null;
        this.totalPriceNumberText = null;
        if (!this.item.Price || !this.item.UnitPrice) return;

        let area = this.getNumber(this.item.Area),
            price = this.getPriceFromUnit(this.getNumber(this.item.Price));
        if (area) {
            if (this.item.UnitPrice.indexOf('_m2') >= 0) {
                let priceNumber = this.roundNumber(price),
                    totalPriceNumber = this.firstLoad && this.item.TotalPrice
                        ? this.roundNumber(this.item.TotalPrice)
                        : this.roundNumber(price * area),
                    unitPriceNumber = this.getNumberText(priceNumber) + '/m2',
                    unitTotalPriceNumber = this.getNumberText(totalPriceNumber);
                this.firstLoad = false;
                this.item.TotalPrice = totalPriceNumber;
                this.priceNumberText = this.formatPrice(priceNumber) + ' ' + unitPriceNumber;
                this.totalPriceNumberText = this.formatPrice(totalPriceNumber) + ' ' + unitTotalPriceNumber;
            } else {
                let totalPriceNumber = this.roundNumber(price),
                    priceNumber = this.roundNumber(price / area),
                    unitPriceNumber = this.getNumberText(priceNumber) + '/m2',
                    unitTotalPriceNumber = this.getNumberText(totalPriceNumber);
                this.item.TotalPrice = totalPriceNumber;
                this.priceNumberText = this.formatPrice(priceNumber) + ' ' + unitPriceNumber;
                this.totalPriceNumberText = this.formatPrice(totalPriceNumber) + ' ' + unitTotalPriceNumber;
            }
        } else {
            if (this.item.UnitPrice.indexOf('_m2') >= 0) {
                let priceNumber = this.roundNumber(price),
                    unitPriceNumber = this.getNumberText(priceNumber) + '/m2';
                this.priceNumberText = this.formatPrice(priceNumber) + ' ' + unitPriceNumber;
            } else {
                let totalPriceNumber = this.roundNumber(price),
                    unitTotalPriceNumber = this.getNumberText(totalPriceNumber);
                this.item.TotalPrice = totalPriceNumber;
                this.totalPriceNumberText = this.formatPrice(totalPriceNumber) + ' ' + unitTotalPriceNumber;
            }
        }
        // if (this.item.NeedMeeyId == 'can_ban' || this.item.NeedMeeyId == 'can_mua') {
        //     if (price) {
        //         price = this.getPriceFromUnit(price);
        //         if (price) {
        //             this.priceText = area ? 'Đơn giá: ' : 'Tổng giá: ';
        //             let priceNumber = area ? this.roundNumber(price / area) : this.roundNumber(price),
        //                 unitPriceNumber = area
        //                     ? this.getNumberText(priceNumber) + '/m2'
        //                     : this.getNumberText(priceNumber),
        //                 priceNumberText = priceNumber >= 1000000000
        //                     ? priceNumber / 1000000000
        //                     : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        //             this.priceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
        //         }
        //     }
        // } else if (this.item.NeedMeeyId == 'cho_thue' || this.item.NeedMeeyId == 'can_thue') {
        //     if (this.item.UnitPrice.indexOf('_m2') >= 0) {
        //         price = this.getPriceFromUnit(price);
        //         if (price) {
        //             this.priceText = 'Tiền thuê: ';
        //             let priceNumber = this.roundNumber(price * area),
        //                 unitPriceNumber = this.getNumberText(priceNumber) + '/tháng',
        //                 priceNumberText = priceNumber >= 1000000000
        //                     ? priceNumber / 1000000000
        //                     : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        //             this.priceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
        //         }
        //     } else {
        //         if (price) {
        //             price = this.getPriceFromUnit(price);
        //             if (price) {
        //                 this.priceText = 'Tiền thuê: ';
        //                 let priceNumber = this.roundNumber(price),
        //                     unitPriceNumber = this.getNumberText(priceNumber) + '/Tháng',
        //                     priceNumberText = priceNumber >= 1000000000
        //                         ? priceNumber / 1000000000
        //                         : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        //                 this.priceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
        //             }
        //         }
        //     }
        // } else if (this.item.NeedMeeyId == 'sang_nhuong' || this.item.NeedMeeyId == 'mua_sang_nhuong') {
        //     if (this.item.UnitPrice.indexOf('_m2') >= 0) {
        //         price = this.getPriceFromUnit(price);
        //         if (price) {
        //             this.priceText = 'Tổng giá sang nhượng: ';
        //             let priceNumber = this.roundNumber(price * area),
        //                 unitPriceNumber = this.getNumberText(priceNumber),
        //                 priceNumberText = priceNumber >= 1000000000
        //                     ? priceNumber / 1000000000
        //                     : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        //             this.priceNumber = priceNumber;
        //             this.priceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
        //         }
        //     } else {
        //         if (price) {
        //             price = this.getPriceFromUnit(price);
        //             if (price) {
        //                 this.priceText = 'Tổng giá sang nhượng: ';
        //                 let priceNumber = this.roundNumber(price),
        //                     unitPriceNumber = this.getNumberText(priceNumber),
        //                     priceNumberText = priceNumber >= 1000000000
        //                         ? priceNumber / 1000000000
        //                         : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        //                 this.priceNumber = priceNumber;
        //                 this.priceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
        //             }
        //         }
        //     }
        // }
    }
    private updateUnitPrice() {
        if (this.item) {
            switch (this.item.NeedMeeyId) {
                case 'can_ban': {
                    if (!this.item.UnitPrice || this.item.UnitPrice != 'ty')
                        this.item.UnitPrice = 'ty';
                }
                    break;
                case 'cho_thue': {
                    if (!this.item.UnitPrice || this.item.UnitPrice != 'trieu_thang')
                        this.item.UnitPrice = 'trieu_thang';
                }
                    break;
                case 'sang_nhuong': {
                    if (!this.item.UnitPrice || this.item.UnitPrice != 'ty')
                        this.item.UnitPrice = 'ty';
                    if (!this.item.UnitRentPrice || this.item.UnitRentPrice != 'trieu_thang')
                        this.item.UnitRentPrice = 'trieu_thang';
                }
                    break;
            }
        }
    }
    private updatePriceLabel() {
        this.priceLabel = this.item.NeedMeeyId && this.item.NeedMeeyId.indexOf('sang_nhuong') >= 0
            ? 'Giá sang nhượng'
            : this.item.NeedMeeyId && this.item.NeedMeeyId.indexOf('thue') >= 0
                ? 'Giá thuê'
                : this.item.NeedMeeyId && this.item.NeedMeeyId.indexOf('mua') >= 0
                    ? 'Giá mua'
                    : 'Giá bán';
    }
    private updateCommission() {
        if (this.item) {
            if (this.item.MediateType == MLArtilceMediateType.Yes && this.needType == MLArticleNeedType.Sell) {
                let ignoreValues = ['tien_mat', 'thoa_thuan'];
                if (this.item.Price &&
                    this.item.PerCommission &&
                    ignoreValues.indexOf(this.item.PerCommission) == -1) {
                    let priceNumber = this.getPriceFromUnit(this.getNumber(this.item.Price));
                    if (priceNumber) {
                        this.item.Commission = priceNumber * parseFloat(this.item.PerCommission) / 100;
                    }
                } else this.item.Commission = null;
            } else this.item.Commission = null;
        }
    }
    private updatePackagePrice() {
        if (this.item) {
            let days = this.item.PublishDayNumber || this.item.PublishDayChoice;
            let price = StoreHelper.MLArticlePriceConfigs.filter(c => c.Days == days)
                .find(c => c.Type == <MLArticlePackageType>this.item.VipType);
            if (!price)
                price = StoreHelper.MLArticlePriceConfigs.find(c => c.Type == <MLArticlePackageType>this.item.VipType);
            this.price = price;
            this.item.BundlePostId = price && price.BundlePostId;
            this.item.TotalAmount = ((this.price && this.price.TotalPriceFinal) || 0) + ((this.totalTime * this.pricePush) || 0);
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [];
        actions.push(ActionData.back(() => { this.back() }));
        if (this.item.Id)
            actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirm() }));
        else
            actions.push(ActionData.saveAddNew('Đăng tin', () => { this.confirmAndBack() }));

        this.actions = await this.authen.actionsAllowName(this.pathName, actions);
    }
    private updateRentPriceText() {
        this.rentPriceText = null;
        this.rentPriceNumberText = null;
        if (!this.item.UnitRentPrice) return;
        let area = this.getNumber(this.item.Area),
            price = this.getNumber(this.item.RentPrice);
        if (this.item.NeedMeeyId == 'sang_nhuong' || this.item.NeedMeeyId == 'mua_sang_nhuong') {
            if (this.item.UnitRentPrice.indexOf('_m2') >= 0) {
                price = this.getPriceFromUnitRent(price);
                if (price) {
                    this.rentPriceText = 'Tổng tiền thuê: ';
                    let priceNumber = this.roundNumber(price * area),
                        unitPriceNumber = this.getNumberText(priceNumber) + '/tháng',
                        priceNumberText = priceNumber >= 1000000000
                            ? priceNumber / 1000000000
                            : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
                    this.rentPriceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
                }
            } else {
                if (price) {
                    price = this.getPriceFromUnitRent(price);
                    if (price) {
                        this.rentPriceText = 'Tổng tiền thuê: ';
                        let priceNumber = this.roundNumber(price),
                            unitPriceNumber = this.getNumberText(priceNumber) + '/tháng',
                            priceNumberText = priceNumber >= 1000000000
                                ? priceNumber / 1000000000
                                : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
                        this.rentPriceNumberText = this.formatNumber(priceNumberText) + ' ' + unitPriceNumber;
                    }
                }
            }
        }
    }
    private updateReviewTypeStrings() {
        this.item.ReviewTypeStrings = '';
        if (this.item.ReviewTypes && this.item.ReviewTypes.length > 0) {
            let values = this.item.ReviewTypes && JSON.parse(this.item.ReviewTypes) as any[];
            values.forEach((type: any) => {
                let optionItem = ConstantHelper.ML_SCHEDULE_TYPES.find(c => c.value == type);
                if (optionItem) {
                    this.item.ReviewTypeStrings += this.item.ReviewTypeStrings
                        ? ', ' + optionItem.label
                        : optionItem.label;
                }
            });
        }
    }
    private async loadSubscriptions() {
        if (!StoreHelper.MLArticlePriceConfigs || StoreHelper.MLArticlePriceConfigs.length == 0) {
            StoreHelper.MLArticlePriceConfigs = [];
            await this.service.subscriptions().then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.subscriptions = result.Object;
                    if (this.subscriptions) {
                        let keys = Object.keys(this.subscriptions);
                        if (keys && keys.length > 0) {
                            keys.forEach((key: string) => {
                                let type = null;
                                switch (key) {
                                    case 'vip1': type = MLArticlePackageType.Vip1; break;
                                    case 'vip2': type = MLArticlePackageType.Vip2; break;
                                    case 'vip3': type = MLArticlePackageType.Vip3; break;
                                    case 'normal': type = MLArticlePackageType.Normal; break;
                                }
                                if (this.subscriptions[key]) {
                                    let bundles = this.subscriptions[key].bundles;
                                    if (bundles && bundles.length > 0) {
                                        bundles.forEach((bundle: any) => {
                                            StoreHelper.MLArticlePriceConfigs.push({
                                                Type: type,
                                                Name: bundle.title,
                                                Days: bundle.amount,
                                                BundlePostId: bundle._id,
                                                TotalPriceFinal: bundle.total,
                                                TotalPrice: bundle.originTotal,
                                                Id: this.subscriptions[key]._id,
                                                Percent: bundle.discountPercent * 100,
                                                Price: bundle.originTotal / bundle.amount,
                                            })
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }
    private formatNumber(number: number) {
        return number ? number.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) : '';
    }
    private renderItem(result: ResultApi) {
        if (ResultApi.IsSuccess(result)) {
            this.item = EntityHelper.createEntity(MLArticleEntity, result.Object);
            this.loadConfig();
            this.updatePriceLabel();
            this.updateCommission();
            this.updateReviewTypeStrings();
            if (!this.item.Id) this.item.Id = this.id;
            if (this.item.ProjectMeeyId) {
                this.item.ProjectOptionItem = {
                    label: this.item.ProjectName,
                    value: this.item.ProjectMeeyId,
                };
            }
            if (this.item.ProjectMeeyIds && this.item.ProjectMeeyIds.length > 0) {
                this.item.ProjectOptionItem = this.item?.Projects?.filter(c => c.Id).map(c => {
                    return {
                        label: c.Name,
                        value: c.Id,
                    }
                });
            }
            this.item.ScheduleTimes = result.Object && result.Object.ScheduleTimes;
            this.item.ScheduleDays = result.Object && result.Object.ScheduleDays;
        }
    }
    private loadSubscriptionPush(id: string) {
        this.service.subscriptionPush(id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.subscriptionPush = result.Object;
                if (this.subscriptionPush) {
                    this.pricePush = this.subscriptionPush.Total;
                    this.item.BundlePushId = this.subscriptionPush.BundleId;
                }
            }
        });
    }
    private formatPrice(priceNumber: number) {
        let priceNumberText = priceNumber >= 1000000000
            ? priceNumber / 1000000000
            : priceNumber >= 1000000 ? priceNumber / 1000000 : priceNumber / 1000;
        return this.formatNumber(priceNumberText);
    }
    private roundNumber(value: number): number {
        const x = Math.pow(10, 2);
        return Math.round(value * x) / x;
    }
    private getNumber(numberText: any): number {
        if (numberText) {
            try {
                return parseFloat(numberText.toString().replace(',', '.')) || 0;
            } catch {
                return 0;
            }
        } return 0;
    }
    private getNumberText(number: number): string {
        return number >= 1000000000
            ? 'Tỷ'
            : number >= 1000000
                ? 'Triệu'
                : number >= 1000 ? 'Nghìn' : 'đ';
    }
    private getPriceFromUnit(price: number): number {
        if (!price) return price;
        if (this.item.UnitPrice.indexOf('ty') >= 0) {
            price = price * 1000000000;
        } else if (this.item.UnitPrice.indexOf('trieu') >= 0) {
            price = price * 1000000;
        } else if (this.item.UnitPrice.indexOf('tram_nghin') >= 0) {
            price = price * 100000;
        } else if (this.item.UnitPrice.indexOf('nghin') >= 0) {
            price = price * 1000;
        } else price = 0;
        return price;
    }
    private getPriceFromUnitRent(price: number): number {
        if (!price) return price;
        if (this.item.UnitRentPrice.indexOf('ty') >= 0) {
            price = price * 1000000000;
        } else if (this.item.UnitRentPrice.indexOf('trieu') >= 0) {
            price = price * 1000000;
        } else if (this.item.UnitRentPrice.indexOf('tram_nghin') >= 0) {
            price = price * 100000;
        } else if (this.item.UnitRentPrice.indexOf('nghin') >= 0) {
            price = price * 1000;
        } else price = 0;
        return price;
    }
}