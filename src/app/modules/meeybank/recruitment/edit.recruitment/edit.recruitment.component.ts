import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ActionData } from '../../../../_core/domains/data/action.data';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MBankRecruitmentService } from '../recruitment.service';
import {ConstantHelper} from "../../../../_core/helpers/constant.helper";
import {ActionType} from "../../../../_core/domains/enums/action.type";
import { MBankRecruitmentEntity } from 'src/app/_core/domains/entities/meeybank/mbank.recruitment.entity';
import { MBankRecruitmentExperienceType, MBankRecruitmentStatusType, MBankRecruitmentType } from 'src/app/_core/domains/entities/meeybank/enums/mbank.recruitment.type';
import { MethodType } from 'src/app/_core/domains/enums/method.type';
@Component({
    templateUrl: './edit.recruitment.component.html',
    styleUrls: [
        './edit.recruitment.component.scss',
        // '../../../../../assets/css/modal.scss'
    ],
})
export class EditRecruitmentComponent extends EditComponent implements OnInit {
    id: number;
    router: Router;
    viewer: boolean;
    tab: string = 'vn';
    item: MBankRecruitmentEntity;
    @Input() params: any;
    loading: boolean = true;
    service: MBankRecruitmentService;
    publish: boolean;
    enumMBankRecruitmentExperienceType: any
    @ViewChild('uploadImage') uploadImage: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(MBankRecruitmentService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
            this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
        }
        if(this.id){
            this.addBreadcrumb("Sửa tin tuyển dụng");
        }else{
            this.addBreadcrumb("Thêm tin tuyển dụng");
        }
        if (this.state) {
            this.viewer = this.state.viewer;
            this.id = this.id || this.state.id;
        }

        this.enumMBankRecruitmentExperienceType = MBankRecruitmentExperienceType

        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.getItem(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MBankRecruitmentEntity, result.Object as MBankRecruitmentEntity);
                    if(this.item.ExperienceVn){
                        for (let item of ConstantHelper.MBANK_RECRUITMENT_EXPERIENCE_VN_TYPES) {
                            if(item.label == this.item.ExperienceVn){
                                this.item.ExperienceDropVn = item.value
                                this.item.ExperienceVn = null
                            }
                        }
                        if(!this.item.ExperienceDropVn){
                            this.item.ExperienceDropVn = MBankRecruitmentExperienceType.Yes
                        }
                    }

                    if(this.item.ExperienceEn){
                        for (let item of ConstantHelper.MBANK_RECRUITMENT_EXPERIENCE_VN_TYPES) {
                            if(item.label == this.item.ExperienceEn){
                                this.item.ExperienceDropEn = item.value
                                this.item.ExperienceEn = null
                            }
                        }
                        if(!this.item.ExperienceDropEn){
                            this.item.ExperienceDropEn = MBankRecruitmentExperienceType.Yes
                        }
                    }

                    this.item.ExpireDateEdit = this.item.ExpireDate
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new MBankRecruitmentEntity();
        }
    }
    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MBankRecruitmentEntity();
            this.router.navigate(['/admin/meeygroupv2/recruitment/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.backNotSave() }),
            ActionData.saveUpdate('Lưu thay đổi',() => {
                this.publish = false
                this.confirmAndBack()
            })
        ];
        // Save && Publish
        actions.push({
            icon: 'la la-upload',
            name: 'Đăng tin',
            className: 'btn btn-success',
            systemName: ActionType.PublishRecruitment,
            click: () => {
                this.publish = true
                this.confirmAndBack()
            }
        });
        this.actions = await this.authen.actionsAllow(MBankRecruitmentEntity, actions);
    }
    backNotSave() {
        this.dialogService.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn thoát ra?',() => {
            if (this.state)
                this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
            else
                window.history.back();
        }, null, 'Quay lại')
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.item.ExpireDate = this.item.ExpireDateEdit

            if(this.item.PositionIds === '[]'){
                this.item.PositionIds = null
            }
            if(this.item.WelfareIds === '[]'){
                this.item.WelfareIds = null
            }
            if(this.item.TypeIdBool === 1){
                this.item.TypeIdBool = true
            }
            let columns = ['TitleVn', 'ContentVn', 'JobRequirementVn', 'CityId', 'DistrictId','ExperienceVn', 'PositionIds', 'ExpireDate', 'WelfareIds', 'RankId', 'DegreeId','JobIds','ExperienceDropVn', 'TotalCandidates'];
            if (this.item.TypeIdBool){
                columns.push(...['Image','SummaryVn']);
            }
            if (!this.item.SalaryIsAgreement){
                if(!this.item.SalaryMax){
                    columns.push(...['SalaryMin']);
                }else if(!this.item.SalaryMin){
                    columns.push(...['SalaryMax']);
                }
                columns.push(...['SalaryUnit']);
            }
            if (this.item.TitleEn){
                columns.push(...['ContentEn','JobRequirementEn','ExperienceEn','ExperienceDropEn']);
            }
            if(_.isEmpty(this.item.Image)){
                this.item.Image = null
            }

            if(this.item.ExperienceDropVn){
                // @ts-ignore
                if(this.item.ExperienceDropVn.toString() !== MBankRecruitmentExperienceType.Yes.toString()){
                    this.item.ExperienceVn = ConstantHelper.MBANK_RECRUITMENT_EXPERIENCE_VN_TYPES.find(c => c.value == this.item.ExperienceDropVn).label
                }
            }else{
                this.item.ExperienceVn = null
            }
            let valid: boolean = await validation(this.item, columns);
            if (valid) {
                this.processing = true;
                // upload
                let images = null
                if(this.uploadImage){
                    images = await this.uploadImage.image.upload();
                }
                // update user
                let obj: MBankRecruitmentEntity = _.cloneDeep(this.item);
                obj.Image = images && images.length > 0 ? images[0].Path : '';
                //slug
                if(obj.TitleVn) obj.SlugVn = UtilityExHelper.ChangeToSlug(obj.TitleVn )
                if(obj.TitleEn) obj.SlugEn = UtilityExHelper.ChangeToSlug(obj.TitleEn )

                if(typeof obj.WelfareIds ==='string'){
                    obj.WelfareIds = obj.WelfareIds.slice(1,-1).split(',').map(c => parseInt(c))
                }
                if(typeof obj.PositionIds ==='string'){
                    obj.PositionIds = obj.PositionIds.slice(1,-1).split(',').map(c => parseInt(c))
                }

                obj.TypeId = obj.TypeIdBool === true ? MBankRecruitmentType.Hot : MBankRecruitmentType.Normal;

                if(this.publish){
                    obj.Status = MBankRecruitmentStatusType.Active;
                    obj.PublishDate = new Date().toISOString();
                }
                if(this.id){
                    return await this.service.callApi('mbankrecruitment', 'edit', obj, MethodType.Put).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
                            this.processing = false;
                            if (complete) complete();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            this.processing = false;
                            return false;
                        }
                    }, () => {
                        this.processing = false;
                        return false;
                    });
                }
                else{
                    return await this.service.callApi('mbankrecruitment', 'add', obj, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lưu dữ liệu thành công');
                            this.processing = false;
                            if (complete) complete();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            this.processing = false;
                            return false;
                        }
                    }, () => {
                        this.processing = false;
                        return false;
                    });
                }
                
            }
        }
        return false;
    }
}
