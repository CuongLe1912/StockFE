import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { FileData } from '../../../../_core/domains/data/file.data';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditReplyComponent } from '../edit.reply/edit.reply.component';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ValidatorHelper } from '../../../../_core/helpers/validator.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MeeyReviewEntity } from '../../../../_core/domains/entities/meeyreview/mr.review.entity';
import { MRVReviewStatusType } from '../../../../_core/domains/entities/meeyreview/enums/review.status.typs';

@Component({
    selector: 'mrv-edit-question',
    templateUrl: './edit.question.component.html',
    styleUrls: [
        './edit.question.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditQuestionComponent extends EditComponent implements OnInit {
    item: MeeyReviewEntity;
    loading: boolean = true;
    event: AdminEventService;
    arrayReplies: any[] = [];
    readonly: boolean = false;
    activeScoreDetail: boolean = false;
    isValidPublishAt: boolean = true;
    @Input() id: string;
    @Input() index: number;
    @Input() projectId: string;
    @ViewChild('uploadFiles') uploadFiles: EditorComponent;
    @ViewChildren('editorReply') editorReplies: QueryList<EditReplyComponent>;

    constructor() {
        super();
        this.event = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('meeyreview', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeeyReviewEntity, result.Object as MeeyReviewEntity);
                    this.item.Files = this.renderFiles(this.item.Files);
                    //this.addMoreReply();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MeeyReviewEntity();
    }
    private renderFiles(files: any[]): FileData[] {
        let itemFiles: FileData[] = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                itemFiles.push({
                    Path: file.url,
                    Code: file.code || file._id,
                    Name: file.title || file.name,
                    ResultUpload: {
                        _id: file._id,
                        uri: file.uri,
                        url: file.url,
                        name: file.name,
                        size: file.size,
                        s3Key: file.s3Key,
                        width: file.width,
                        height: file.height,
                        mimeType: file.mimeType,
                    }
                });
            }
        }
        return itemFiles;
    }

    addMoreReply() {
        let lastPublishAt: Date = this.editorReplies && this.editorReplies.length > 0
            ? _.cloneDeep(this.editorReplies.toArray()[this.editorReplies.length - 1].item.PublishedAt)
            : null;
        if (lastPublishAt) {
            let minutes = lastPublishAt.getMinutes();
            lastPublishAt.setMinutes(minutes + 15);
        }
        else {
            lastPublishAt = _.cloneDeep(new Date(this.item.PublishedAt));
            let minutes = lastPublishAt.getMinutes();
            lastPublishAt.setMinutes(minutes + 60);
        }
        let index = this.editorReplies.length == 0 ? 0 : this.editorReplies.length;
        this.arrayReplies.push({
            index: index,
            allowDelete: index >= 1
        });
        setTimeout(() => {
            let editor = this.editorReplies && this.editorReplies.length > 0
                ? this.editorReplies.toArray()[this.editorReplies.length - 1]
                : null;
            if (editor) {
                editor.setPublishAt(lastPublishAt);
                editor.getParent(this.item)
            }
        }, 500);
    }

    removeMoreReply(index: number) {
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa phản hồi này không?', () => {
            this.arrayReplies.splice(index, 1);
        });
    }

    userChange(item: any) {
        if (item && item.originalItem)
            this.item.NickName = item.originalItem.NickName || item.originalItem.Name;
        else
            this.item.NickName = '';
    }

    public setPublishAt(publishedAt: Date) {
        if (!this.item)
            this.item = EntityHelper.createEntity(MeeyReviewEntity);
        this.item.PublishedAt = publishedAt;
    }

    public async validate(): Promise<boolean> {
        let columns = ['Comment'];
        if (this.item.Files && this.item.Files.length > 0)
            columns = [];
        let valid = columns && columns.length > 0 ? await validation(this.item, columns, false, this.index, true) : true;
        return valid
    }

    public async validateNoti(){
        if (this.editorReplies && this.editorReplies.length > 0) {
            for (let i = 0; i < this.editorReplies.length; i++) {
                let item: EditReplyComponent = this.editorReplies.toArray()[i];
                if(item.item.PublishedAt == null){item.item.PublishedAt = new Date()}
                await item.validate();
                item.validationPublishedAt(item.item.PublishedAt)
            }
        }
    } 
    public async validateReplies(): Promise<boolean> {
        // if (this.editorReplies && this.editorReplies.length > 0) {
            for (let i = 0; i < this.editorReplies.length; i++) {
                let item: EditReplyComponent = this.editorReplies.toArray()[i];
                if(item.item.PublishedAt == null){item.item.PublishedAt = new Date()}
                let valid = await item.validate();
                let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                if (!valid || !checkTime) {
                    return false;
                }
            }
            return true;
        // } else {
        //     ToastrHelper.Error("Vui lòng tạo ít nhất 1 phản hồi để tiếp tục")
        //     return false;
        // }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let columns = ['Comment'];
            if (this.item.Files && this.item.Files.length > 0)
                columns = [];
            let valid = columns && columns.length > 0 ? await validation(this.item, columns, false, this.index, true) : true;
            if(this.item.PublishedAt != null){
                if(this.item.PublishedAt.getTime() <= new Date().getTime()) {
                    this.item.PublishedAt = new Date()
                }
            }else{
                this.item.PublishedAt = new Date()
            }            
            this.isValidPublishAt = this.validationPublishedAt(this.item.PublishedAt);
            if (valid && this.isValidPublishAt) {
                let files = await this.uploadFiles.upload();
                let s3Files = files.map(c => {
                    return {
                        s3Keys: [c.S3Key],
                        type: ValidatorHelper.isImageFile(c.S3Key) ? 1 : (ValidatorHelper.isVideoFile(c.S3Key) ? 3 : 2)
                    }
                });
                let data = {
                    media: s3Files,
                    userId: this.item.UserId,
                    comment: this.item.Comment,
                    nickName: this.item.NickName,
                    publishedAt: this.item.PublishedAt,
                    //publishedAt: new Date(),
                };

                let url = 'meeyReview/addQuestion/' + this.projectId;
                return await this.service.callApiByUrl(url, data, MethodType.Post).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.id = result.Object;
                        await this.loadItem()
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

    public async confirmReplies(): Promise<boolean> {
        // if (this.editorReplies && this.editorReplies.length > 0) {
            let isAllValidTime = true
            let reply = this.editorReplies.toArray()
            for (let i = 0; i < reply.length; i++) {
                const element = reply[i];
                if(!element.validationPublishedAt(element.item.PublishedAt)){
                    isAllValidTime = false
                }
            }
            if(isAllValidTime == false) return false
            this.processingSecond = true;
            for (let i = 0; i < this.editorReplies.length; i++) {
                let item: EditReplyComponent = this.editorReplies.toArray()[i];
                let result = await item.confirm();
                if (!result) {
                    this.arrayReplies[i].allowDelete = false;
                    this.processingSecond = false;
                    return false;
                }
            }
            return true;
        // }
    }

    public async confirmAndReply(): Promise<boolean> {
        let result = await this.confirm();
        if (result) {
            this.readonly = true;
            //this.arrayReplies.push(1);
        }
        return result;
    }

    public validationPublishedAt(datetime){     
        if(datetime != null){
            datetime = new Date(datetime)   
            let currentDatetime = new Date()
            if(datetime.getFullYear() === currentDatetime.getFullYear() &&
            datetime.getMonth() === currentDatetime.getMonth() &&
            datetime.getDate() === currentDatetime.getDate() &&
            datetime.getHours() === currentDatetime.getHours() &&
            datetime.getMinutes() === currentDatetime.getMinutes()){
                this.isValidPublishAt = true;
                return true;
            }
            else if(datetime >= currentDatetime){
                this.isValidPublishAt = true;
                return true
            }
            else{
                this.isValidPublishAt = false;
                return false
            }
        }
        return true //Phần này thay đổi nghiệp vụ, trong màn hình review nếu thời gian ko dc chọn thì sẽ return true luôn (chạy đến hàm confirm thì PublishedAt = Datetime now)  
    }
    private changePublishedAt(){
        this.isValidPublishAt = true
    }
}