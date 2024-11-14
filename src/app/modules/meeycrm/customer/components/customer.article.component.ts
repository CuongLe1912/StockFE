import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MLArticleEntity } from '../../../../_core/domains/entities/meeyland/ml.article.entity';
import { ModalViewProfileComponent } from '../../../../_core/modal/view.profile/view.profile.component';
import { MLPopupViewUserComponent } from '../../../../modules/meeyuser/popup.view.user/popup.view.user.component';
import { MLListArticleServiceComponent } from '../../../../modules/meeyarticle/components/list.article.service.component';
import { MLArticleAccessType, MLArticleViewType } from '../../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { PopupViewImageComponent } from '../../../../_core/editor/upload.image/popup.view.image/popup.view.image.component';
import { PopupViewVideoComponent } from '../../../../_core/editor/upload.video/popup.view.video/popup.view.video.component';
import { MLScheduleViewArticleMapComponent } from '../../../../modules/meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component';

@Component({
    selector: 'mcrm-customer-article',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerArticleComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HideSearch: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
    };
    @Input() id: number;

    constructor() {
        super();
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MLArticle/ItemsByCustomer/' + this.id;
        }

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
                    return text;
                }
            },
            {
                Property: 'Media', Title: 'Ảnh', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    if (item.Media && item.Media.length > 0) {
                        let image = item.Media[0].Url,
                            statusIcon = item.IsReal ? '<i class="fa fa-check article-icon"></i>' : '<i class="fa fa-info article-icon"></i>';
                        text += '<a routerLink="quickView" type="images"><img style="width: 60px; margin-right: 10px;" src="' + image + '" />' + statusIcon + '</a>';
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
                    if (item.ViewType && item.ViewType != MLArticleViewType.NotYet) {
                        let optionViewType: OptionItem = ConstantHelper.ML_ARTICLE_VIEW_TYPES.find(c => c.value == item.ViewType);
                        if (optionViewType && optionViewType.label) text += '<p class="label" style="height: auto;">' + optionViewType.label + '</p>';
                    }
                    return text;
                }
            },
            {
                Property: 'AccessType', Title: 'Trạng thái tin', Type: DataType.String,
                Format: (item: any) => {
                    item['AccessTypeCode'] = item.AccessType;
                    let syncElastic: string = item.SyncElastic ? 'Đã đồng bộ' : 'Chưa đồng bộ',
                        status = UtilityExHelper.formatArticleStatus(item.StatusType);
                    let text = '<p><span>TT tin: </span><span>' + status + '</span></p>';
                    text += '<p><span>TT đồng bộ: </span><span>' + syncElastic + '</span></p>';
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
                        creator = item.Creator && UtilityExHelper.renderUserInfoFormat(item.Creator.Name, item.Creator.Phone, item.Creator.Email, true, 'creator');
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
        this.render(this.obj);
    }

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
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
            objectExtra: { email: item.Creator.Email },
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
}