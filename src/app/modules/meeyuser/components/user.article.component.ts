import * as _ from 'lodash';
import { MLUserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MLPopupViewUserComponent } from '../popup.view.user/popup.view.user.component';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleAccessType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLScheduleViewArticleComponent } from '../../meeyland/schedule/schedule.view.article/schedule.view.article.component';
import { MLScheduleViewArticleMapComponent } from '../../meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component';

@Component({
    selector: 'ml-user-article',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserArticleComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
        Title: 'Danh sách tin đăng',
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
        AsynLoad: () => this.asynLoad(),
    };
    @Input() item: MLArticleEntity;

    constructor(public apiService: MLUserService) {
        super();
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
                    item['CodeCode'] = item['Code'];
                    let text: string = '';
                    if (item.Category.Name) text += '<p>' + item.Category.Name + '</p>';
                    text += '<p><a routerLink="quickView" type="articleInfo">' + item.Code + '</a>';
                    if (item.Coordinates) text += ' - <a routerLink="quickView" type="articleMap" style="color: red; font-weight: bold;"><i class="la la-map-marker"></i></a>';
                    text += '</p>';
                    text += '<p><a routerLink="quickView" type="service">Chi tiết dịch vụ</a></p>';
                    return text;
                }
            },
            {
                Property: 'Media', Title: 'Ảnh', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    if (item.Media && item.Media.length > 0) {
                        let image = item.Media[0].Url;
                        text += '<p><img style="max-height: 50px" src="' + image + '" /></p>';
                        if (item.Media.length >= 2) {
                            let videos = item.Media.filter(c => c.MimeType == "video") || [],
                                videoCount = videos.length,
                                imageCount = item.Media.length - videoCount;
                            text += '<p style="margin-top: 5px;">';
                            if (imageCount) text += '<a routerLink="quickView" type="image">' + imageCount + ' ảnh</a> - ';
                            if (videoCount) text += '<a routerLink="quickView" type="video">' + videoCount + ' video</a>';
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
                    item['TitleCode'] = item['Title'];
                    let text: string = '';
                    if (item.Title) text += '<p><a routerLink="quickView" type="article">' + item.Title + '</a></p>';
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
                    return text;
                }
            },
            {
                Property: 'AccessType', Title: 'Trạng thái tin', Type: DataType.String,
                Format: (item: any) => {
                    item['AccessTypeCode'] = item['AccessType'];
                    let option: OptionItem = ConstantHelper.ML_ARTICLE_ACCESS_TYPES.find(c => c.value == item.AccessType);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'Approved', Title: 'Trạng thái duyệt', Type: DataType.String,
                Format: (item: any) => {
                    item['ApprovedCode'] = item['Approved'];
                    let text = '<p>' + item.Approved ? 'Đã duyệt' : (item.Approved == null ? 'Chờ duyệt' : 'Không duyệt') + '</p>';
                    return text;
                }
            },
            {
                Property: 'Sale', Title: 'Người duyệt', Type: DataType.String,
                Format: ((item: any) => {
                    return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
                })
            },
            {
                Property: 'Creator', Title: 'Tên khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Creator)
                        return UtilityExHelper.renderUserInfoFormat(item.Creator.Name, item.Creator.Phone, item.Creator.Email, true, 'creator');
                    return '';
                })
            },
            {
                Property: 'Contact', Title: 'Thông tin liên hệ', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Contact)
                        return UtilityExHelper.renderUserInfoFormat(item.Contact.Name, item.Contact.Phone, item.Contact.Email, false);
                    return '';
                })
            },
            {
                Property: 'CreatedDate', Title: 'Ngày đăng', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.CreatedDate) text += '<p>Ngày tạo: ' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</p>';
                    if (item.PublishedDate) text += '<p>Ngày đăng: ' + UtilityExHelper.dateTimeString(item.PublishedDate) + '</p>';
                    if (item.ExpriedDate) text += '<p>Ngày hết hạn: ' + UtilityExHelper.dateTimeString(item.ExpriedDate) + '</p>';
                    return text;
                },
            },
            {
                Property: 'Address', Title: 'Địa chỉ', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    text += 'Địa chỉ: ';
                    if (item.Location) {
                        if (item.Location.District) text += item.Location.District + ', ';
                        if (item.Location.City) text += item.Location.City + ', ';
                        text = UtilityExHelper.trimChars(text, [' ', ',']);
                    }
                    if (item.Address) text += '<br />' + item.Address;
                    return text;
                }
            },
        ];
    }

    async ngOnInit() {
        this.setPageSize(20);
        this.obj.Url = '/admin/MLArticle/Items/' + this.item.Id;
        this.render(this.obj);
    }

    asynLoad() {
        // load sale
        let ids = this.items && this.items.map(c => c.Id);
        if (ids && ids.length > 0) {
            this.apiService.getAllSaleArticleItems(ids).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let items: MLArticleEntity[] = result.Object;
                    this.items.forEach((item: any) => {
                        let itemDb = items.find(c => c.Id == item.Id);
                        if (itemDb) {
                            let text: string = '';
                            item['SaleV2Name'] = itemDb['SaleV2'];
                            item['SupportV2Name'] = itemDb['SupportV2'];
                            item['ApproveV2Name'] = itemDb['ApproveV2'];
                            text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(itemDb.Sale || item.SaleV2) + '</a></p>';
                            text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(itemDb.Support || itemDb.SupportV2) + '</a></p>';
                            item['Sale'] = text;
                        } else item['Sale'] = '';
                    });
                }
            });
        }
    }
    quickView(item: any, type: string) {
        switch (type) {
            //case 'creator': this.quickViewUser(item); break;
            case 'articleMap': this.quickViewMap(item); break;
            case 'article': this.quickViewArticle(item); break;
            //case 'articleInfo': this.quickViewInfo(item); break;
            default: this.dialogService.Message('Tính năng này đang phát triển'); break;
        }
    }
    private quickViewMap(item: any) {
        let obj = _.cloneDeep(item);
        obj['Code'] = obj['CodeCode'];
        obj['Title'] = obj['TitleCode'];
        obj['AccessType'] = obj['AccessTypeCode'];
        if (obj.Location) {
            let text: string = '';
            if (obj.Location.Ward) text += obj.Location.Ward + ', ';
            if (obj.Location.District) text += obj.Location.District + ', ';
            if (obj.Location.City) text += obj.Location.City + ', ';
            text = UtilityExHelper.trimChars(text, [' ', ',']);
            obj.Location = text;
        }
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { item: obj },
            title: 'Xem vị trí tin đăng',
            size: ModalSizeType.ExtraLarge,
            object: MLScheduleViewArticleMapComponent,
            confirmText: item.Path ? 'Xem trên Website' : null,
        });
    }
    private quickViewUser(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: { meeyId: item.Creator.MeeyId }
        });
    }
    private quickViewInfo(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            title: 'Xem thông tin tin đăng',
            confirmText: 'Xem trên Website',
            object: MLScheduleViewArticleComponent,
        });
    }
    private quickViewArticle(item: any) {
        let obj = _.cloneDeep(item);
        obj['AccessType'] = obj['AccessTypeCode'];
        if (obj.AccessType == MLArticleAccessType.Publish) {
            if (item.Path) {
                let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
                window.open(url, "_blank");
            }
        } else {
            let statusText = '';
            switch (item.AccessTypeCode) {
                case MLArticleAccessType.Deleted: statusText = 'đã bị xóa'; break;
                case MLArticleAccessType.UnPublish: statusText = 'đã hết hạn'; break;
                case MLArticleAccessType.Draft: statusText = 'đang chờ duyệt'; break;
                case MLArticleAccessType.WaitPayment: statusText = 'đang chờ thanh toán'; break;
                case MLArticleAccessType.WaitPublish: statusText = 'đang chờ đăng hoặc chờ duyệt'; break;
            }
            let message = 'Tin đăng ' + statusText + '. ' + 'Vui lòng kiểm tra lại!';
            this.dialogService.Alert('Thông báo', message);
        }
    }
}