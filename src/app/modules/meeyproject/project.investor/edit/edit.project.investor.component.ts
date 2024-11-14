import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectInvestorEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.investor.entity';
import { FileData } from '../../../../_core/domains/data/file.data';

@Component({
    templateUrl: './edit.project.investor.component.html',
    styleUrls: [
        './edit.project.investor.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProjectInvestorComponent implements OnInit {
    @ViewChild('uploadImages') uploadImages: EditorComponent;

    id: string;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    disabled: boolean = true;
    service: MPOProjectService;
    checkDisabled: boolean = false;
    item: MPOProjectInvestorEntity = new MPOProjectInvestorEntity();

    constructor() {
        this.service = AppInjector.get(MPOProjectService);
    }

    async ngOnInit() {
        this.viewer = this.params && this.params['viewer'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
        setTimeout(() => {
            this.checkDisabled = true;
        }, 1000);
    }

    async toggleDisableButton() {
        if (this.checkDisabled)
            this.disabled = await validation(this.item, ['Name', 'Description', 'Logo'], true) ? false : true;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item, ['Name', 'Description', 'Logo'])) {
                if (this.item.Logo) {
                    let images = await this.uploadImages.upload();
                    this.item.Logo = images.filter(c => c.ResultUpload)
                        .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0]
                        // .map(c => { return c.s3Key });
                }
                return await this.service.addOrUpdateProjectInvestor(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = this.item.Id
                            ? 'Cập nhật Chủ đầu tư thành công'
                            : 'Thêm mới Chủ đầu tư thành công';
                        ToastrHelper.Success(message);
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }

    private async loadItem() {
        this.item = new MPOProjectInvestorEntity();
        if (this.id) {
            await this.service.getProjectInvestor(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOProjectInvestorEntity, result.Object);
                    if (result.Object?.Logo?.url) {
                        this.item.Logo = this.renderImage(result.Object?.Logo);
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }

    private renderImage(image: any): FileData {
        let itemImage: FileData = new FileData();
        if (image) {
            itemImage = {
                Path: image.url,
                Name: image.title,
                ResultUpload: {
                    _id: image._id,
                    uri: image.uri,
                    url: image.url,
                    name: image.name,
                    size: image.size,
                    s3Key: image.s3Key,
                    width: image.width,
                    height: image.height,
                    mimeType: image.mimeType,
                }
            }
        }
        return itemImage;
    }
}