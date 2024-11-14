import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MGBannerEntity } from "../../../_core/domains/entities/meeygroup/mg.banner.entity";
import { PopupViewVideoComponent } from "../../../_core/editor/upload.video/popup.view.video/popup.view.video.component";
import { PopupViewImageComponent } from "../../../_core/editor/upload.image/popup.view.image/popup.view.image.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BannerComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGBannerEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Id', Type: DataType.String, AllowFilter: true },
            { Property: 'Image', Type: DataType.String, Align:'center',
            Format: (item: any) => {
                let text: string = '';
                if (item.Image && item.Image.length > 0) {
                    if(item.Image.indexOf('.mp4') > 0){
                        text += '<a routerLink="quickView" type="videos"><video style="width: 60px; margin-right: 10px;" src="' + item.Image + '" /></video></a>';
                    }else
                    text += '<a routerLink="quickView" type="images"><img style="width: 60px; margin-right: 10px;" src="' + item.Image + '" /></a>';
                }
                return text;
            }},
            { Property: 'NameVn', Type: DataType.String},
            { Property: 'NameEn', Type: DataType.String},
            { Property: 'Page', Type: DataType.String},
            { Property: 'DeviceId', Type: DataType.String},
        ];
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/banner',
        };
        this.router.navigate(['/admin/meeygroup/banner/add'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/banner',
        };
        this.router.navigate(['/admin/meeygroup/banner/view'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeygroup/banner',
        };
        this.router.navigate(['/admin/meeygroup/banner/edit'], { state: { params: JSON.stringify(obj) } });
    }
    quickView(item: any, type: string) {
        //if(item.Image.indexOf('.mp4') > 0) type = 'videos';
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'images': this.quickViewImages(originalItem); break;
                case 'videos': this.quickViewVideos(originalItem); break;
                default: break;
            }
        }
    }
    private quickViewVideos(item: any) {
        let videos = item.Image;
        if (videos) {
            this.dialogService.WapperAsync({
                title: 'Xem video',
                cancelText: 'Đóng',
                size: ModalSizeType.ExtraLarge,
                object: PopupViewVideoComponent,
                objectExtra: { videos: [videos] },
            });
        }
    }
    private quickViewImages(item: any) {
        let images = item.Image;
        if (images) {
            this.dialogService.WapperAsync({
                title: 'Xem ảnh',
                cancelText: 'Đóng',
                size: ModalSizeType.ExtraLarge,
                object: PopupViewImageComponent,
                objectExtra: { images: [images] },
            });
        }
    }
}