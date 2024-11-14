import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSMetaSeoEntity } from '../../../../_core/domains/entities/meeyseo/ms.meta.seo.entity';
import { MSMetaSeoType } from '../../../../_core/domains/entities/meeyseo/enums/ms.meta.seo.type';

@Component({
    templateUrl: './edit.meta.seo.component.html',
    styleUrls: [
        './edit.meta.seo.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditMetaSeoComponent extends EditComponent implements OnInit {
    id: string;
    subId: string;
    viewer: boolean;
    loading: boolean;
    typeName: string;
    prevData: string;
    prevContent: string;
    type: MSMetaSeoType;
    service: MSSeoService;
    dialog: AdminDialogService;
    templateDefault: OptionItem;
    isShowCategory: boolean = false;
    item: MSMetaSeoEntity = new MSMetaSeoEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        this.type = this.getParam('object')?.type;

        this.updateBreadcrumbs();
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    async loadItem() {
        if (this.id && this.type) {
            this.loading = true;
            await this.service.getMetaSeo(this.id, this.type).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let typeLabel = ConstantHelper.MS_META_SEO_TYPES.find(c => c.value == this.type);
                    this.item = EntityHelper.createEntity(MSMetaSeoEntity, result.Object);
                    if (this.item && this.item.Content) {
                        this.templateDefault = {
                            label: 'Mặc định',
                            value: this.item.Content,
                        };
                    }
                    this.item._Id = this.id;
                    this.item.Type = this.type;
                    this.typeName = typeLabel.label;
                    this.prevContent = this.item.Content;
                    this.item.Template = this.item.Content;
                    if (!(this.item.Type == MSMetaSeoType.Listing)) this.isShowCategory = true;
                    if (this.item._Id.length > 6) {
                        let start = this.item._Id.substring(0, 3);
                        let end = this.item._Id.slice(-3);
                        this.subId = start + "..." + end;
                    } else this.subId = this.item._Id;
                    this.prevData = JSON.stringify(this.item);
                } else {
                    this.dialog.Alert('Thông báo', 'Dữ liệu meta seo không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
                }
            });
            this.loading = false;
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.backNotSave() }),
        ];

        // Save && Publish
        actions.push({
            name: 'Lưu',
            icon: 'la la-plus',
            processButton: true,
            className: 'btn btn-success',
            systemName: ActionType.Edit,
            click: () => {
                this.confirm();
            }
        });
        this.actions = await this.authen.actionsAllow(MSMetaSeoEntity, actions);
    }

    async confirm() {
        this.processing = true;
        let valid = await validation(this.item, ['Name', 'MetaTitle', 'MetaKeyword', 'MetaDescription', 'CanonicalUrl', 'Content']);
        if (valid) {
            var arr = this.item.CanonicalUrl?.match(/[0-9]{13,}/);
            if (arr?.length > 0) {
                ToastrHelper.Error('Canonical không được chứa nhiều hơn 12 ký tự số liên tiếp.');
                this.processing = false;
                return false;
            }
            // call api
            let data = {
                "updater": {
                    "data": {
                        "_id": this.authen.account.Id,
                        "fullname": this.authen.account.FullName
                    },
                    "source": this.authen.account.UserName
                },
                "ipAddress": this.data.countryIp?.Ip ? this.data.countryIp.Ip : "",
            };
            if (this.item.Type == MSMetaSeoType.Category) {
                data['categoryId'] = this.item._Id;
                data['nameVN'] = this.item.Name ? this.item.Name : "";
                data['description'] = this.item.Content ? this.item.Content : "";
                data['metaTitle'] = this.item.MetaTitle ? this.item.MetaTitle : "";
                data['metaKeywords'] = this.item.MetaKeyword ? this.item.MetaKeyword : "";
                data['canonicalUrl'] = this.item.CanonicalUrl ? this.item.CanonicalUrl : "";
                data['metaDescription'] = this.item.MetaDescription ? this.item.MetaDescription : "";
            } else if (this.item.Type == MSMetaSeoType.Listing) {
                data['seoId'] = this.item._Id;
                data['name'] = this.item.Name ? this.item.Name : "";
                data['description'] = this.item.Content ? this.item.Content : "";
                data['metaTitle'] = this.item.MetaTitle ? this.item.MetaTitle : "";
                data['metaKeyword'] = this.item.MetaKeyword ? this.item.MetaKeyword : "";
                data['canonicalUrl'] = this.item.CanonicalUrl ? this.item.CanonicalUrl : "";
                data['metaDescription'] = this.item.MetaDescription ? this.item.MetaDescription : "";
            } else {
                data['type'] = this.item.Type;
                data['name'] = this.item.Name ? this.item.Name : null;
                data['description'] = this.item.Content ? this.item.Content : null;
                data['metaTitle'] = this.item.MetaTitle ? this.item.MetaTitle : null;
                data['metaKeyword'] = this.item.MetaKeyword ? this.item.MetaKeyword : null;
                data['canonicalUrl'] = this.item.CanonicalUrl ? this.item.CanonicalUrl : null;
                data['metaDescription'] = this.item.MetaDescription ? this.item.MetaDescription : null;
            }
            return await this.service.callApi('MSMetaSeo', 'Update/' + this.item._Id + '?type=' + this.item.Type, data, MethodType.Put).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật thành công');
                    this.processing = false;
                    this.back();
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                this.processing = false;
                return false;
            }, (e: any) => {
                ToastrHelper.Exception(e);
                this.processing = false;
                return false;
            });
        };
        this.processing = false;
        return false;
    }

    backNotSave() {
        let jsonData = JSON.stringify(this.item);
        if (this.prevData == jsonData) {
            this.back();
            return;
        }
        this.dialogService.Confirm('Các thông tin đã nhập sẽ không được giữ lại. Bạn có chắc chắn muốn quay lại không?', () => {
            if (this.state)
                this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
            else
                window.history.back();
        }, null, 'Xác nhận thay đổi')
    }

    templateChange() {
        if (!this.item.Content) {
            this.prevContent = this.item.Template;
            this.item.Content = this.item.Template;
        } else {
            if (this.prevContent !== this.item.Content) {
                this.dialogService.Confirm('Các thông tin đã nhập sẽ không được giữ lại. Bạn có chắc chắn muốn thay đổi nội dung không?', () => {
                    this.prevContent = this.item.Template;
                    this.item.Content = this.item.Template;
                }, () => {
                    this.item.Template = null;
                }, 'Xác nhận thay đổi');
                return;
            } else {
                this.prevContent = this.item.Template;
                this.item.Content = this.item.Template;
            }
        }
    }

    private updateBreadcrumbs() {
        this.breadcrumbs = [];
        this.breadcrumbs.push({ Name: 'Meey Land' });
        this.breadcrumbs.push({ Name: 'Quản lý Meta SEO', Link: '/admin/msseo/metaseo' });
        this.viewer ? this.breadcrumbs.push({ Name: 'Xem Meta SEO' }) : this.breadcrumbs.push({ Name: 'Sửa Meta SEO' });
    }
}