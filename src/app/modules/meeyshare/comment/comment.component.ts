import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { PipeType } from "../../../_core/domains/enums/pipe.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { EditCommentComponent } from "./edit.comment/edit.comment.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MeeyShareCommentEntity } from "../../../_core/domains/entities/meeyshare/ms.comment.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CommentComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        HideSearch: true,
        UpdatedBy: false,
        DisableAutoLoad: true,
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
        ],
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        Reference: MeeyShareCommentEntity,
        CustomFilters: ['UserId', 'CreatedAt', 'Level', 'Status']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Content', Title: 'Nội dung bình luận', Type: DataType.String, DisableOrder: true },
            { Property: 'Level', Title: 'Loại bình luận', Type: DataType.DropDown, DisableOrder: true, Align: 'center' },
            {
                Property: 'UserId', Title: 'Người bình luận', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.UserId) text += '<p class="d-flex"><span>MeeyId:&nbsp;</span><span>' + item.UserId + '</span></p>';
                    if (item.User) text += '<p class="d-flex"><span>Tên:&nbsp;</span><span>' + item.User + '</span></p>';
                    return text;
                }),
            },
            { Property: 'CreatedAt', Title: 'Ngày bình luận', Type: DataType.DateTime, DisableOrder: true, PipeType: PipeType.Date, Align: 'center' },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.DropDown, DisableOrder: true, Align: 'center' },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            title: 'Chi tiết bình luận',
            object: EditCommentComponent,
            objectExtra: {
                id: item.Id
            },
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            size: ModalSizeType.Medium,
        }, async () => await this.loadItems());
    }
}