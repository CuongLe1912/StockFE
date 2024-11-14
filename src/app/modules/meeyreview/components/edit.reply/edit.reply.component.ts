import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ValidatorHelper } from '../../../../_core/helpers/validator.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { MeeyReviewEntity } from '../../../../_core/domains/entities/meeyreview/mr.review.entity';
import { MRVReviewStatusType } from '../../../../_core/domains/entities/meeyreview/enums/review.status.typs';

@Component({
    selector: 'mrv-edit-reply',
    templateUrl: './edit.reply.component.html',
    styleUrls: [
        './edit.reply.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditReplyComponent extends EditComponent implements OnInit {
    @Input() index: number;
    @Input() replyId: number;
    @Input() reviewId: number;
    @Input() questionId: number;

    id: string;
    item: MeeyReviewEntity;
    loading: boolean = true;
    event: AdminEventService;
    readonly: boolean = false;
    activeScoreDetail: boolean = false;
    messageAlertPublishAt: string = "";
    isValidPublishAt: boolean = true;
    itemParent : MeeyReviewEntity;
    @ViewChild('uploadFiles') uploadFiles: EditorComponent;

    constructor() {
        super();
        this.event = AppInjector.get(AdminEventService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MeeyReviewEntity();
    }

    public setPublishAt(publishedAt: Date) {
        if (!this.item)
            this.item = EntityHelper.createEntity(MeeyReviewEntity);
        this.item.PublishedAt = publishedAt;        
    }

    public getParent(item){
        this.itemParent = item
    }

    userChange(item: any) {
        if (item && item.originalItem)
            this.item.NickName = item.originalItem.NickName || item.originalItem.Name;
        else
            this.item.NickName = '';
    }

    public async validate(): Promise<boolean> {
        let columns = [];
        if (this.item.Files && this.item.Files.length > 0)
            columns.push('UserId');
        else columns.push('Comment', 'UserId');
        let valid = await validation(this.item, columns, false, this.index, true);
        return valid
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (!this.id) {
                let columns = [];
                if (this.item.Files && this.item.Files.length > 0)
                    columns.push('UserId');
                else columns.push('Comment', 'UserId');

                let valid = await validation(this.item, columns, false, this.index, true);
                //this.isValidPublishAt = this.validationPublishedAt(this.item.PublishedAt);
                if (valid) {
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

                    let url = this.reviewId
                        ? 'meeyReview/addReply/' + this.reviewId
                        : (this.questionId ? 'meeyReview/addReply/' + this.questionId : 'meeyReview/addReply/' + this.replyId);
                    return await this.service.callApiByUrl(url, data, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            let message = 'Tạo mới phản hồi thành công';
                            ToastrHelper.Success(message);
                            this.id = result.Object;
                            this.readonly = true;
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        return false;
                    });
                }
            } else return true;
        }
        return false;
    }

    public validationPublishedAt(datetime){
        datetime = new Date(datetime)
        if(this.itemParent.Status == MRVReviewStatusType.Published){
            //Nếu trạng thái là chưa đăng
            //datetime không được nhỏ hơn thời gian hiện tại
            let currentDatetime = new Date()
            if(datetime.getFullYear() === currentDatetime.getFullYear() &&
            datetime.getMonth() === currentDatetime.getMonth() &&
            datetime.getDate() === currentDatetime.getDate() &&
            datetime.getHours() === currentDatetime.getHours() &&
            datetime.getMinutes() === currentDatetime.getMinutes())//đây là trường hợp trùng giờ trùng phút vẫn cho pass vì Js so sánh giờ đến độ chinh xác là giây
            {
                this.isValidPublishAt = true
                return true;
            }
            else if(datetime >= currentDatetime){
                this.isValidPublishAt = true
                return true
            }
            else{
                this.isValidPublishAt = false
                this.messageAlertPublishAt = "Thời gian phản hồi không được nhỏ hơn thời gian hiện tại"
                return false
            }

        }
        else if(this.itemParent.Status == MRVReviewStatusType.Pending){
            //Nếu trạng thái là chưa đăng
            //datetime phải lớn hơn thời gian đăng review
            let currentDatetime = new Date(this.itemParent.PublishedAt)

            if(datetime.getFullYear() === currentDatetime.getFullYear() &&
            datetime.getMonth() === currentDatetime.getMonth() &&
            datetime.getDate() === currentDatetime.getDate() &&
            datetime.getHours() === currentDatetime.getHours() &&
            datetime.getMinutes() === currentDatetime.getMinutes())//đây là trường hợp trùng giờ trùng phút vẫn cho pass vì Js so sánh giờ đến độ chinh xác là giây
            {
                this.isValidPublishAt = true
                return true;
            }
            else if(datetime >= currentDatetime){
                this.isValidPublishAt = true
                return true
            }
            else{
                this.isValidPublishAt = false
                this.messageAlertPublishAt = "Thời gian phản hồi phải lớn hơn thời gian đăng review"
                return false
            }
        }
    }
    public changePublishedAt(){
        this.isValidPublishAt = true
        this.messageAlertPublishAt = "";
    }
}