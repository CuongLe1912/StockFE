import * as _ from 'lodash';
import { MSSeoService } from '../seo.service';
import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../app.module';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { validation, validations } from '../../../_core/decorators/validator';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { MSBoxTextLink, MSTextLinkDetail } from '../../../_core/domains/entities/meeyseo/ms.box.text.link.entity';

@Component({
  templateUrl: './box.text.link.component.html',
  styleUrls: ['./box.text.link.component.scss']
})
export class MSBoxTextLinkComponent extends EditComponent implements OnInit {
  types: any[];
  activeType: number;
  items: MSBoxTextLink[];
  actions: ActionData[] = [];
  detailClipboard: MSTextLinkDetail[];

  minBox = 3;
  maxBox = 4;
  loading = false;
  minTextLink = 5;
  maxTextLink = 10;
  checkAll = false;
  reloadBox = false;
  service: MSSeoService;

  constructor() {
    super();
    this.service = AppInjector.get(MSSeoService);
  }

  async ngOnInit() {
    this.actions = [
      {
        name: "Lưu lại",
        icon: 'la la-save',
        processButton: true,
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        click: async () => await this.confirm()
      }
    ]
    await this.service.getTypes().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.types = result.Object;
        if (this.types && this.types.length > 0)
          this.loadItem(this.types[0].Id);
      }
    });
    this.updateBreadcrumbs();
  }

  async confirm() {
    this.loading = true;
    let validator = true;
    this.processing = true;
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let valid = await validation(item, ["Name"], false, i);
      if (valid) {
        const validItems = await validations(item.Details, null, null, true);
        if (!validItems) {
          validator = validItems;
          break;
        }
      }
      if (!valid) {
        validator = valid;
        break;
      }
    }

    if (validator) {
      let urls: string[] = [];
      for (let i = 0; i < this.items.length; i++) {
        const box = this.items[i];
        if (box && box.Details && box.Details.length > 0) {
          for (let j = 0; j < box.Details.length; j++) {
            const link = box.Details[j];
            if (link && link.Url) {
              if (link.Url.indexOf(' ') >= 0 ||
                link.Url.indexOf('.') == 0 || link.Url.indexOf('-') == 0 ||
                link.Url.lastIndexOf('.') == link.Url.length - 1 || link.Url.lastIndexOf('-') == link.Url.length - 1) {
                ToastrHelper.Error('Textlink không hợp lệ, [Box: ' + (i + 1) + ' - Textlink số: ' + (j + 1) + ']');
                this.processing = false;
                this.loading = false;
                return;
              }
              if (urls.indexOf(link.Url) >= 0) {
                ToastrHelper.Error('Textlink đã tồn tại, [Box: ' + (i + 1) + ' - Textlink số: ' + (j + 1) + ']');
                this.processing = false;
                this.loading = false;
                return;
              }
              urls.push(link.Url);
            }
          }
        }
      }
      let items: MSBoxTextLink[] = _.cloneDeep(this.items);
      items = items.map(c => { c.Type = this.activeType; return c; });
      await this.service.saveBox(items).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.detailClipboard = null;
          ToastrHelper.Success('Cập nhật cấu hình thành công');
        } else
          ToastrHelper.ErrorResult(result);
      });
    }
    this.loading = false;
    this.processing = false;
  }

  addBox() {
    if (this.items.length < this.maxBox) {
      let item = new MSBoxTextLink();
      item.Details = [];
      item.Details.push(new MSTextLinkDetail());
      item.Details.push(new MSTextLinkDetail());
      item.Details.push(new MSTextLinkDetail());
      item.Details.push(new MSTextLinkDetail());
      item.Details.push(new MSTextLinkDetail());
      this.items.push(item);
    }
  }
  async loadItem(type = 0) {
    this.items = [];
    this.loading = true;
    this.activeType = type;
    await this.service.getBoxDetails(type).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        if (result.Object && result.Object.length > 0) {
          this.items = EntityHelper.createEntities(MSBoxTextLink, result.Object);
          this.items.forEach(item => {
            item.Details = EntityHelper.createEntities(MSTextLinkDetail, item.Details);
          })
        } else {
          this.items = [];
          for (let i = 0; i < this.minBox; i++) {            
            this.addBox();
          }
        }
      } else {
        this.items = [];
        for (let i = 0; i < this.minBox; i++) {            
          this.addBox();
        }
      }
      UtilityExHelper.scrollToPosition('.kt-portlet__body', 0);
    });
    this.loading = false;
  }
  checkChange(item: MSBoxTextLink) {
    if (item.Details.filter(c => c.Checked).length == item.Details.length) {
      item["CheckAll"] = true;
    } else {
      item["CheckAll"] = false;
    }
  }
  checkAllChange(item: MSBoxTextLink) {
    let value = item["CheckAll"];
    item.Details.map(c => {
      c.Checked = value;
      return c;
    })
  }
  async addTextLink(item: MSBoxTextLink) {
    if (await validations(item.Details)) {
      if (item.Details.length < this.maxTextLink) {
        let entity: MSTextLinkDetail = EntityHelper.createEntity(MSTextLinkDetail);
        entity.Rel = null; entity.Target = '_blank';
        item.Details.push(entity);
      }
    }
  }

  copy(item: MSBoxTextLink) {
    this.detailClipboard = _.cloneDeep(item.Details.filter(c => c.Checked));
    item.Details.map(c => {
      c.Checked = false;
      return c;
    });
    item["CheckAll"] = false;
    ToastrHelper.Success('Copy Text link thành công');
  }
  paste(item: MSBoxTextLink) {
    if (this.detailClipboard) {
      let clipboard = _.cloneDeep(this.detailClipboard);
      clipboard = clipboard.map(c => {
        c.Checked = false;
        c.Id = null;
        return c;
      });
      item.Details.push(...clipboard);
    }
  }
  showCopy(item: MSBoxTextLink) {
    return item.Details.filter(c => c.Checked).length > 0;
  }

  up(item: MSBoxTextLink, index: number) {
    if (index > 0) {
      let itemClone: MSTextLinkDetail = _.cloneDeep(item.Details[index - 1]);
      item.Details[index - 1] = _.cloneDeep(item.Details[index]);
      item.Details[index] = itemClone;
    }
  }
  down(item: MSBoxTextLink, index: number) {
    if (index < item.Details?.length - 1) {
      let itemClone: MSTextLinkDetail = _.cloneDeep(item.Details[index + 1]);
      item.Details[index + 1] = _.cloneDeep(item.Details[index]);
      item.Details[index] = itemClone;
    }
  }
  removeBox(item: MSBoxTextLink, index: number) {
    if (item && this.items.length > this.minBox) {
      let boxName = item.Name ? item.Name : "Box " + (index + 1);
      this.dialogService.ConfirmAsync("Có phải bạn muốn xóa " + boxName, async () => {
        if (item.Id) {
          await this.service.deleteBox(item.Id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Xóa ' + boxName + ' thành công');
              this.items.splice(index, 1);
              this.reloadBox = true;
              setTimeout(() => {
                this.reloadBox = false;
              }, 0);
            } else
              ToastrHelper.ErrorResult(result);
          });
        } else {
          this.items.splice(index, 1);
          this.reloadBox = true;
          setTimeout(() => {
            this.reloadBox = false;
          }, 0);
        }
      })
    }
  }
  updateRel(item: MSBoxTextLink, index: number) {
    this.loading = true;
    if (item?.Details[index]) {
      if (item?.Details[index]?.Rel && item?.Details[index]?.Rel == 'dofollow') {
        item.Details[index].Rel = 'nofollow';
      } else {
        item.Details[index].Rel = 'dofollow';
      }
      item.Details[index].NeedUpdate = true;
    }
    this.loading = false;
  }
  updateTarget(item: MSBoxTextLink, index: number) {
    this.loading = true;
    if (item?.Details[index]) {
      if (item?.Details[index]?.Target) {
        item.Details[index].Target = '';
      } else {
        item.Details[index].Target = '_blank';
      }
      item.Details[index].NeedUpdate = true;
    }
    this.loading = false;
  }
  removeTextLink(item: MSBoxTextLink, index: number) {
    if (item && item.Details.length > this.minTextLink) {
      let textlink = item.Details[index].Name ? item.Details[index].Name : "Text link " + (index + 1);
      this.dialogService.ConfirmAsync("Có phải bạn muốn xóa " + textlink, async () => {
        if (item.Details[index].Id) {
          await this.service.deleteTextlink(item.Details[index].Id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Xóa ' + textlink + ' thành công');
              item.Details.splice(index, 1)
              item["reloadGroup"] = true;
              setTimeout(() => {
                item["reloadGroup"] = false;
              }, 0);
            } else
              ToastrHelper.ErrorResult(result);
          });
        } else {
          item.Details.splice(index, 1)
          item["reloadGroup"] = true;
          setTimeout(() => {
            item["reloadGroup"] = false;
          }, 0);
        }
      });
    }
  }

  private updateBreadcrumbs() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({ Name: 'Meey Land' });
    this.breadcrumbs.push({ Name: 'Cấu hình textlink mở rộng' });
  }
}
