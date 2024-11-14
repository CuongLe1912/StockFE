import * as _ from 'lodash';
import { validation } from '../../../_core/decorators/validator';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { EditReviewComponent } from '../components/edit.review/edit.review.component';
import { EditQuestionComponent } from '../components/edit.question/edit.question.component';
import { MeeyReviewEntity } from '../../../_core/domains/entities/meeyreview/mr.review.entity';

@Component({
    templateUrl: './seeding.component.html',
    styleUrls: ['./seeding.component.scss'],
})
export class SeedingComponent extends EditComponent implements OnInit {
    id: number;
    name: string;
    viewer: boolean;
    projectId: string;
    tab: string = 'review';
    loading: boolean = true;
    arrayReviews: any[] = [];
    arrayQuestions: any[] = [];
    projectReview: MeeyReviewEntity;
    projectQuestion: MeeyReviewEntity;
    replyReviewState: boolean = false;
    replyQuestionState: boolean = false;

    @Input() params: any;
    @ViewChildren('editorReview') editorReviews: QueryList<EditReviewComponent>;
    @ViewChildren('editorQuestion') editorQuestions: QueryList<EditQuestionComponent>;

    constructor() {
        super();
        this.projectReview = EntityHelper.createEntity(MeeyReviewEntity);
        this.projectQuestion = EntityHelper.createEntity(MeeyReviewEntity);
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.projectId = this.getParam('projectId');
        if (this.projectId) {
            this.projectReview.ProjectId = this.projectId;
            this.projectQuestion.ProjectId = this.projectId;
        }
        this.addMoreReview();
        this.renderActions();
        this.addMoreQuestion();
        this.breadcrumbs.push({
            Name: 'Seeding nhanh'
        });
        this.loading = false;
    }

    resetReview() {
        this.arrayReviews = [];
        setTimeout(() => {
            this.addMoreReview();
            this.projectReview.ProjectId = null;
        }, 300);
    }

    resetQuestion() {
        this.arrayQuestions = [];
        setTimeout(() => {
            this.addMoreQuestion();
            this.projectQuestion.ProjectId = null;
        }, 300);
    }

    addMoreReview() {
        let lastPublishAt = this.editorReviews && this.editorReviews.length > 0
            ? _.cloneDeep(this.editorReviews.toArray()[this.editorReviews.length - 1].item.PublishedAt)
            : new Date();
        if (lastPublishAt) {
            let hours = lastPublishAt.getHours();
            lastPublishAt.setHours(hours + 1);
        }
        let index = this.arrayReviews.length == 0 ? 0 : this.arrayReviews.length;
        this.arrayReviews.push({
            index: index,
            allowDelete: index >= 1
        });
        setTimeout(() => {
            let editor = this.editorReviews && this.editorReviews.length > 0
                ? this.editorReviews.toArray()[this.editorReviews.length - 1]
                : null;
            if (editor) {
                editor.setPublishAt(lastPublishAt);
            }
        }, 500);
    }

    addMoreQuestion() {
        let lastPublishAt = this.editorQuestions && this.editorQuestions.length > 0
            ? _.cloneDeep(this.editorQuestions.toArray()[this.editorQuestions.length - 1].item.PublishedAt)
            : new Date();
        if (lastPublishAt) {
            let hours = lastPublishAt.getHours();
            lastPublishAt.setHours(hours + 1);
        }
        let index = this.arrayQuestions.length == 0 ? 0 : this.arrayReviews.length;
        this.arrayQuestions.push({
            index: index,
            allowDelete: index >= 1
        });
        setTimeout(() => {
            let editor = this.editorQuestions && this.editorQuestions.length > 0
                ? this.editorQuestions.toArray()[this.editorQuestions.length - 1]
                : null;
            if (editor) {
                editor.setPublishAt(lastPublishAt);
            }
        }, 500);
    }

    selectedTab(tab: string) {
        this.tab = tab;
        this.renderActions();
    }

    removeMoreReview(index: number) {
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa review này không?', () => {
            this.arrayReviews.splice(index, 1);
        });
    }

    removeMoreQuestion(index: number) {
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?', () => {
            this.arrayQuestions.splice(index, 1);
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [ActionData.cancel(() => {
            this.dialogService.Confirm('Bạn có chắc chắn muốn rời khỏi trang này không?', () => {
                if (this.state) {
                    if (this.state.prevUrl == '/admin/meeyreview/project') {
                        this.router.navigate(['/admin/meeyreview/project']);
                    }
                    else
                        this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
                }
            });
        })];
        switch (this.tab) {
            case 'review': {
                if (this.replyReviewState) {
                    actions.push({
                        processButton: true,
                        name: 'Gửi phản hồi',
                        icon: 'la la-plus-circle',
                        className: 'btn btn-primary',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            let result = await this.confirmReplies();
                            if (result) this.back();
                        }
                    });
                } else {
                    actions.push({
                        name: 'Gửi và tiếp tục',
                        icon: 'la la-plus-circle',
                        processSecondButton: true,
                        className: 'btn btn-warning',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            await this.confirm();
                        }
                    });
                    actions.push({
                        processButton: true,
                        icon: 'la la-plus-circle',
                        className: 'btn btn-primary',
                        name: 'Gửi và tạo phản hồi',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            await this.confirmAndReply();
                        }
                    });
                }
            } break;
            case 'question': {
                if (this.replyQuestionState) {
                    actions.push({
                        processButton: true,
                        name: 'Gửi phản hồi',
                        icon: 'la la-plus-circle',
                        className: 'btn btn-primary',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            let result = await this.confirmReplies();
                            if (result) this.back();
                        }
                    });
                } else {
                    actions.push({
                        name: 'Gửi và tiếp tục',
                        icon: 'la la-plus-circle',
                        processSecondButton: true,
                        className: 'btn btn-warning',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            await this.confirm();
                        }
                    });
                    actions.push({
                        processButton: true,
                        icon: 'la la-plus-circle',
                        name: 'Gửi và tạo phản hồi',
                        className: 'btn btn-primary',
                        systemName: ActionType.AddNew,
                        click: async () => {
                            await this.confirmAndReply();
                        }
                    });
                }
            } break;
        }
        this.actions = actions;
    }
    //Gửi và tiếp tục
    private async confirm(): Promise<boolean> {
        switch (this.tab) {
            case 'review': {
                let valid = await validation(this.projectReview, ['ProjectId'], null, 1);
                if (valid) {
                    if (this.editorReviews && this.editorReviews.length > 0) {
                        //Show những chỗ thời gian chọn không hợp lệ
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            await item.validate();
                            item.validationPublishedAt(item.item.PublishedAt)
                        }
                        // validate
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            let validAll = await item.validate();
                            let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                            if (!validAll || !checkTime) {
                                return false;
                            }
                        }

                        // save
                        let success: number[] = [];
                        this.processingSecond = true;
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            let result = await item.confirm();
                            if (!result) {
                                this.processingSecond = false;
                                return false;
                            } else {
                                success.push(i + 1);
                            }
                        }
                        let message = 'Tạo mới review số [' + success.join(', ') + '] thành công';
                        this.processingSecond = false;
                        ToastrHelper.Success(message);
                        this.resetReview();
                        return true;
                    }
                }
            } break;
            case 'question': {
                let valid = await validation(this.projectQuestion, ['ProjectId'], null, 2);
                if (valid) {
                    if (this.editorQuestions && this.editorQuestions.length > 0) {
                        //Show những chỗ thời gian không hợp lệ
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            await item.validate();
                            item.validationPublishedAt(item.item.PublishedAt)
                        }
                        // validate
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            let validAll = await item.validate();
                            let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                            if (!validAll || !checkTime) {
                                return false;
                            }
                        }

                        // save
                        let success: number[] = [];
                        this.processingSecond = true;
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            let result = await item.confirm();
                            if (!result) {
                                this.processingSecond = false;
                                return false;
                            } else {
                                success.push(i + 1);
                            }
                        }
                        let message = 'Tạo mới câu hỏi số [' + success.join(', ') + '] thành công';
                        this.processingSecond = false;
                        ToastrHelper.Success(message);
                        this.resetQuestion();
                        return true;
                    }
                }
            } break;
        }
        return false;
    }

    // gửi phản hồi
    private async confirmReplies(): Promise<boolean> {
        switch (this.tab) {
            case 'review': {
                if (this.editorReviews && this.editorReviews.length > 0) {
                    //Show những chỗ thời gian không hợp lệ
                    for (let i = 0; i < this.editorReviews.length; i++) {
                        let item: EditReviewComponent = this.editorReviews.toArray()[i];
                        await item.validateNoti();
                    }
                    // validate
                    for (let i = 0; i < this.editorReviews.length; i++) {
                        let item: EditReviewComponent = this.editorReviews.toArray()[i];
                        let validAll = await item.validateReplies();
                        if (!validAll) {
                            return false;
                        }
                    }

                    this.processing = true;
                    let success: number[] = [];
                    for (let i = 0; i < this.editorReviews.length; i++) {
                        let item: EditReviewComponent = this.editorReviews.toArray()[i];
                        let result = await item.confirmReplies();
                        if (!result) {
                            this.processing = false;
                            return false;
                        } else {
                            this.replyReviewState = true;
                            this.renderActions();
                            success.push(i + 1);
                        }
                    }
                    this.processing = false;
                    return true;
                }
            } break;
            case 'question': {
                if (this.editorQuestions && this.editorQuestions.length > 0) {
                    //Show những chỗ thời gian không hợp lệ
                    for (let i = 0; i < this.editorQuestions.length; i++) {
                        let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                        await item.validateNoti();
                    }
                    // validate
                    for (let i = 0; i < this.editorQuestions.length; i++) {
                        let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                        let validAll = await item.validateReplies();
                        if (!validAll) {
                            return false;
                        }
                    }
                
                    this.processing = true;
                    let success: number[] = [];
                    for (let i = 0; i < this.editorQuestions.length; i++) {
                        let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                        let result = await item.confirmReplies();
                        if (!result) {
                            this.processing = false;
                            return false;
                        } else {
                            this.replyQuestionState = true;
                            this.renderActions();
                            success.push(i + 1);
                        }
                    }
                    this.processing = false;
                    return true;
                }
            } break;
        }
        return false;
    }
    //Gửi và tạo phản hồi
    private async confirmAndReply(): Promise<boolean> {
        switch (this.tab) {
            case 'review': {
                let valid = await validation(this.projectReview, ['ProjectId'], null, 1);
                if (valid) {
                    if (this.editorReviews && this.editorReviews.length > 0) {
                        //Show những chỗ thời gian không hợp lệ
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            await item.validate();
                            item.validationPublishedAt(item.item.PublishedAt)
                        }
                        // validate
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            let validAll = await item.validate();
                            let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                            if (!validAll || !checkTime) {
                                return false;
                            }
                        }

                        // save
                        this.processing = true;
                        let success: number[] = [];
                        for (let i = 0; i < this.editorReviews.length; i++) {
                            let item: EditReviewComponent = this.editorReviews.toArray()[i];
                            let result = await item.confirmAndReply();
                            if (!result) {
                                this.processing = false;
                                return false;
                            } else {
                                this.arrayReviews[i].allowDelete = false;
                                this.replyReviewState = true;
                                this.renderActions();
                                success.push(i + 1);
                            }
                        }
                        let message = 'Tạo mới review số [' + success.join(', ') + '] thành công';
                        ToastrHelper.Success(message);
                        this.processing = false;
                        return true;
                    }
                }
            } break;
            case 'question': {
                let valid = await validation(this.projectQuestion, ['ProjectId'], null, 2);
                if (valid) {
                    if (this.editorQuestions && this.editorQuestions.length > 0) {
                        //Show những chỗ thời gian không hợp lệ
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            await item.validate();
                            item.validationPublishedAt(item.item.PublishedAt)
                        }
                        // validate
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            let validAll = await item.validate();
                            let checkTime = item.validationPublishedAt(item.item.PublishedAt)
                            if (!validAll || !checkTime) {
                                return false;
                            }
                        }

                        // let isAllValidTime = true
                        // let question = this.editorQuestions.toArray()
                        // for (let i = 0; i < question.length; i++) {
                        //     //Thực hiện in thông báo dưới time chọn sai
                        //     const element = question[i];                          
                        //     if(!element.validationPublishedAt(element.item.PublishedAt)){
                        //         isAllValidTime = false
                        //     }
                        // }
                        // if(isAllValidTime == false) return false

                        // save
                        this.processing = true;
                        let success: number[] = [];
                        for (let i = 0; i < this.editorQuestions.length; i++) {
                            let item: EditQuestionComponent = this.editorQuestions.toArray()[i];
                            let result = await item.confirmAndReply();
                            if (!result) {
                                this.processing = false;
                                return false;
                            } else {
                                this.replyQuestionState = true;
                                this.renderActions();
                                success.push(i + 1);
                            }
                        }
                        let message = 'Tạo mới câu hỏi số [' + success.join(', ') + '] thành công';
                        ToastrHelper.Success(message);
                        this.processing = false;
                        return true;
                    }
                }
            } break;
        }
        return false;
    }
}