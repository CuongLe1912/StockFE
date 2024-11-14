import * as _ from 'lodash';
import { MSSeoService } from '../../seo.service';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSTextLinkEntity } from '../../../../_core/domains/entities/meeyseo/ms.featured.real.estate.entity';

@Component({
    templateUrl: './add.text.link.component.html',
    styleUrls: [
        './add.text.link.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class AddTextLinkComponent extends EditComponent implements OnInit {
    id: string;
    domain: string;
    propertyId: string;
    service: MSSeoService;
    loading: boolean = false;
    isUpadte: boolean = false;
    dialog: AdminDialogService;
    overviewProperty: string = '';
    overviewStructure: string = '';
    eventService: AdminEventService;
    item: MSTextLinkEntity = new MSTextLinkEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.eventService = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        this.domain = AppConfig.MeeyLandConfig.Url + "/";
        await this.loadItem();
    }

    private async loadItem() {
        this.loading = true;
        this.id = this.params && this.params['id'];
        this.propertyId = this.params && this.params['propertyId'];
        if (this.propertyId) {
            await this.service.item('mshighlight/getproperty', this.propertyId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object.data.name) this.overviewProperty = result.Object.data.name;
                    if (result.Object.data.structure.name) this.overviewStructure = result.Object.data.structure.name;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else if (!this.propertyId && !this.id) {
            ToastrHelper.Error('Lỗi ID thuộc tính không hợp lệ');
            return;
        }

        if (this.id) {
            this.isUpadte = true;
            await this.service.item('mshighlight/gettextlink', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MSTextLinkEntity);
                    if (result.Object.data._id) this.item.Id = result.Object.data._id;
                    if (result.Object.data.url) this.item.Url = result.Object.data.url;
                    if (result.Object.data.text) this.item.Text = result.Object.data.text;
                    if (result.Object.data.linkId) this.item.LinkId = result.Object.data.linkId;
                    if (result.Object.data.priority) this.item.Priority = result.Object.data.priority;
                    if (result.Object.data.property._id) this.propertyId = result.Object.data.property._id;
                    if (result.Object.data.createdAt) this.item.CreatedDate = result.Object.data.createdAt;
                    if (result.Object.data.updatedDate) this.item.UpdatedDate = result.Object.data.updatedDate;
                    if (result.Object.data.property.name) this.overviewProperty = result.Object.data.property.name;
                    if (result.Object.data.status) this.item.Status = result.Object.data.status == 1 ? true : false;
                    if (result.Object.data.property.structure.name) this.overviewStructure = result.Object.data.property.structure.name;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return;
                }
            });
        }
        this.loading = false;
    }

    async confirm() {
        let valid = await validation(this.item);
        if (valid) {
            if (this.item.Url.indexOf('http') >= 0) {
                ToastrHelper.Error('URL không đúng định dạng!');
                return false;
            }
            let type = this.item.Id ? 2 : 1;
            let url = 'AddOrUpdateTextLink/' + type;
            if (this.item.Id) url += '?id=' + this.item.Id;
            let textLinkUrl = this.item.Url[0] == "/" ? this.item.Url.slice(1) : this.item.Url;
            let dataItem = {
                "adminUserId": this.authen.account.Id,
                "data": {
                    "propertyId": this.propertyId,
                    "text": this.item.Text,
                    "url": textLinkUrl,
                    "priority": this.item.Priority,
                    "status": this.item.Status ? 1 : 2
                }
            };
            return await this.service.callApi('MSHighlight', url, dataItem, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Cập nhật text link thành công'
                        : 'Thêm mới text link thành công';
                    ToastrHelper.Success(message);
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    async result() {
        let valid = await validation(this.item);
        if (valid) {
            if (this.item.Url.indexOf('http') >= 0) {
                ToastrHelper.Error('URL không đúng định dạng!');
                return false;
            }
            let type = this.item.Id ? 2 : 1;
            let url = 'AddOrUpdateTextLink/' + type;
            if (this.item.Id) url += '?id=' + this.item.Id;
            let dataItem = {
                "adminUserId": this.authen.account.Id,
                "data": {
                    "propertyId": this.propertyId,
                    "text": this.item.Text,
                    "url": this.item.Url,
                    "priority": this.item.Priority,
                    "status": this.item.Status ? 1 : 2
                }
            };
            return await this.service.callApi('MSHighlight', url, dataItem, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Thêm mới text link thành công');
                    this.item = EntityHelper.createEntity(MSTextLinkEntity);
                    this.item.Status = true;
                    this.eventService.RefreshGrids.emit();
                    return this.item;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, (e: any) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return 'xxxx';
    }
}