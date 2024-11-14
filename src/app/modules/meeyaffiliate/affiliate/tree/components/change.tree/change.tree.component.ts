import { MAFAffiliateService } from '../../../affiliate.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from '../../../../../../_core/helpers/app.config';
import { validation } from '../../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../../../../_core/editor/editor.component';
import { DecoratorHelper } from '../../../../../../_core/helpers/decorator.helper';
import { AdminEventService } from '../../../../../../_core/services/admin.event.service';
import { NavigationStateData } from '../../../../../../_core/domains/data/navigation.state';
import { MafAffiliateTreeAddEntity } from '../../../../../../_core/domains/entities/meeyaffiliate/affiliate.tree.add.entity';

@Component({
  selector: 'app-change.tree',
  templateUrl: './change.tree.component.html',
  styleUrls: ['./change.tree.component.scss']
})
export class MAFChangeTreeComponent implements OnInit {
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  @Input() params: any;

  currentNode: any;
  item: MafAffiliateTreeAddEntity = new MafAffiliateTreeAddEntity();
  id: number;

  disabled: boolean = true;
  user: any;
  errorMesssage: string;
  processSearch = false;

  constructor(private service: MAFAffiliateService, private eventService: AdminEventService) { }

  ngOnInit() {
    this.id = this.params && this.params["id"];
    this.loadItem();
  }

  async loadItem() {
    if (this.id) {
      await this.service.item("MAFAffiliate", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.currentNode = result.Object
        }
      });
    }
  }

  public async confirm(): Promise<boolean> {
    let valid = await validation(this.item, ['Search', 'Reason', 'File']);
    if (valid) {
      if (this.user) {
        this.item.NodeId = this.id;
        this.item.ParentId = this.user?.ParentId;
        this.item.RefCode = this.currentNode.Ref;
        this.item.MeeyId = this.currentNode.MeeyId;
        this.item.Name = this.currentNode.Name;
        this.item.Phone = this.currentNode.Phone;
        this.item.Email = this.currentNode.Email;
        this.item.RefCurrentMeeyId = this.currentNode.Parent?.MeeyId;
        this.item.RefCurrentName = this.currentNode.Parent?.Name;
        this.item.RefCurrentPhone = this.currentNode.Parent?.Phone;
        this.item.RefCurrentRankName = this.currentNode.Parent?.Branch;
        this.item.RefChangeMeeyId = this.user?.MeeyId;
        this.item.RefChangeName = this.user?.Name;
        this.item.RefChangePhone = this.user?.Phone;
        this.item.RefChangeRankName = this.user?.Branch;
        if (this.uploadFile) {
          let files = await this.uploadFile.upload();
          this.item.File = files.map(c => c.Path)[0];
        }
        return await this.service.addNoteRequest(this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo yêu cầu chuyển cây thành công!');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      } else {
        let properties = DecoratorHelper.decoratorProperties(MafAffiliateTreeAddEntity, false);
        if (properties && properties.length > 0) {
          let property = properties.find(c => c.property == 'Search');
          if (property) {
            property.error = 'Kiểm tra MeeyId trước khi thực hiện tiếp';
            this.eventService.Validate.emit(property);
          }
        }
      }
    }
    return false;
  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    window.open(url, "_blank");
  }

  async searchUser() {
    this.processSearch = true;
    this.clearUser()
    let valid = await validation(this.item, ['Search']);
    if (valid) {
      this.item.Search = this.item.Search.trim().replace(/ /g, '')
      await this.service.checkMeeyId(this.item.Search, this.id, 2).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            if (obj.MeeyId != this.currentNode?.Parent?.MeeyId) {
              this.user = {
                ParentId: obj.Id,
                MeeyId: obj.MeeyId,
                Name: obj.Name,
                Email: obj.Email,
                Phone: obj.Phone,
                Branch: obj.Branch,
              }
            } else {
              let properties = DecoratorHelper.decoratorProperties(MafAffiliateTreeAddEntity, false);
              if (properties && properties.length > 0) {
                let property = properties.find(c => c.property == 'Search');
                if (property) {
                  property.error = "Không được nhập mã trùng với người giới thiệu hiện tại";
                  this.eventService.Validate.emit(property);
                }
              }
            }
          }
        } else {
          let properties = DecoratorHelper.decoratorProperties(MafAffiliateTreeAddEntity, false);
          if (properties && properties.length > 0) {
            let property = properties.find(c => c.property == 'Search');
            if (property) {
              property.error = result && result.Description;
              this.eventService.Validate.emit(property);
            }
          }
        }
      });
      this.disabledSave();
      this.processSearch = false;
    }
  }

  clearUser() {
    this.user = null;
    this.errorMesssage = null;
    this.disabledSave();
  }

  async disabledSave() {
    let valid = await validation(this.item, ['Search'], true);
    this.disabled = !(valid && this.user);
  }

}
