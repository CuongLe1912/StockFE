import * as _ from 'lodash';
import { Router } from "@angular/router";
import { MLArticleService } from "../article.service";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLListArticleHistoryComponent } from './list.article.history.component';
import { MLListArticleServiceComponent } from "./list.article.service.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { MLCancelArticleComponent } from "../cancel.article/cancel.article.component";
import { MLArticleEntity } from "../../../_core/domains/entities/meeyland/ml.article.entity";
import { MLPopupViewUserComponent } from "../../meeyuser/popup.view.user/popup.view.user.component";
import { ModalViewProfileComponent } from "../../../_core/modal/view.profile/view.profile.component";
import { PopupViewImageComponent } from "../../../_core/editor/upload.image/popup.view.image/popup.view.image.component";
import { PopupViewVideoComponent } from "../../../_core/editor/upload.video/popup.view.video/popup.view.video.component";
import { MLScheduleViewArticleMapComponent } from "../../meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component";
import { MLArticleAccessType, MLArticleStatusType, MLArticleType, MLArticleViewType } from "../../../_core/domains/entities/meeyland/enums/ml.article.type";

@Component({
    selector: 'ml-list-article-similarity',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleSimilarityComponent extends GridComponent implements OnInit, OnDestroy {
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
                controllerName: ControllerType.MLArticle,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.view(originalItem);
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                controllerName: ControllerType.MLArticle,
                hidden: (item: any) => {
                    return item.StatusType == MLArticleStatusType.Deleted || !item[ActionType.Edit];
                },
                click: (item: MLArticleEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.edit(originalItem);
                }
            },
            {
                icon: 'la la-download',
                className: 'btn btn-danger',
                name: ActionType.CancelArticle,
                systemName: ActionType.CancelArticle,
                controllerName: ControllerType.MLArticle,
                hidden: (item: any) => {
                    return item.StatusType != MLArticleStatusType.Publish || !item[ActionType.CancelArticle];
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.cancel(items);
                }
            }
        ],
        Features: [
            {
                hide: true,
                toggleCheckbox: true,
                icon: 'la la-download',
                className: 'btn btn-danger',
                name: ActionType.CancelArticle,
                systemName: ActionType.CancelArticle,
                controllerName: ControllerType.MLArticle,
                click: () => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.cancel(items);
                }
            }
        ],
        MoreActions: [
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
        TimerReload: {
            Timer: 600,
            AutoReload: false,
            AllowReload: true,
        },
        IsPopup: true,
        Checkable: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
        PageSizes: [5, 10, 20, 50],
        TotalTitle: 'Tổng lượt cảnh báo giá',
        Title: 'Danh sách tin đăng tự xuất bản',
    };
    @Input() articleIds: string;
    @Input() originalId: string;
    allowViewDetail: boolean = true;

    constructor(
        public router: Router,
        public apiService: MLArticleService) {
        super();
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    async ngOnInit() {
        this.obj.Url = '/admin/mlArticle/similarityItems/' + this.articleIds + '?originalId=' + this.originalId;

        // columns
        let allowViewDetail = await this.authen.permissionAllow(ControllerType.MLArticle, ActionType.ViewDetail);
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                },
                HideCheckbox: (item: any) => {
                    return item.StatusType != MLArticleStatusType.Publish || !item[ActionType.CancelArticle];
                },
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

        // render
        this.setPageSize(20);
        await this.render(this.obj);
        this.summaryText = 'Tổng số giây: ' + this.itemTotal;
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
            prevUrl: '/admin/mlarticle',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticle/view?id=' + item.Id;
        if (this.router.url.indexOf('crawl') >= 0) {
            obj.prevUrl = '/admin/mlarticlecrawl';
            url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticlecrawl/view?id=' + item.Id;
        }
        window.open(url, "_blank");
    }
    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/mlarticle',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticle/edit?id=' + item.Id;
        if (this.router.url.indexOf('crawl') >= 0) {
            obj.prevUrl = '/admin/mlarticlecrawl';
            url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticlecrawl/edit?id=' + item.Id;
        }
        window.open(url, "_blank");
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

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'similarity': this.quickViewSimilarity(originalItem); break;
                case 'support': this.quickViewProfile(item['SupportId']); break;
                case 'service': this.quickViewServices(originalItem); break;
                case 'article': this.quickViewArticle(originalItem); break;
                case 'sale': this.quickViewProfile(item['SaleId']); break;
                case 'articleMap': this.quickViewMap(originalItem); break;
                case 'images': this.quickViewImages(originalItem); break;
                case 'videos': this.quickViewVideos(originalItem); break;
                case 'creator': this.quickViewUser(originalItem); break;
                case 'articleInfo': this.view(originalItem); break;
                default: this.quickViewUser(originalItem); break;
            }
        }
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
    private quickViewSimilarity(item: any) {
        let originalItem: any = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            let articleIds = originalItem.Similarities?.map((c: any) => c.Id)?.join(',');
            if (articleIds) {
                let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticle/similarity?id=' + originalItem.MeeyId + '&code=' + originalItem.Code + '&articleIds=' + articleIds;
                window.open(url, "_blank");
            } else {
                let message = 'Hiện tại không có tin nào bị trùng, vui lòng thử lại sau';
                this.dialogService.Alert('Thông báo', message);
            }
        }
    }
    private formatTitle(item: any, loading: boolean = false) {
        let text: string = '';
        if (item.Title) text += '<p><a routerLink="quickView" type="article" title="' + item.Title + '">' + item.Title + '</a></p>';
        if (item.Price || item.Area) {
            text += '<p>';
            if (item.Price) text += item.Price + ' | ';
            if (item.Area) text += item.Area;
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
}