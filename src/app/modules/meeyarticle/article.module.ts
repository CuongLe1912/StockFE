import * as _ from 'lodash';
import { AppInjector } from '../../app.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MLArticleService } from './article.service';
import { Router, RouterModule } from "@angular/router";
import { ShareModule } from "../../modules/share.module";
import { AppConfig } from '../../_core/helpers/app.config';
import { MeeyCrmService } from '../meeycrm/meeycrm.service';
import { UtilityModule } from "../../modules/utility.module";
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { TableData } from '../../_core/domains/data/table.data';
import { ResultApi } from '../../_core/domains/data/result.api';
import { ToastrHelper } from '../../_core/helpers/toastr.helper';
import { ActionData } from "../../_core/domains/data/action.data";
import { OptionItem } from '../../_core/domains/data/option.item';
import { FilterData } from '../../_core/domains/data/filter.data';
import { ActionType } from "../../_core/domains/enums/action.type";
import { CompareType } from '../../_core/domains/enums/compare.type';
import { ConstantHelper } from '../../_core/helpers/constant.helper';
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../_core/helpers/utility.helper";
import { BaseEntity } from '../../_core/domains/entities/base.entity';
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../_core/components/grid/grid.component";
import { MLAddArticleComponent } from './add.article/add.article.component';
import { MLMarkReportComponent } from './mark.report/mark.report.component';
import { MLListArticleComponent } from './components/list.article.component';
import { Component, Input, NgModule, OnDestroy, OnInit } from "@angular/core";
import { MLSyncArticleComponent } from './sync.article/sync.article.component';
import { MLViewArticleComponent } from './view.article/view.article.component';
import { NavigationStateData } from '../../_core/domains/data/navigation.state';
import { MLPopupPaymentComponent } from './popup.payment/popup.payment.component';
import { MLCancelArticleComponent } from './cancel.article/cancel.article.component';
import { MLRejectArticleComponent } from './reject.article/reject.article.component';
import { MLRejectContentComponent } from './reject.content/reject.content.component';
import { MLArticleButtonComponent } from './article.button/article.button.component';
import { MLArticleReportComponent } from './components/list.article.report.component';
import { MLApproveContentComponent } from './approve.content/approve.content.component';
import { MLApproveArticleComponent } from './approve.article/approve.article.component';
import { MLListArticleErrorComponent } from './components/list.article.error.component';
import { MLArticleEntity } from '../../_core/domains/entities/meeyland/ml.article.entity';
import { MCRMCallLogDto } from '../../_core/domains/entities/meeycrm/mcrm.calllog.entity';
import { MLTransferArticleComponent } from './transfer.article/transfer.article.component';
import { MLArticleSyncComponent } from './popup.sync.article/popup.sync.article.component';
import { MLListArticleHistoryComponent } from './components/list.article.history.component';
import { MLListArticleServiceComponent } from './components/list.article.service.component';
import { MLReferenceArticleComponent } from './reference.article/reference.article.component';
import { MLArticleReportLiteComponent } from './components/list.article.report.lite.component';
import { MCRMCallLogType } from '../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type';
import { MLPopupPushArticleComponent } from './popup.push.article/popup.push.article.component';
import { MLPopupViewUserComponent } from '../meeyuser/popup.view.user/popup.view.user.component';
import { MLListArticleSimilarityComponent } from './components/list.article.similarity.component';
import { ModalViewProfileComponent } from '../../_core/modal/view.profile/view.profile.component';
import { MLArticleStatisticalComponent } from './article.statistical/article.statistical.component';
import { MLPopupResultArticleComponent } from './popup.result.article/popup.result.article.component';
import { MLPopupReportArticleComponent } from './popup.report.article/popup.report.article.component';
import { MLListArticleWarningPriceComponent } from './components/list.article.warning.price.component';
import { MLCancelArticleReportComponent } from './cancel.report.article/cancel.report.article.component';
import { MLArticleReportButtonComponent } from './article.report.button/article.report.button.component';
import { MLPopupScheduleArticleComponent } from './popup.schedule.article/popup.schedule.article.component';
import { MLViewArticleSimilarityComponent } from './view.article.similarity/view.article.similarity.component';
import { PopupViewImageComponent } from '../../_core/editor/upload.image/popup.view.image/popup.view.image.component';
import { PopupViewVideoComponent } from '../../_core/editor/upload.video/popup.view.video/popup.view.video.component';
import { MLScheduleViewArticleMapComponent } from '../meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component';
import { MLArticleAccessType, MLArticleNeedType, MLArticleStatusType, MLArticleType, MLArticleViewType } from '../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    selector: 'ml-list-article-all',
    styleUrls: ['./article.component.scss'],
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class MLArticleComponent extends GridComponent implements OnInit, OnDestroy {
    crmService: MeeyCrmService;
    allowVerify: boolean = true;
    @Input() articleIds: string;
    pathName: string = 'mlarticle';
    allowViewDetail: boolean = true;
    actionApproveMulti : any;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.view(originalItem);
                },
                ctrClick: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.view(originalItem);
                }
            },
            {
                icon: 'la la-share-alt',
                name: 'Điều chuyển tin',
                className: 'btn btn-success',
                systemName: ActionType.TransferArticle,
                hidden: (item: any) => {
                    return item.StatusType == MLArticleStatusType.Deleted || !item[ActionType.TransferArticle];
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.transfer(items);
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return item.StatusType == MLArticleStatusType.Deleted || !item[ActionType.Edit];
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.edit(originalItem);
                },
                ctrClick: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.edit(originalItem);
                }
            }
        ],
        Features: [
            {
                icon: 'la la-plus',
                name: 'Đăng hộ tin',
                className: 'btn btn-success',
                systemName: ActionType.AddNew,
                click: () => {
                    this.addNewArticle(MLArticleNeedType.Sell);
                }
            },
            {
                icon: 'fas fa-sync',
                name: ActionType.Sync,
                className: 'btn btn-danger',
                systemName: 'Đồng bộ tin V2',
                click: () => {
                  this.syncArticle();
                },
            },
            ActionData.reload(() => { this.loadItems(); })
        ],
        MoreActions: [
            {
                icon: 'la la-check',
                name: ActionType.ApproveArticle,
                systemName: ActionType.ApproveArticle,
                hidden: (item: any) => {
                    return item.StatusType != MLArticleStatusType.WaitApprove || !item[ActionType.ApproveArticle];
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.approve(originalItem);
                }
            },
            {
                icon: 'la la-download',
                name: ActionType.CancelArticle,
                systemName: ActionType.CancelArticle,
                hidden: (item: any) => {
                    return item.StatusType != MLArticleStatusType.Publish || !item[ActionType.CancelArticle];
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.cancel(items);
                }
            },
            {
                icon: 'la la-upload',
                name: ActionType.RePostArticle,
                systemName: ActionType.RePostArticle,
                hidden: (item: any) => {
                    return item.StatusType != MLArticleStatusType.Down || !item[ActionType.RePostArticle];
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.repost(originalItem);
                }
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                hidden: (item: any) => {
                    return item.StatusType == MLArticleStatusType.Deleted || !item[ActionType.Delete];
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.delete(originalItem);
                }
            },
            {
                icon: 'la la-exchange',
                name: ActionType.SyncArticle,
                systemName: ActionType.SyncArticle,
                hidden: (item: any) => {
                    return item.SyncElastic || !item[ActionType.SyncArticle];
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.sync(items);
                }
            },
            {
                icon: 'la la-upload',
                name: ActionType.PushArticle,
                systemName: ActionType.PushArticle,
                hidden: (item: any) => {
                    let date = new Date();
                    return !(item[ActionType.PushArticle] && item.StatusType == MLArticleStatusType.WaitPublish && item.PublishedDate && new Date(item.PublishedDate) <= date);
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.push(originalItem);
                }
            },
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.View,
                click: ((item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.history(originalItem);
                })
            }
        ],
        MoreFeatures: {
            Name: "Thao tác",
            Icon: "la la-bolt",
            Actions: [
                {
                    icon: 'la la-plus',
                    name: 'Đăng hộ tin [Mua/Thuê]',
                    systemName: ActionType.AddNew,
                    click: () => {
                        this.addNewArticle(MLArticleNeedType.Buy);
                    }
                },
                {
                    hide: true,
                    icon: 'la la-share-alt',
                    name: ActionType.TransferArticle,
                    systemName: ActionType.TransferArticle,
                    click: () => {
                        let items = this.originalItems.filter(c => c.Checked);
                        this.transfer(items);
                    }
                },
                {
                    hide: true,
                    icon: 'la la-download',
                    name: ActionType.CancelArticle,
                    systemName: ActionType.CancelArticle,
                    click: () => {
                        let items = this.originalItems.filter(c => c.Checked);
                        this.cancel(items);
                    }
                },
                {
                    hide: true,
                    name: 'Đồng bộ tin',
                    icon: 'la la-exchange',
                    systemName: ActionType.SyncArticle,
                    click: () => {
                        let items = this.originalItems.filter(c => c.Checked);
                        this.sync(items);
                    }
                }
            ],
        },
        TimerReload: {
            Timer: 600,
            AutoReload: true,
            AllowReload: true,
        },
        Checkable: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        ClassName: 'grid-article',
        Reference: MLArticleEntity,
        PageSizes: [5, 10, 20, 50],
        TotalTitle: 'Tổng lượt cảnh báo giá',
        Title: 'Danh sách tin đăng tự xuất bản',
        EmbedComponent: MLArticleButtonComponent,
        StatisticalComponent: MLArticleStatisticalComponent,
        SearchText: 'Nhập MeeyId, họ tên, email hoặc sđt của khách hàng, thông tin liên hệ',
        CustomFilters: ['Code', 'Title', 'ObjectType', 'CreatedTime', 'Source', 'NeedMeeyId', 'TypeHouse', 'PublishedDate', 'SupportIds', 'SaleIds', 'StatusSync', 'ExpireTime', 'CityMeeyId', 'DistrictMeeyId', 'ProjectMeeyId', 'PriorityDate', 'FilterVipType', 'ViewType', 'TenantArticle',  'Tenants', 'FacebookGroupUrl']
    };

    constructor(
        public router: Router,
        public apiService: MLArticleService) {
        super();
        this.crmService = AppInjector.get(MeeyCrmService);
        if (this.router.url.indexOf('crawl') >= 0) {
            this.obj.ReferenceName = 'mlarticlecrawl';
            this.obj.Url = '/admin/mlArticle/crawlItems';
            this.obj.ReferenceKey = this.pathName + 'crawl';
            this.obj.MoreActions = this.obj.MoreActions.filter(c => c.systemName != ActionType.ApproveArticle);
            this.obj.MoreFeatures.Actions = this.obj.MoreFeatures.Actions.filter(c => c.name != 'Đăng hộ tin');
            this.obj.CustomFilters = ['Code', 'Title', 'ObjectType', 'CreatedTime', 'NeedMeeyId', 'TypeHouse', 'SupportIds', 'PublishedDate', 'SaleIds', 'StatusSync', 'FilterVipType', 'ExpireTime', 'CityMeeyId', 'DistrictMeeyId', 'ProjectMeeyId', 'PriorityDate', 'ViewType'];
        }
        this.actionApproveMulti = {
            icon: 'fas fa-check',
            name: 'Duyệt nhiều tin',
            className: 'btn btn-success',
            systemName: ActionType.ApproveArticle,
            click: () => {
              this.approveMulti();
            },
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    async ngOnInit() {
        // columns     
        let allowViewDetail = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.ViewDetail);
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            {
                Property: 'Code', Title: 'Mã tin', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '',
                        allowViewDetailItem = item[ActionType.ViewDetail],
                        quickView = allowViewDetail && allowViewDetailItem ? '<a routerLink="quickView" type="articleInfo">' + item.Code + '</a>' : item.Code;
                    if (item.Category.Name) text += '<p>' + item.Category.Name + '</p>';
                    if (item.Code) text += '<p title="' + item.Code + '">' + quickView;
                    if (item.Coordinates) text += ' - <a routerLink="quickView" type="articleMap" style="color: red; font-weight: bold;"><i class="la la-map-marker" style="font-weight: bold;"></i></a>';
                    text += '</p>';
                    text += '<p><a routerLink="quickView" type="service">Chi tiết dịch vụ</a></p>';
                    if (item.TypeArticle) {
                        text += '<p>Loại tin: ' + item.TypeArticle;
                    }
                    if (item.TypeOfHouse && item.TypeOfHouse.length > 0) {
                        text += '<p>Loại hình: ' + item.TypeOfHouse.join(', ');
                    }
                    let tenants : number [] = item.Tenants
                    if(tenants.includes(4)){
                        let refrences = item.References;
                        text += '<p>Nguồn Crawl: Facebook</P>';
                        var fburl = refrences.filter(x => x.Tenant == 4)[0].Url
                        text += '<p><a href='+fburl+'>' + fburl + '</a></p>';
                    }
                    return text;
                }
            },
            {
                Property: 'Media', Title: 'Ảnh', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    if (item.Media && item.Media.length > 0) {
                        let image = item.Media[0].Url;
                        text += '<a routerLink="quickView" type="images"><img style="width: 60px; margin-right: 10px;" src="' + image + '" /></a>';
                        if (item.Media.length >= 2) {
                            let videos = item.Media.filter(c => c.MimeType == "video") || [],
                                videoCount = videos.length,
                                imageCount = item.Media.length - videoCount;
                            text += '<p style="margin-top: 5px;">';
                            if ((imageCount > 1) || (imageCount && videoCount)) text += '<a routerLink="quickView" type="images">' + imageCount + ' ảnh</a> - ';
                            if (videoCount) text += '<a routerLink="quickView" type="videos">' + videoCount + ' video</a>';
                            text = UtilityExHelper.trimChars(text, [' ', '-']);
                            text += '</p>';
                        }

                    }
                    return text;
                }
            },
            {
                Property: 'Title', Title: 'Tiêu đề', Type: DataType.String,
                Format: (item: any) => {
                    return this.formatTitle(item);
                }
            },
            {
                Property: 'AccessType', Title: 'Trạng thái tin', Type: DataType.String,
                Format: (item: any) => {
                    item['AccessTypeCode'] = item.AccessType;
                    let syncElastic: string = item.SyncElastic ? 'Đã đồng bộ' : 'Chưa đồng bộ',
                        status = UtilityExHelper.formatArticleStatus(item.StatusType);
                    if (!status && item.AccessType == -4)
                        status = 'Tin bị hạ (KH hạ)';
                    else if (item.StatusType == MLArticleStatusType.Down)
                        status += item.IsDownByAdmin ? ' (Admin hạ)' : ' (KH hạ)';
                    let text = '<p><span>TT tin: </span><span>' + status + '</span></p>';
                    text += '<p><span>TT đồng bộ: </span><span>' + syncElastic + '</span></p>';
                    let similarity = item.Similarity?.Similarity || 0; if (similarity > 100) similarity = 100;
                    if (similarity) text += '<a class="label label-similarities" routerLink="quickView" type="similarity">Độ trùng tin: ' + similarity + '%</a>';

                    let refrences = item.References;
                    if (refrences && refrences.length > 0) {
                        text += '<p>Hiển thị: <a class="label label-refrences" routerLink="quickView" type="refrences">' + refrences.length + ' websites</a></p>';
                        text += '<ul>';
                        refrences.forEach((ref: any) => {
                            let domain: string = ref && ref.Domain && ref.Domain;
                            if (domain && domain.toLowerCase().indexOf('meey') >= 0) {
                                text += ref.Url
                                    ? '<li><a href="' + ref.Url + '" target="_blank">' + ref.Domain + '</a></li>'
                                    : '<li>' + ref.Domain + '</li>';
                            }
                        });
                        text += '</ul>';
                    }
                    return text;
                }
            },
            {
                Property: 'Sale', Title: 'Người hỗ trợ', Type: DataType.String,
                Format: ((item: any) => {
                    //return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale || item.SaleV2) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support || item.SupportV2) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Creator', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '',
                        random = UtilityExHelper.randomText(10),
                        poster = item.Poster && UtilityExHelper.renderUserInfoFormat(item.Poster.Name, item.Poster.Phone, item.Poster.Email, false),
                        contact = item.Contact && UtilityExHelper.renderUserInfoFormat(item.Contact.Name, item.Contact.Phone, item.Contact.Email, false),
                        creator = item.Creator && UtilityExHelper.renderUserInfoFormatWithCall(item.Creator.Name, item.Creator.Phone, item.Creator.Email, true, 'creator');
                    text += '<div class="accordion accordion-toggle-arrow" id="accordion_' + random + '">';
                    if (creator) {
                        text += '<div class="card"><div class="card-header"><div class="card-title" data-toggle="collapse" data-target="#collapse_creator_' + random + '">';
                        text += 'Thông tin khách hàng';
                        text += '</div></div>';
                        text += '<div id="collapse_creator_' + random + '" class="collapse show" data-parent="#accordion_' + random + '">';
                        text += '<div class="card-body">' + creator + '</div>';
                        text += '</div>';
                    }
                    if (contact) {
                        text += '<div class="card"><div class="card-header"><div class="card-title collapsed" data-toggle="collapse" data-target="#collapse_contact_' + random + '">';
                        text += 'Thông tin liên hệ';
                        text += '</div></div>';
                        text += '<div id="collapse_contact_' + random + '" class="collapse" data-parent="#accordion_' + random + '">';
                        text += '<div class="card-body">' + contact + '</div>';
                        text += '</div>';
                    }
                    if (poster) {
                        text += '<div class="card"><div class="card-header"><div class="card-title collapsed" data-toggle="collapse" data-target="#collapse_poster_' + random + '">';
                        text += 'Thông tin người đăng';
                        text += '</div></div>';
                        text += '<div id="collapse_poster_' + random + '" class="collapse" data-parent="#accordion_' + random + '">';
                        text += '<div class="card-body">' + poster + '</div>';
                        text += '</div>';
                    }
                    text += '</div>';
                    return text;
                })
            },
            {
                Property: 'CreatedDate', Title: 'Ngày đăng', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.CreatedDate) text += '<p class="d-flex justify-content-between"><span>Ngày tạo: </span><span>' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</span></p>';
                    if (item.PublishedDate) text += '<p class="d-flex justify-content-between"><span>Ngày đăng: </span><span>' + UtilityExHelper.dateTimeString(item.PublishedDate) + '</span></p>';
                    if (item.ExpriedDate) text += '<p class="d-flex justify-content-between"><span>Ngày hết hạn: </span><span>' + UtilityExHelper.dateTimeString(item.ExpriedDate) + '</span></p>';
                    if (item.AppointmentDate) text += '<p class="d-flex justify-content-between"><span>Ngày hẹn: </span><span>' + UtilityExHelper.dateTimeString(item.AppointmentDate) + '</span></p>';
                    return text;
                },
            }
        ];
        if (this.router.url.indexOf('crawl') >= 0){
            const prop = {
                Property: 'Path', Title: 'Nguồn crawl', Type: DataType.String,
                Format: (item: any) => {
                    let refrences = item.References;
                    let text: string = '<p><a href='+item.Path+'>' + item.Path + '</a></p>';
                    let tenants : number [] = item.Tenants
                    if(tenants.includes(4)){
                        var fburl = refrences.filter(x => x.Tenant == 4)[0].Url
                        text = '<p><a href='+fburl+'>' + fburl + '</a></p>';
                        text = '<p class="d-flex justify-content-between"><span>Facebook: </span></p>' + text;
                    } 
                    return text;
                }
            }
            this.properties.push(prop)
        }

        // fix filter
        if (!this.authen.account.IsAdmin) {
            if (!this.articleIds || this.articleIds.length == 0) {
                this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'CreatedTime')) || [];
                let date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate();
                this.itemData.Filters.push({
                    Name: 'CreatedTime',
                    Compare: CompareType.D_Between,
                    Value: new Date(year, month, day),
                    Value2: new Date(year, month, day, 23, 59, 59),
                });
            }
        }
        if (this.articleIds) {
            this.obj.Features = [];
            this.obj.IsPopup = true;
            this.obj.Checkable = false;
            this.obj.HidePaging = true;
            this.obj.HideSearch = true;
            this.obj.MoreFeatures = null;
            this.obj.EmbedComponent = null;
            this.obj.HideHeadActions = true;
            this.obj.HideCustomFilter = true;
            this.obj.Url = '/admin/mlArticle/signleItems/' + this.articleIds;
        }

        // render
        this.setPageSize(20);
        await this.render(this.obj);
        this.summaryText = 'Tổng số giây: ' + this.itemTotal;

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
                this.originalItems = [];
                if (!this.itemData.Filters)
                    this.itemData.Filters = [];
                this.itemData.Filters = this.itemData.Filters.filter(c => c.Name != 'Access');
                if (obj) {
                    if (obj.Filters && obj.Filters.length > 0) {
                        obj.Filters.forEach((item: FilterData) => {
                            this.itemData.Filters.push(item);
                        });
                    }
                }           
                //Kiểm tra nếu ở tab đang chờ duyệt thì thêm feature Duyệt nhiều tin
                if(this.itemData.Filters.filter(c => c.Name == 'Access').map(x => x.Value).includes(2)){
                    if(this.obj.Features.find(x => x.name == 'Duyệt nhiều tin') == null){
                        this.obj.Features.push(this.actionApproveMulti)
                    }                    
                }
                else{
                    this.obj.Features = this.obj.Features.filter(x => x.name != 'Duyệt nhiều tin')
                }

                await this.loadItems();
            });
        }
    }

    view(item: any) {
        if (item.ViewType == MLArticleViewType.NotYet) {
            let itemDb = this.items.find(c => c.Id == item.Id),
                originalItem = this.originalItems.find(c => c.Id == item.Id) as MLArticleEntity,
                filterViewType = this.itemData.Filters && this.itemData.Filters.find(c => c.Name == 'ViewType' && c.Value == MLArticleViewType.NotYet);
            if (itemDb && originalItem) {
                if (filterViewType) {
                    this.items = this.items.filter(c => c.Id != itemDb.Id);
                    if (this.items.length <= 1)
                        this.loadItems();
                } else {
                    this.apiService.updateViewed(item.Id).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            originalItem.ViewType = MLArticleViewType.Viewed;
                            if (itemDb)
                                itemDb['Title'] = this.formatTitle(originalItem);
                        }
                    });
                }
            }
        }
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/' + this.pathName,
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/' + this.pathName + '/view?id=' + item.Id;
        if (this.router.url.indexOf('crawl') >= 0) {
            obj.prevUrl = '/admin/' + this.pathName + 'crawl';
            url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/' + this.pathName + 'crawl/view?id=' + item.Id;
        }
        window.open(url, "_blank");
    }
    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/' + this.pathName,
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/' + this.pathName + '/edit?id=' + item.Id;
        if (this.router.url.indexOf('crawl') >= 0) {
            obj.prevUrl = '/admin/' + this.pathName + 'crawl';
            url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/' + this.pathName + 'crawl/edit?id=' + item.Id;
        }
        window.open(url, "_blank");
    }
    push(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn đẩy tin có mã: <b>' + item.Code + '</b> này không?', async () => {
            await this.apiService.push(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đẩy tin lên web thành công');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Đẩy tin');
    }
    repost(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn đăng lại tin có mã: <b>' + item.Code + '</b> này không?', async () => {
            await this.apiService.repost(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đăng lại tin thành công');
                    this.loadItems();
                } else {
                    setTimeout(() => {
                        let message = result.Description;
                        this.dialogService.Alert('Thông báo', message);
                    }, 300);
                }
            });
        }, null, 'Đăng lại tin');
    }
    delete(item: any) {
        this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn xóa tin có mã: <b>' + item.Code + '</b> này không?', async () => {
            await this.apiService.deleteArticle(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Xóa tin đăng thành công');
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        }, null, 'Xóa tin');
    }
    sync(items: any[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                title: 'Đồng bộ tin',
                confirmText: 'Xác nhận',
                size: ModalSizeType.Large,
                object: MLSyncArticleComponent,
                objectExtra: { items: cloneItems },
            }, async () => {
                this.loadItems();
                this.checkAll = false;
                this.selectedIds = null;
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để đồng bộ tin');
    }
    history(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            title: 'Lịch sử thao tác tin đăng',
            object: MLListArticleHistoryComponent,
        });
    }
    approve(item: any) {
        this.dialogService.WapperAsync({
            rejectText: 'Từ chối',
            confirmText: 'Đồng ý',
            title: 'Duyệt đăng tin',
            size: ModalSizeType.Medium,
            object: MLApproveArticleComponent,
            objectExtra: { item: _.cloneDeep(item) }
        }, async () => {
            this.loadItems();
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
                    this.loadItems();
                });
            }, 500);
        });
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
            }, async () => {
                this.loadItems();
                this.checkAll = false;
                this.selectedIds = null;
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để hạ tin');
    }
    transfer(items: any[]) {
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
            }, async () => {
                this.loadItems();
                this.checkAll = false;
                this.selectedIds = null;
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để điều chuyển');
    }
    warningPrices(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            objectExtra: { id: item.Id },
            title: 'Lịch sử cảnh báo giá',
            object: MLListArticleWarningPriceComponent,
        });
    }
    renderSubTable(item: any) {
        this.renderSubTableComponent(item, MLArticleReportLiteComponent, {
            id: item.Id
        });
    }
    approveContent(item: any) {
        this.dialogService.WapperAsync({
            rejectText: 'Từ chối',
            confirmText: 'Đồng ý',
            title: 'Duyệt nội dung tin',
            size: ModalSizeType.Medium,
            object: MLApproveContentComponent,
            objectExtra: { item: _.cloneDeep(item) }
        }, async () => {
            this.loadItems();
        }, async () => {
            setTimeout(() => {
                this.dialogService.WapperAsync({
                    cancelText: 'Hủy bỏ',
                    confirmText: 'Xác nhận',
                    size: ModalSizeType.Medium,
                    object: MLRejectContentComponent,
                    title: 'Từ chối duyệt nội dung tin',
                    objectExtra: { item: _.cloneDeep(item) }
                }, async () => {
                    this.loadItems();
                });
            }, 500);
        });
    }
    referenceWebsites(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            objectExtra: {
                item: {
                    id: item.Id,
                    code: item.Code,
                    price: item.Price,
                    title: item.Title,
                    image: item.Media && item.Media.length > 0
                        ? item.Media[0].Url
                        : null,
                    references: item.References,
                }
            },
            title: 'Link các website đăng tin',
            object: MLReferenceArticleComponent,
        });
    }
    eventCheckChange(count: number) {
        if (count) {
            let items = this.originalItems.filter(c => c.Checked);

            // transfer
            let hidden: boolean = false;
            items.forEach((item: MLArticleEntity) => {
                let hide = item.StatusType == MLArticleStatusType.Deleted;
                if (hide) {
                    hidden = true;
                    return;
                }
            });
            let button = this.obj.MoreFeatures.Actions.find(c => c.name == ActionType.TransferArticle);
            if (button) {
                button.hide = hidden;
            }

            // verify
            hidden = false;
            items.forEach((item: MLArticleEntity) => {
                let hide = !(!item.IsReal && item.StatusType != MLArticleStatusType.Deleted && item.StatusType != MLArticleStatusType.Down);
                if (hide) {
                    hidden = true;
                    return;
                }
            });

            // cancel
            hidden = false;
            items.forEach((item: MLArticleEntity) => {
                let hide = item.StatusType != MLArticleStatusType.Publish;
                if (hide) {
                    hidden = true;
                    return;
                }
            });
            button = this.obj.MoreFeatures.Actions.find(c => c.name == ActionType.CancelArticle);
            if (button) {
                button.hide = hidden;
            }

            // sync
            hidden = false;
            items.forEach((item: MLArticleEntity) => {
                let hide = item.SyncElastic;
                if (hide) {
                    hidden = true;
                    return;
                }
            });
            button = this.obj.MoreFeatures.Actions.find(c => c.systemName == ActionType.SyncArticle);
            if (button) {
                button.hide = hidden;
            }
        } else {
            let buttons = this.obj.MoreFeatures.Actions.filter(c => c.systemName != ActionType.AddNew);
            buttons.forEach((button: ActionData) => {
                button.hide = true;
            });
        }
    }
    addNewArticle(needType: MLArticleNeedType) {
        let type = needType == MLArticleNeedType.Buy ? 1 : 2;
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/' + this.pathName,
        };
        this.router.navigateByUrl('/admin/' + this.pathName + '/add?needType=' + type, { state: { params: JSON.stringify(obj) } });
    }

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'similarity': this.quickViewSimilarity(originalItem); break;
                case 'support': this.quickViewProfile(item['SupportId']); break;
                case 'refrences': this.referenceWebsites(originalItem); break;
                case 'service': this.quickViewServices(originalItem); break;
                case 'article': this.quickViewArticle(originalItem); break;
                case 'sale': this.quickViewProfile(item['SaleId']); break;
                case 'articleMap': this.quickViewMap(originalItem); break;
                case 'images': this.quickViewImages(originalItem); break;
                case 'videos': this.quickViewVideos(originalItem); break;
                case 'creator': this.quickViewUser(originalItem); break;
                case 'articleInfo': this.view(originalItem); break;
                case 'call': this.makeCall(originalItem); break;
                default: this.quickViewUser(originalItem); break;
            }
        }
    }
    async makeCall(item: any) {
        this.loading = true;
        let phone = item.Creator?.Phone,
            email = item.Creator?.Email;
        await this.crmService.findCustomer({
            Phone: phone, Email: email
        }).then(async (result: ResultApi) => {
            this.loading = false;
            if (ResultApi.IsSuccess(result)) {
                let customer = result.Object;
                let obj: MCRMCallLogDto = {
                    Phone: phone,
                    Opening: false,
                    Customer: customer,
                    TypeName: 'Cuộc gọi đi',
                    MCRMCustomerId: customer.Id,
                    Type: MCRMCallLogType.Outbound,
                    Message: 'Kết nối tới tổng đài...',
                    Extension: this.authen.account.ExtPhoneNumber
                };
                this.dataService.addCallItem(obj);
                await this.crmService.makeCall({
                    PrefixNumber: 1,
                    Phone: obj.Phone,
                    CustomerId: obj.MCRMCustomerId,
                }).then((result: ResultApi) => {
                    let message = result && result.Description;
                    if (ResultApi.IsSuccess(result)) {
                        obj.Message = 'Đang đổ chuông...';
                    } else {
                        obj.Message = message;
                        this.dataService.closeCallItem(obj);
                    }
                }, (e) => {
                    ToastrHelper.Exception(e);
                });
            } else ToastrHelper.ErrorResult(result);
        });
        this.loading = false;
    }
    private quickViewMap(item: any) {
        let location = '';
        if (item.Location) {
            if (item.Location.City) location += item.Location.City + ', ';
            if (item.Location.District) location += item.Location.District;
            location = UtilityExHelper.trimChars(location, [' ', ',']);
        }
        item.Location = location;
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { item: item },
            title: 'Xem vị trí tin đăng',
            size: ModalSizeType.ExtraLarge,
            confirmText: 'Xem trên Website',
            object: MLScheduleViewArticleMapComponent,
        });
    }
    private quickViewUser(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: {
                email: item.Creator.Email,
                phone: item.Creator.Phone,
            },
        });
    }
    private quickViewImages(item: any) {
        let images = item.Media && item.Media.filter(c => c.MimeType == "image").map(c => { return c.Url });
        if (images && images.length > 0) {
            this.dialogService.WapperAsync({
                title: 'Xem ảnh',
                cancelText: 'Đóng',
                size: ModalSizeType.ExtraLarge,
                object: PopupViewImageComponent,
                objectExtra: { images: images },
            });
        }
    }
    private quickViewVideos(item: any) {
        let videos = item.Media && item.Media.filter(c => c.MimeType == "video").map(c => { return c.Url });
        if (videos && videos.length > 0) {
            this.dialogService.WapperAsync({
                title: 'Xem video',
                cancelText: 'Đóng',
                size: ModalSizeType.ExtraLarge,
                object: PopupViewVideoComponent,
                objectExtra: { videos: videos },
            });
        }
    }
    private quickViewArticle(item: any) {
        if (item.AccessType == MLArticleAccessType.Publish && item.Approved) {
            if (item.Path) {
                let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
                window.open(url, "_blank");
            } else {
                this.dialogService.Alert('Thông báo', 'Đường dẫn của tin đăng không tồn tại');
            }
        } else {
            let status = UtilityExHelper.formatArticleStatus(item.StatusType);
            let message = 'Tin đăng đang ở trạng thái: <b>' + status + '</b>';
            this.dialogService.Alert('Thông báo', message);
        }
    }
    private quickViewSimilarity(item: any) {
        let originalItem: any = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            let articleIds = originalItem.Similarities?.map((c: any) => c.Id)?.join(',');
            if (articleIds) {
                let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/' + this.pathName + '/similarity?id=' + originalItem.MeeyId + '&code=' + originalItem.Code + '&articleIds=' + articleIds;
                window.open(url, "_blank");
            } else {
                let message = 'Hiện tại không có tin nào bị trùng, vui lòng thử lại sau';
                this.dialogService.Alert('Thông báo', message);
            }
        }
    }
    public quickViewProfile(id: number) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
    }
    private quickViewServices(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Chi tiết dịch vụ',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MLListArticleServiceComponent,
        });
    }
    private formatTitle(item: any, loading: boolean = false) {
        let text: string = '';
        if (item.Title) text += '<p><a routerLink="quickView" type="article" title="' + item.Title + '">' + item.Title + '</a></p>';
        if (item.Price || item.Area) {
            text += '<p>';
            if (item.Price) text += item.Price + ' | ';
            if (item.Area) {
                if(!(item.Category.Name == "Cho thuê" || item.Category.Name == "Cần thuê")){
                    text += item.Area;
                }
            }
            text = UtilityExHelper.trimChars(text, [' ', '|']);
            text += '</p>';
        }
        if (item.Location) {
            text += '<p>Địa chỉ: ';
            if (item.Location.City) text += item.Location.City + ', ';
            if (item.Location.District) text += item.Location.District;
            text = UtilityExHelper.trimChars(text, [' ', ',']);
        }
        if (item.Source) text += '<p class="label" style="margin-right: 10px; height: auto;">' + item.Source + '</p>';
        if (loading) {
            text += '<p class="kt-spinner kt-spinner--v2 kt-spinner--primary "></p>';
        } else {
            if (item.ViewType && item.ViewType != MLArticleViewType.NotYet) {
                let optionViewType: OptionItem = ConstantHelper.ML_ARTICLE_VIEW_TYPES.find(c => c.value == item.ViewType);
                if (optionViewType && optionViewType.label) text += '<p class="label" style="height: auto;">' + optionViewType.label + '</p>';
            }
        }
        return text;
    }
    syncArticle() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            object: MLArticleSyncComponent,
            title: 'Chọn thời gian đồng bộ',
        });
    }
    approveMulti(){
        var itemChecked = this.items.filter(x => x.Checked == true);
        let ids = itemChecked.map(x => x.Id)
        let count = 0;
        if(ids.length > 0){
            this.dialogService.ConfirmAsync("Bạn có muốn duyệt những tin đã chọn", async () => {
            await Promise.all(ids.map(async x => {
                var res = await this.apiService.approve(x)
                if(ResultApi.IsSuccess(res)) count ++;
            }))
            let message = 'Duyệt <b>' + count + '<b> tin thành công';
            ToastrHelper.Success(message);    
            this.loadItems();                                
            })            
        }
        else{
            ToastrHelper.Error('Chọn những bản ghi cần duyệt');
        }   
    }
}

@NgModule({
    declarations: [
        MLArticleComponent,
        MLMarkReportComponent,
        MLAddArticleComponent,
        MLArticleSyncComponent,
        MLListArticleComponent,
        MLSyncArticleComponent,
        MLViewArticleComponent,
        MLPopupPaymentComponent,
        MLCancelArticleComponent,
        MLRejectArticleComponent,
        MLRejectContentComponent,
        MLArticleButtonComponent,
        MLArticleReportComponent,
        MLApproveArticleComponent,
        MLApproveContentComponent,
        MLTransferArticleComponent,
        MLReferenceArticleComponent,
        MLPopupPushArticleComponent,
        MLListArticleErrorComponent,
        MLArticleReportLiteComponent,
        MLPopupResultArticleComponent,
        MLListArticleHistoryComponent,
        MLArticleStatisticalComponent,
        MLPopupReportArticleComponent,
        MLArticleReportButtonComponent,
        MLCancelArticleReportComponent,
        MLPopupScheduleArticleComponent,
        MLViewArticleSimilarityComponent,
        MLListArticleSimilarityComponent,
        MLListArticleWarningPriceComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MLArticleComponent, pathMatch: 'full', data: { state: 'ml_article' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: MLAddArticleComponent, pathMatch: 'full', data: { state: 'ml_article_add' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MLAddArticleComponent, pathMatch: 'full', data: { state: 'ml_article_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MLViewArticleComponent, pathMatch: 'full', data: { state: 'ml_article_view' }, canActivate: [AdminAuthGuard] },
            { path: 'report', component: MLArticleReportComponent, pathMatch: 'full', data: { state: 'ml_article_report' }, canActivate: [AdminAuthGuard] },
            { path: 'similarity', component: MLViewArticleSimilarityComponent, pathMatch: 'full', data: { state: 'ml_article_similarity' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLArticleService]
})
export class MLArticleModule { }