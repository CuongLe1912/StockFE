import * as _ from 'lodash';
import { FileData } from '../../../../_core/domains/data/file.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditReplyComponent } from '../edit.reply/edit.reply.component';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MRVReviewType } from '../../../../_core/domains/entities/meeyreview/enums/review.type';
import { MeeyReviewEntity } from '../../../../_core/domains/entities/meeyreview/mr.review.entity';
import { MRVReviewStatusType } from '../../../../_core/domains/entities/meeyreview/enums/review.status.typs';

@Component({
    templateUrl: './popup.reply.review.component.html',
    styleUrls: [
        './popup.reply.review.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class PopupReplyReviewComponent extends EditComponent implements OnInit {
    id: string;
    type: MRVReviewType;
    item: MeeyReviewEntity;
    arrayReplies: any[] = [];
    MRVReviewType = MRVReviewType;
    allowScoreChange: boolean = true;
    activeScoreDetail: boolean = false;

    @ViewChild('uploadFiles') uploadFiles: EditorComponent;
    @ViewChildren('editorReply') editorReplies: QueryList<EditReplyComponent>;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.type = this.params && this.params['type'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('meeyreview', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeeyReviewEntity, result.Object as MeeyReviewEntity);
                    this.item.Files = this.renderFiles(this.item.Files);
                    this.addMoreReply();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    addMoreReply() {
        let lastPublishAt: Date = this.editorReplies && this.editorReplies.length > 0
            ? _.cloneDeep(this.editorReplies.toArray()[this.editorReplies.length - 1].item.PublishedAt)
            : null;
        if (lastPublishAt) {
            let minutes = lastPublishAt.getMinutes();
            lastPublishAt.setMinutes(minutes + 15);
        } else {
            if(this.item.Status == MRVReviewStatusType.Pending){
                lastPublishAt = _.cloneDeep(new Date(this.item.PublishedAt));
                let minutes = lastPublishAt.getMinutes();
                lastPublishAt.setMinutes(minutes + 60);
            }
            else if(this.item.Status == MRVReviewStatusType.Published){
                lastPublishAt = new Date();
                let minutes = lastPublishAt.getMinutes();
                lastPublishAt.setMinutes(minutes + 60);
            }            
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
                editor.getParent(this.item);
            }
        }, 500);
    }

    removeMoreReply(index: number) {
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa phản hồi này không?', () => {
            this.arrayReplies.splice(index, 1);
        });
    }

    public async validateReplies(): Promise<boolean> {
        if (this.editorReplies && this.editorReplies.length > 0) {
            for (let i = 0; i < this.editorReplies.length; i++) {
                let item: EditReplyComponent = this.editorReplies.toArray()[i];
                let valid = await item.validate();
                if (!valid) {
                    return false;
                }
            }
            return true;
        } else {
            ToastrHelper.Error("Vui lòng tạo ít nhất 1 phản hồi để tiếp tục")
            return false;
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.editorReplies && this.editorReplies.length > 0) {
            // validate
            for (let i = 0; i < this.editorReplies.length; i++) {
                let item: EditReplyComponent = this.editorReplies.toArray()[i];
                if(item.item.PublishedAt == null){
                    item.item.PublishedAt = new Date()
                }
                let validAll = await item.validate();
                let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                if (!validAll || !checkTime) {
                    return false;
                }
            }

            //check thời gian
            let isAllValidTime = true
            let reply = this.editorReplies.toArray()
            for (let i = 0; i < reply.length; i++) {
                const element = reply[i];
                if(!element.validationPublishedAt(element.item.PublishedAt)){
                    isAllValidTime = false
                }
            }
            if(isAllValidTime == false) return false
            // save
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
        } else {
            ToastrHelper.Error("Vui lòng tạo ít nhất 1 phản hồi để tiếp tục")
            return false;
        }
    }

    private renderFiles(files: any[]): FileData[] {
        let itemFiles: FileData[] = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                itemFiles.push({
                    Path: file.url,
                    S3Key: file.s3Key,
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
}