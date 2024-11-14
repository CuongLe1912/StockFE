import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { MLMarkReportComponent } from '../mark.report/mark.report.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLCancelArticleComponent } from '../cancel.article/cancel.article.component';
import { MLRejectArticleComponent } from '../reject.article/reject.article.component';
import { ActionType, ControllerType } from '../../../_core/domains/enums/action.type';
import { MLApproveArticleComponent } from '../approve.article/approve.article.component';
import { MLTransferArticleComponent } from '../transfer.article/transfer.article.component';
import { MLArticleEntity, MLArticleReportEntity, MLArticleVideo } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleAccessType, MLArticleNeedType, MLArticleReportStatusType, MLArticleStatusType, MLArticleType, MLArtilceMediateType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: './view.article.component.html',
    styleUrls: ['./view.article.component.scss'],
})
export class MLViewArticleComponent extends EditComponent implements OnInit {
    id: number;
    code: string;
    meeyId: string;
    reportId: string;
    fields: string[];
    priceLabel: string;
    numberVideo: number;
    priceNumber: number;
    @Input() params: any;
    tab: string = 'image';
    needType: MLArticleNeedType;
    report: MLArticleReportEntity;
    articleTab: string = 'article';
    pathName: string = 'mlarticle';
    allowViewArticleHistory: boolean;
    MLArticleNeedType = MLArticleNeedType;
    MLArticleStatusType = MLArticleStatusType;
    MLArtilceMediateType = MLArtilceMediateType;
    item: MLArticleEntity = new MLArticleEntity();

    authen: AdminAuthService;
    service: MLArticleService;
    dialog: AdminDialogService;

    constructor() {
        super();
        this.pathName = location.pathname
            .replace('/admin/', '')
            .replace('/view', '')
            .replace('/edit', '')
            .replace('/add', '');
        this.dialog = AppInjector.get(AdminDialogService);
        this.service = AppInjector.get(MLArticleService);
        this.authen = AppInjector.get(AdminAuthService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.code = this.getParam('code');
        this.meeyId = this.getParam('meeyId');
        this.reportId = this.getParam('reportId');
        this.needType = this.getParam('needType');
        this.updateState();
        await this.loadItem();
        if (this.reportId) {
            this.breadcrumbs[this.breadcrumbs.length - 1] = {
                Name: 'Báo cáo tin đăng',
                Link: '/admin/' + this.pathName + '/report'
            };
        }
        if (this.item && this.item.Id) {
            if (this.reportId) this.addBreadcrumb('Xem báo cáo tin đăng [' + this.item.Code + ']');
            else this.addBreadcrumb('Xem tin đăng [' + this.item.Code + ']');
        }
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }
    selectedArticleTab(tab: string) {
        this.articleTab = tab;
    }

    private updateState() {
        if (!this.state)
            this.state = new NavigationStateData();
        let url = '/admin/' + this.pathName;
        if (this.reportId) {
            url = '/admin/' + this.pathName + '/report';
        } else if (this.router.url.indexOf('crawl') >= 0) {
            url = '/admin/' + this.pathName + 'crawl';
        }
        this.state.prevUrl = url;
    }
    private async loadItem() {
        if (this.id) {
            await this.service.item('mlarticle', this.id).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.code) {
            await this.service.itemByCode(this.code).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.meeyId) {
            await this.service.itemByMeeyId(this.meeyId).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.reportId) {
            await this.service.itemByReportId(this.reportId).then((result: ResultApi) => {
                this.renderItem(result);
            });
        }

        // need type
        if (this.item?.NeedMeeyId) {
            let needStrings = ['can_mua', 'can_thue', 'mua_sang_nhuong'];
            this.needType = needStrings.indexOf(this.item.NeedMeeyId) >= 0
                ? MLArticleNeedType.Buy
                : MLArticleNeedType.Sell;
        }

        await this.renderActions();
        this.updatePriceText();
        this.updateCommission();
        this.loadConfig();

        // video youtube
        if (!this.item.VideoYoutubes)
            this.item.VideoYoutubes = [];
        this.numberVideo = this.item.VideoYoutubes.length || 3;
        for (let i = 0; i < this.numberVideo; i++) {
            let item = this.item.VideoYoutubes[i];
            this.item.VideoYoutubes[i] = EntityHelper.createEntity(MLArticleVideo, item);
        }
    }
    private updatePriceText() {
        this.priceNumber = 0;
        if (!this.item.UnitPrice) return;
        let area = this.getNumber(this.item.Area),
            price = this.getNumber(this.item.Price);
        if (this.item.NeedMeeyId == 'can_ban' || this.item.NeedMeeyId == 'can_mua') {
            if (price && area) {
                price = this.getPriceFromUnit(price);
                if (price) {
                    this.priceNumber = price;
                }
            }
        } else if (this.item.NeedMeeyId == 'cho_thue' || this.item.NeedMeeyId == 'can_thue') {
            if (this.item.UnitPrice.indexOf('_m2_') >= 0) {
                if (price && area) {
                    price = this.getPriceFromUnit(price);
                    if (price) {
                        let priceNumber = this.roundNumber(price * area);
                        this.priceNumber = priceNumber;
                    }
                }
            } else {
                if (price) {
                    price = this.getPriceFromUnit(price);
                    if (price) {
                        let priceNumber = this.roundNumber(price);
                        this.priceNumber = priceNumber;
                    }
                }
            }
        } else if (this.item.NeedMeeyId == 'sang_nhuong' || this.item.NeedMeeyId == 'mua_sang_nhuong') {
            if (this.item.UnitPrice.indexOf('_m2') >= 0) {
                if (price && area) {
                    price = this.getPriceFromUnit(price);
                    if (price) {
                        let priceNumber = this.roundNumber(price * area);
                        this.priceNumber = priceNumber;
                    }
                }
            } else {
                if (price) {
                    price = this.getPriceFromUnit(price);
                    if (price) {
                        let priceNumber = this.roundNumber(price);
                        this.priceNumber = priceNumber;
                    }
                }
            }
        }
    }
    private updateCommission() {
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
    private async renderActions() {
        let actions: ActionData[] = [];
        if (this.reportId) {
            let actionReports: ActionData[] = [];
            if (this.report && this.report.Status != MLArticleReportStatusType.Processed) {
                if (this.item[ActionType.Verify]) {
                    actionReports.push({
                        name: 'Đã xử lý',
                        icon: 'la la-check',
                        className: 'btn btn-success',
                        systemName: ActionType.Verify,
                        click: () => {
                            this.mark([this.item]);
                        }
                    });
                    actionReports = await this.authen.actionsAllowName(ControllerType.MLArticleReport.toLowerCase(), actionReports);
                }
            }
            if (this.item.StatusType == MLArticleStatusType.Publish) {
                if (this.item[ActionType.CancelArticle]) {
                    actions.push({
                        icon: 'la la-download',
                        className: 'btn btn-success',
                        name: ActionType.CancelArticle,
                        systemName: ActionType.CancelArticle,
                        controllerName: this.item.Crawl ? ControllerType.MLArticleCrawl : ControllerType.MLArticle,
                        click: () => {
                            this.cancel([this.item]);
                        }
                    });
                }
            }
            if (this.item.AccessType != MLArticleAccessType.Deleted) {
                if (this.item[ActionType.Edit]) {
                    actions.push({
                        name: 'Sửa tin',
                        icon: 'la la-pencil',
                        className: 'btn btn-info',
                        systemName: ActionType.Edit,
                        click: () => {
                            this.edit(this.item);
                        }
                    });
                }
            }
            let allActions = this.item.GroupArticleName == 'Tin crawl'
                ? await this.authen.actionsAllowName(ControllerType.MLArticleCrawl.toLowerCase(), actions)
                : await this.authen.actionsAllowName(ControllerType.MLArticle.toLowerCase(), actions);
            this.actions = [ActionData.back(() => { this.back() })];
            if (actionReports && actionReports.length > 0)
                this.actions.push(...actionReports);
            if (allActions && allActions.length > 0)
                this.actions.push(...allActions);
        } else {
            actions.push(ActionData.back(() => { this.back() }));
            if (this.item.StatusType != MLArticleStatusType.Deleted) {
                if (this.item[ActionType.TransferArticle]) {
                    actions.push({
                        icon: 'la la-share-alt',
                        className: 'btn btn-success',
                        name: ActionType.TransferArticle,
                        systemName: ActionType.TransferArticle,
                        click: () => {
                            this.transfer([this.item]);
                        }
                    });
                }
            }
            if (this.item.StatusType == MLArticleStatusType.WaitApprove) {
                if (this.item[ActionType.ApproveArticle]) {
                    actions.push({
                        icon: 'la la-check',
                        className: 'btn btn-success',
                        name: ActionType.ApproveArticle,
                        systemName: ActionType.ApproveArticle,
                        click: () => {
                            this.approve(this.item);
                        }
                    });
                }
            }
            if (this.item.StatusType == MLArticleStatusType.Publish) {
                if (this.item[ActionType.CancelArticle]) {
                    actions.push({
                        icon: 'la la-download',
                        className: 'btn btn-success',
                        name: ActionType.CancelArticle,
                        systemName: ActionType.CancelArticle,
                        click: () => {
                            this.cancel([this.item]);
                        }
                    });
                }
            }
            if (this.item.AccessType != MLArticleAccessType.Deleted) {
                if (this.item[ActionType.Edit]) {
                    actions.push({
                        name: 'Sửa tin',
                        icon: 'la la-pencil',
                        className: 'btn btn-info',
                        systemName: ActionType.Edit,
                        click: () => {
                            this.edit(this.item);
                        }
                    });
                }
            }
            this.actions = this.item.GroupArticleName == 'Tin crawl'
                ? await this.authen.actionsAllowName(this.pathName + 'crawl', actions)
                : await this.authen.actionsAllowName(this.pathName, actions);
        }
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
    private getPriceFromUnit(price: number): number {
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

    edit(item: any) {
        if (!this.state)
            this.state = this.getUrlState();
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevUrl: '/admin/' + this.pathName,
            prevData: this.state?.prevData,
        };
        let url = '/admin/' + this.pathName + '/edit';
        if (this.router.url.indexOf('crawl') >= 0) {
            url = '/admin/' + this.pathName + 'crawl/edit';
            obj.prevUrl = '/admin/' + this.pathName + 'crawl';
        }
        this.router.navigate([url], { state: { params: JSON.stringify(obj) } });
    }
    mark(items: any[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            let firstItem = <MLArticleEntity>cloneItems[0];
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                confirmText: 'Xác nhận',
                size: ModalSizeType.Large,
                title: 'Đánh dấu Đã xử lý',
                object: MLMarkReportComponent,
                objectExtra: {
                    items: cloneItems,
                    reportId: (<any>firstItem).Report?.Id,
                },
            }, async () => { this.loadItem(); });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để xử lý');
    }
    cancel(items: any[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            let firstItem = <MLArticleEntity>cloneItems[0];
            this.dialogService.WapperAsync({
                title: 'Hạ tin đăng',
                cancelText: 'Hủy bỏ',
                confirmText: 'Xác nhận',
                size: ModalSizeType.Large,
                object: MLCancelArticleComponent,
                objectExtra: {
                    items: cloneItems,
                    allowSendEmail: firstItem.Type == MLArticleType.Self
                },
            }, async () => { this.loadItem(); });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để hạ tin');
    }
    viewUser(meeyId: string) {
        let obj: NavigationStateData = {
            prevUrl: '/admin/mluser',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
        this.setUrlState(obj, 'mluser');
        window.open(url, "_blank");
    }

    private loadConfig() {
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
                    this.fields = names;
                }
            });
        } else this.fields = [];
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
    private approve(item: any) {
        this.dialogService.WapperAsync({
            rejectText: 'Từ chối',
            confirmText: 'Đồng ý',
            title: 'Duyệt đăng tin',
            size: ModalSizeType.Medium,
            object: MLApproveArticleComponent,
            objectExtra: { item: _.cloneDeep(item) }
        }, async () => {
            this.loadItem();
        }, async () => {
            setTimeout(() => {
                this.dialogService.WapperAsync({
                    cancelText: 'Hủy bỏ',
                    confirmText: 'Xác nhận',
                    size: ModalSizeType.Medium,
                    title: 'Từ chối duyệt đăng tin',
                    object: MLRejectArticleComponent,
                    objectExtra: { item: _.cloneDeep(item) }
                }, async () => {
                    this.loadItem();
                });
            }, 500);
        });
    }
    private transfer(items: any[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                confirmText: 'Xác nhận',
                size: ModalSizeType.Large,
                title: 'Điều chuyển tin đăng',
                objectExtra: { items: cloneItems },
                object: MLTransferArticleComponent,
            }, async () => { this.loadItem(); });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để điều chuyển');
    }
    private renderItem(result: ResultApi) {
        if (ResultApi.IsSuccess(result)) {
            let item: MLArticleEntity = result.Object;
            this.item = EntityHelper.createEntity(MLArticleEntity, item);
            if (this.item?.Report)
                this.report = EntityHelper.createEntity(MLArticleReportEntity, this.item.Report);
            if (!this.item.Id) this.item.Id = this.id;
            if (this.item.ProjectMeeyId) {
                this.item.ProjectOptionItem = {
                    label: this.item.ProjectName,
                    value: this.item.ProjectMeeyId,
                };
            }
            if (this.item.ProjectMeeyIds && this.item.ProjectMeeyIds.length > 0) {
                this.item.ProjectOptionItem = this.item?.Projects?.map(c => {
                    return {
                        label: c.Name,
                        value: c.Id,
                    }
                });
            }
            this.updatePriceLabel();
            this.item.OrderInfos = item.OrderInfos;
            this.item.Status = UtilityExHelper.formatArticleStatus(this.item.StatusType);
        }
    }
}