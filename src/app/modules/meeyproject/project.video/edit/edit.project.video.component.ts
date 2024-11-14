declare var $: any
import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { KeyValue } from '../../../../_core/domains/data/key.value';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { RegexType } from '../../../../_core/domains/enums/regex.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOAvatarType } from '../../../../_core/domains/entities/meeyproject/enums/mpo.avatar.type';
import { MPOProjectVideosEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.video.entity';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';

@Component({
    templateUrl: './edit.project.video.component.html',
    styleUrls: [
        './edit.project.video.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProjectVideoComponent implements OnInit {
    id: string;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    disabled: boolean = false;
    service: MPOProjectService;
    MPOAvatarType = MPOAvatarType;
    activeTypeChange: boolean = true;
    item: MPOProjectVideosEntity = new MPOProjectVideosEntity();

    descriptionHighlight: string;

    @ViewChild('uploadVideo') uploadVideo: EditorComponent;
    @ViewChild('uploadImageFromVideo') uploadImageFromVideo: EditorComponent;
    @ViewChild('uploadImageFromUpload') uploadImageFromUpload: EditorComponent;

    constructor() {
        this.service = AppInjector.get(MPOProjectService);
    }

    async ngOnInit() {
        this.viewer = this.params && this.params['viewer'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
    }

    typeChange() {
        if (this.activeTypeChange) {
            this.activeTypeChange = false;
            if (this.item.Type == MPOAvatarType.Upload) {
                this.uploadImageFromUpload.image.selectFileToUpload();
            }
        }
        setTimeout(() => this.activeTypeChange = true, 500);
    }

    videoChange(data: any) {
        if (this.item.Type == MPOAvatarType.FromVideo) {
            this.uploadImageFromVideo.image.setValue({
                Data: data,
                NativeData: this.dataURIToBlob(data),
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let columns = this.item.Type == MPOAvatarType.FromVideo
                ? ['Video', 'Title', 'VideoProjectId']
                : ['Video', 'ImageFromUpload', 'Title', 'VideoProjectId'];
            if (await validation(this.item, columns)) {
                let item: MPOProjectVideosEntity = _.cloneDeep(this.item);
                let keyValues: KeyValue[] = this.item.Type == MPOAvatarType.FromVideo ? [
                    {
                        key: 'screenshot',
                        value: true
                    }
                ] : null;
                // upload video
                let videos = await this.uploadVideo.upload(keyValues);
                let resultUploadVideo = videos.filter(c => c.ResultUpload)
                    .map(c => c.ResultUpload.videos && Array.isArray(c.ResultUpload.videos) ? c.ResultUpload.videos[0] : c.ResultUpload)[0]
                item.Video = { s3Key: resultUploadVideo.s3Key };

                if (this.item.Type == MPOAvatarType.Upload) {
                    // upload image
                    let images = await this.uploadImageFromUpload.upload();
                    item.Image = images.filter(c => c.ResultUpload)
                        .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                        .map(c => {
                            return c._id
                                ? { _id: c._id }
                                : { s3Key: c.s3Key }
                        })[0];
                } else {
                    item.Image = { s3Key: resultUploadVideo?.screenshots[0]?.s3Key };
                }

                if (item.Description) {
                    item.DescriptionEditor = this.applyHighlights(item.Description);
                }

                return await this.service.addOrUpdateVideo(this.id, item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = 'Tải video dự án thành công';
                        ToastrHelper.Success(message);
                        return result.Object;
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
        this.loading = true;
        if (this.id) {
            await this.service.getProject(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOProjectVideosEntity, result.Object);
                } else {
                    ToastrHelper.Error('Thông báo', 'Video dự án không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
                }
            });
        }
        this.loading = false;
    }
    private dataURIToBlob(dataURI: string): Blob {
        const splitDataURI = dataURI.split(',')
        const byteString =
            splitDataURI[0].indexOf('base64') >= 0
                ? atob(splitDataURI[1])
                : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
        return new Blob([ia], { type: mimeString });
    }

    inputDescription() {
        let description = this.item.Description;
        let regex = UtilityExHelper.getRegexListType();
        var highlightedText = this.applyHighlights(description, regex.validHashtag);

        $('.highlights').html(highlightedText);
    }

    applyHighlights(text, regex = RegexType.TextHashTags) {
        text = text
            .replace(/\n$/g, '\n\n')
            .replace(regex, '<span class="hngfxw3">$&</span>');
        var ua = window.navigator.userAgent.toLowerCase();
        var isIE = !!ua.match(/msie|trident\/7|edge/);
        if (isIE) {
            // IE wraps whitespace differently in a div vs textarea, this fixes it
            text = text.replace(/ /g, ' <wbr>');
        }
        return text;
    }

    handleScroll() {
        var scrollTop = $('#txtHashtag').scrollTop();
        $('.backdrop').scrollTop(scrollTop);

        var scrollLeft = $('#txtHashtag').scrollLeft();
        $('.backdrop').scrollLeft(scrollLeft);
    }
}