declare var $;
import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';


@Component({
  selector: 'mpo-gallery-project-image',
  templateUrl: './gallery.project.image.component.html',
  styleUrls: ['./gallery.project.image.component.scss']
})
export class MPOGalleryProjectImageComponent implements OnInit {
  @Input() params: any;
  @Input() loading: boolean = false;
  @Output() remove: EventEmitter<object> = new EventEmitter<object>();
  @Output() update: EventEmitter<object> = new EventEmitter<object>();

  processSearch: boolean = false;
  viewer: boolean;
  images: any[];
  imagesList: any[];
  item: MPOProjectItemEntity = new MPOProjectItemEntity();

  currentTitle: string = '';

  constructor(private dialog: AdminDialogService) { }

  ngOnInit() {
    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = true;

    this.images = this.params && this.params['images'];
    if (this.images) {
      this.imagesList = _.cloneDeep(this.images);
    }

    if (this.params && this.params['search'] != null)
      this.item.SearchImage = this.params && this.params['search'];

    Fancybox.bind('[data-fancybox="gallery"]', {
      Thumbs: {
        Carousel: {
          fill: false,
          center: true,
        },
      },
    });
  }

  removeImg(item) {
    this.dialog.Confirm('Bạn có chắc chắn muốn Xóa ảnh?', () => {
      this.remove.emit(item);
    });
  }

  updateImg(item) {
    if (item.title) {
      this.dialog.Confirm('Bạn có chắc chắn muốn cập nhật ảnh?', () => {
        this.update.emit(item);
      }, () => {
        item.title = this.currentTitle;
      });
    } else {
      item.title = this.currentTitle;
    }
  }

  changeName(item) {
    item.edit = !item?.edit;
    if (item.edit) {
      this.currentTitle = _.cloneDeep(item.title);
      setTimeout(() => {
        let id = '#' + item._id;
        let img = $(id) as HTMLElement;
        img.focus();
      }, 300);
    } else {
      item.title = item.title.trim().replace(/\s\s+/g, ' ');
      if (this.currentTitle != item.title) {
        this.updateImg(item);
      }
    }
  }

  eventListener(event, item) {
    if (event.key === "Enter") {
      this.changeName(item);
    }
  }

  validInput(event) {
    let valid = /[\\/:*?"<>|]/i.test(event.key);
    return !valid;
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 25);
  }

}
