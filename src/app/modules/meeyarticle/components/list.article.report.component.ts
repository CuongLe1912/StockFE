import * as _ from 'lodash';
import { Router } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { MLArticleService } from "../article.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { MeeyCrmService } from "../../meeycrm/meeycrm.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { TableData } from "../../../_core/domains/data/table.data";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { FilterData } from "../../../_core/domains/data/filter.data";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { MLMarkReportComponent } from '../mark.report/mark.report.component';
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLListArticleServiceComponent } from "./list.article.service.component";
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { MCRMCallLogDto } from "../../../_core/domains/entities/meeycrm/mcrm.calllog.entity";
import { MCRMCallLogType } from "../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type";
import { MLPopupViewUserComponent } from "../../meeyuser/popup.view.user/popup.view.user.component";
import { ModalViewProfileComponent } from "../../../_core/modal/view.profile/view.profile.component";
import { MLPopupReportArticleComponent } from '../popup.report.article/popup.report.article.component';
import { MLCancelArticleReportComponent } from '../cancel.report.article/cancel.report.article.component';
import { MLArticleReportButtonComponent } from "../article.report.button/article.report.button.component";
import { MLArticleEntity, MLArticleReportEntity } from "../../../_core/domains/entities/meeyland/ml.article.entity";
import { PopupViewImageComponent } from "../../../_core/editor/upload.image/popup.view.image/popup.view.image.component";
import { PopupViewVideoComponent } from "../../../_core/editor/upload.video/popup.view.video/popup.view.video.component";
import { MLScheduleViewArticleMapComponent } from "../../meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component";
import { MLArticleAccessType, MLArticleReportStatusType, MLArticleStatusType, MLArticleType, MLArticleViewType } from "../../../_core/domains/entities/meeyland/enums/ml.article.type";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLArticleReportComponent extends GridComponent implements OnInit, OnDestroy {
    crmService: MeeyCrmService;
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
                icon: 'la la-download',
                className: 'btn btn-primary',
                name: ActionType.CancelArticle,
                systemName: ActionType.CancelArticle,
                controllerName: ControllerType.MLArticle,
                hidden: (item: any) => {
                    return !(!item.Crawl && item.StatusType == MLArticleStatusType.Publish && item[ActionType.CancelArticle]);
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.cancel(items);
                }
            },
            {
                icon: 'la la-download',
                className: 'btn btn-primary',
                name: ActionType.CancelArticle,
                systemName: ActionType.CancelArticle,
                controllerName: ControllerType.MLArticleCrawl,
                hidden: (item: any) => {
                    return !(item.Crawl && item.StatusType == MLArticleStatusType.Publish && item[ActionType.CancelArticle]);
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.cancel(items);
                }
            },
            {
                name: 'Đã xử lý',
                icon: 'la la-check',
                className: 'btn btn-success',
                systemName: ActionType.Verify,
                hidden: (item: any) => {
                    return item.ReportStatus == MLArticleReportStatusType.Processed || !item[ActionType.Verify];
                },
                click: (item: MLArticleEntity) => {
                    let items = this.originalItems.filter(c => c.Id == item.Id);
                    this.mark(items);
                }
            }
            // {
            //     name: 'Đồng bộ',
            //     icon: 'la la-check',
            //     className: 'btn btn-success',
            //     systemName: ActionType.Verify,
            //     click: (item: MLArticleEntity) => {
            //         let items = this.originalItems.filter(c => c.Id == item.Id);
            //         this.mark(items);
            //     }
            // }
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        TimerReload: {
            Timer: 600,
            AutoReload: true,
            AllowReload: true,
        },
        Checkable: false,
        UpdatedBy: false,
        DisableAutoLoad: true,
        PageSizes: [20, 50, 100],
        SearchText: 'Nhập mã tin',
        Reference: MLArticleReportEntity,
        Title: 'Danh sách báo cáo tin đăng',
        EmbedComponent: MLArticleReportButtonComponent,
        CustomFilters: ['Code', 'Title', 'SupportIds', 'ReportDate']
    };

    constructor(
        public router: Router,
        public apiService: MLArticleService) {
        super();
        this.crmService = AppInjector.get(MeeyCrmService);
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    async ngOnInit() {
        // columns
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            {
                Property: 'Code', Title: 'Mã tin', Type: DataType.String, DisableOrder: true,
                FormatAsync: async (item: any) => {
                    let text: string = '',
                        allowViewDetailItem = item[ActionType.ViewDetail],
                        allowViewDetail = item.Crawl
                            ? await this.authen.permissionAllow(ControllerType.MLArticleCrawl, ActionType.ViewDetail)
                            : await this.authen.permissionAllow(ControllerType.MLArticle, ActionType.ViewDetail),
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
                Property: 'Media', Title: 'Ảnh', Type: DataType.String, Align: 'center', DisableOrder: true,
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
                Property: 'Title', Title: 'Tiêu đề', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    return this.formatTitle(item);
                }
            },
            {
                Property: 'Sale', Title: 'Người hỗ trợ', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale || item.SaleV2) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support || item.SupportV2) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'AccessType', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    item['AccessTypeCode'] = item.AccessType;
                    item['ReportStatus'] = item.Report?.Status;
                    let status = UtilityExHelper.formatArticleStatus(item.StatusType);
                    if (item.StatusType == MLArticleStatusType.Down)
                        status += item.IsDownByAdmin ? ' (Admin hạ)' : ' (KH hạ)';
                    let text = '<p><span>TT tin: </span><span>' + status + '</span></p>';

                    let reportStatus = item.Report?.Status;
                    switch (reportStatus) {
                        case 0: {
                            if (item.StatusType == MLArticleStatusType.Down)
                                text += '<p><span>TT báo cáo: </span><span>Đã hạ tin</span></p>';
                            else
                                text += '<p><span>TT báo cáo: </span><span>Chưa xử lý</span></p>';
                        } break;
                        case 1: {
                            text += '<p><span>TT báo cáo: </span><span>Đã xử lý</span></p>';
                            if (item.Report?.Description)
                                text += '<p><span>Lý do: </span><span>' + item.Report?.Description + '</span></p>';
                            if (item.Report?.Actor)
                                text += '<p><span>NV xử lý: </span><span>' + item.Report?.Actor + '</span></p>';
                        } break;
                    }
                    return text;
                }
            },
            {
                Property: 'Reason', Title: 'Ngày/Nội dung', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item.Report?.CreatedDate)
                        text += '<p>Ngày báo cáo: ' + UtilityExHelper.dateTimeString(item.Report.CreatedDate) + '</p>';
                    if (item.Report?.Reason)
                        text += '<p>Nội dung: ' + item.Report?.Reason + '</p>';
                    return text;
                }
            },
            {
                Property: 'Creator', Title: 'Người báo cáo', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = item.Report && UtilityExHelper.renderUserInfoFormatWithCall(item.Report.Name, item.Report.Phone, item.Report.Email, true, 'creator');
                    return text;
                })
            },
        ];

        // render
        this.setPageSize(50);
        await this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
                this.originalItems = [];
                if (!this.itemData.Filters)
                    this.itemData.Filters = [];
                this.itemData.Filters = this.itemData.Filters.filter(c => c.Name != 'Status');
                if (obj) {
                    if (obj.Filters && obj.Filters.length > 0) {
                        obj.Filters.forEach((item: FilterData) => {
                            this.itemData.Filters.push(item);
                        });
                    }
                }
                await this.loadItems();
            });
        }
    }

    async view(item: any) {
        let allowViewDetail = item.Crawl
            ? await this.authen.permissionAllow(ControllerType.MLArticleCrawl, ActionType.ViewDetail)
            : await this.authen.permissionAllow(ControllerType.MLArticle, ActionType.ViewDetail);
        if (allowViewDetail && item[ActionType.ViewDetail]) {
            let reportId = item.Report?.Id;
            let obj: NavigationStateData = {
                prevData: this.itemData,
                prevUrl: '/admin/mlarticle/report',
            };
            this.router.navigateByUrl('/admin/mlarticle/view?reportId=' + reportId, { state: { params: JSON.stringify(obj) } });
        } else {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                title: 'Nội dung báo cáo',
                size: ModalSizeType.Large,
                object: MLPopupReportArticleComponent,
                objectExtra: {
                    item: item.Report
                },
            });
        }
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
                    items: [firstItem],
                    reportId: (<any>firstItem).Report?.Id,
                },
            }, async () => {
                this.loadItems();
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để xử lý');
    }
    cancel(items: any[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            let firstItem = <MLArticleEntity>cloneItems[0];
            this.dialogService.WapperAsync({
                title: 'Hạ tin đăng',
                cancelText: 'Hủy bỏ',
                confirmText: 'Xác nhận',
                size: ModalSizeType.Large,
                object: MLCancelArticleReportComponent,
                objectExtra: {
                    items: [firstItem],
                    allowSendEmail: firstItem.Type == MLArticleType.Self,
                    reportId: (<any>firstItem).ReportStatus != 1 ? (<any>firstItem).Report?.Id : null,
                },
            }, async () => {
                this.loadItems();
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để hạ tin');
    }
    viewArticle(item: any) {
        debugger
        let url = item.Crawl
            ? AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticlecrawl/view?id=' + item.Id
            : AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticle/view?id=' + item.Id;
        window.open(url, "_blank");
    }

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'support': this.quickViewProfile(item['SupportId']); break;
                case 'service': this.quickViewServices(originalItem); break;
                case 'article': this.quickViewArticle(originalItem); break;
                case 'sale': this.quickViewProfile(item['SaleId']); break;
                case 'articleInfo': this.viewArticle(originalItem); break;
                case 'articleMap': this.quickViewMap(originalItem); break;
                case 'images': this.quickViewImages(originalItem); break;
                case 'videos': this.quickViewVideos(originalItem); break;
                case 'creator': this.quickViewUser(originalItem); break;
                case 'call': this.makeCall(originalItem); break;
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
                email: item.Report.Email,
                phone: item.Report.Phone,
            },
        });
    }
    private async makeCall(item: any) {
        this.loading = true;
        let phone = item.Report?.Phone,
            email = item.Report?.Email;
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