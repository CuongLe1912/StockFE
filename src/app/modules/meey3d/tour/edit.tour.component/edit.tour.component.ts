import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { MLUserService } from '../../../../modules/meeyuser/user.service';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { M3DTourEntity } from '../../../../_core/domains/entities/meey3d/m3d.tour.entity';
import { M3DCensorshipType } from '../../../../_core/domains/entities/meey3d/enums/tour.censorship.type';

@Component({
  templateUrl: './edit.tour.component.html',
  styleUrls: ['./edit.tour.component.css']
})
export class EditTourComponent implements OnInit  {
  @Input() params: any;
  viewer: boolean;
  isChange: boolean;
  loading: boolean;
  service: AdminApiService;
  dialog: AdminDialogService;
  item: M3DTourEntity;
  serviceUser: MLUserService;
  enableRejectReason: boolean = false;
  disabledCensorship:boolean = false;

  id: string;
  isCensorTour: boolean = false;
  isRejectTour: boolean = false;

  isShowChangeCreatedAt: boolean = false
  phoneSearch: string = '';
  user: any = []
  isShowUserCreatedAt: boolean = false
  loadingSearchUser: boolean = false
  @ViewChild('uploadImage') uploadImage: EditorComponent;

  constructor() {
    this.service = AppInjector.get(AdminApiService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.serviceUser = AppInjector.get(MLUserService);
  }


  async ngOnInit() {
    await this.loadItem();
    this.loading = false;
  }

  private async loadItem() {
    this.id = this.params && this.params['id'];
    this.viewer = this.params && this.params['viewer'];   
    if (this.id) {
      await this.service.item('m3dtour/item', this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(M3DTourEntity, result.Object as M3DTourEntity);
          switch (this.item.Censorship) {
            case M3DCensorshipType.Rejected:    
              this.enableRejectReason = true;
              this.disabledCensorship = true;    
              this.isRejectTour = true;      
              break;
            case M3DCensorshipType.Censored:
              this.isCensorTour = true;
              break;
          }
        } else ToastrHelper.ErrorResult(result);
      })
    } else this.item = new M3DTourEntity();
  }


  changeCreatedAt(){
    this.isShowChangeCreatedAt = true;
    this.phoneSearch = "";
  }
  async findCreatedAt(){
    this.loadingSearchUser = true;
    this.isShowUserCreatedAt = false;
    this.user = []
    const result = await this.service.callApiByUrl('MLUser/GetByPhoneOrEmail/'+ this.phoneSearch.trim())
    if(ResultApi.IsSuccess(result)){
      this.user.Name = result.Object.Name
      this.user.Phone = result.Object.Phone
      this.user.MeeyId = result.Object.MeeyId
      this.user.Email = result.Object.Email
      this.isShowUserCreatedAt = true;
      this.loadingSearchUser = false;
    }
    else{   
      this.loadingSearchUser = false;  
      ToastrHelper.Error(result.Description)      
    }
  }
  confirmCreatedAt(){   
    if(this.user.MeeyId != '' || this.user.MeeyId != undefined){
      this.item.CreatedMeeyId = this.user.MeeyId
      this.item.CreatedBy = this.user.Name
      this.isShowUserCreatedAt = false;
      this.isShowChangeCreatedAt = false;
    }    
  }

  async confirmData(valid) : Promise<boolean>{
    if(valid){
      // upload
      let images = await this.uploadImage.image.upload();
      let resultUploadImage = images.filter(c => c.ResultUpload)
        .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0]
      // call api
      let data = {
        "Id": this.item.Id,
        "title": this.item.Title,
        "description": this.item.Description,
        "thumb": resultUploadImage,
        "categoryId": this.item.CategoryId,
        "urlEmbed": this.item.LinkTour,
        "censorship":this.item.Censorship,
        "rejectReason": this.item.RejectReason,
        "createdBy": this.item.CreatedMeeyId
      };
      if (resultUploadImage && resultUploadImage[0]?.s3Key)
        data['s3Key'] = resultUploadImage[0]?.s3Key;
      if (this.id) {
        const result = await this.service.callApi('M3DTour', 'Update/' + this.id, data, MethodType.Put);
        if(ResultApi.IsSuccess(result)){
          ToastrHelper.Success('Cập nhật thành công');
          return true;
        }
        else{
          ToastrHelper.ErrorResult(result);
          return false;
        }   
      }
    }
  }

  async confirm(): Promise<boolean> {
    let valid = await validation(this.item, ['Title']);  

    if(this.item.Censorship == M3DCensorshipType.Not_Censor || this.item.Censorship == M3DCensorshipType.Censored){
      this.item.RejectReason = "";
    }
    if(this.item.Censorship == M3DCensorshipType.Not_Censor && this.isCensorTour == true){
      ToastrHelper.Error('Không thể chuyển một tour Đã kiểm duyệt về Chưa kiểm duyệt');
      return false;
    }
    if(this.item.Censorship == M3DCensorshipType.Rejected && this.isRejectTour == false){
      valid = await validation(this.item, ['Title', 'RejectReason']);
      if(valid){
        const confirmationPromise = new Promise<boolean>((resolve) => {
          this.dialog.Confirm('Bạn có chắc chắn muốn đổi trạng thái kiểm duyệt từ chối - Tour sẽ không hiển thị ở trang chủ nếu bị từ chối', () => {
              resolve(true);
          }, () => {
              resolve(false);
          });
        }); 
          // Đợi cho sự kiện xác nhận và gán giá trị cho check
        const check = await confirmationPromise;
  
        if (check) {
          let result =  await this.confirmData(valid);     
          return result;
        }
      }
      
    }
    else{
      const result =  await this.confirmData(valid);     
      return result;
    }
  }

  changeCensorship(){
    if(this.item.Censorship == M3DCensorshipType.Rejected){
      this.enableRejectReason = true;
    }
    else{
      this.enableRejectReason = false
    }

  }
}
 