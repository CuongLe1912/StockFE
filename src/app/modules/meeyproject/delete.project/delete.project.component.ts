import { Component, Input, OnInit } from "@angular/core";
import { MPOProjectService } from "../project.service";
import { AppInjector } from "src/app/app.module";
import { MPCheckArticleModel, MPOProjectEntity } from "src/app/_core/domains/entities/meeyproject/mpo.project.entity";
import { ResultApi } from "src/app/_core/domains/data/result.api";
import { EntityHelper } from "src/app/_core/helpers/entity.helper";
import { MPODeleteType } from "src/app/_core/domains/entities/meeyproject/enums/mpo.delete.type";
import { ToastrHelper } from "src/app/_core/helpers/toastr.helper";

@Component({
  templateUrl: "./delete.project.component.html",
  styleUrls: ["./delete.project.component.scss"],
})
export class DeleteProjectComponent implements OnInit {
  id: string;
  type: MPODeleteType;
  service: MPOProjectService;
  listMPCheckArticleModel : MPCheckArticleModel[] = []
  item: MPOProjectEntity;
  urlImage: string
  address: string = "";
  loading: boolean;
  @Input() params: any;

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    this.type = this.params && (this.params["type"] as MPODeleteType);
    this.listMPCheckArticleModel = this.params && (this.params["listMPCheckArticleModel"] as MPCheckArticleModel[]);
    await this.getItem()
  }

  constructor() {
    this.service = AppInjector.get(MPOProjectService);
  }

  async confirm() {
    const result = await this.service.deleteProject(this.id);
    if(ResultApi.IsSuccess(result)){
      ToastrHelper.Success("Xóa dự án thành công")
      return true
    }
    else{
      ToastrHelper.Success("Xóa dự không thành công")
      return false
    }
    
  }
  async getItem(){
    const result = await this.service.getProject(this.id)
    if(ResultApi.IsSuccess(result)){
      this.item = result.Object 
      if(this.item.Banner){
        this.urlImage = this.item.Banner.url
      }
      else{
        this.urlImage = "../../../../assets/image/mpo_default_image.png"
      }
      if(this.item.Ward != null){
        this.address += this.item.Ward + ", "
      }
      if(this.item.District != null){
        this.address += this.item.District + ", "
      }
      if(this.item.City != null){
        this.address += this.item.City
      }
    }
  }
}
