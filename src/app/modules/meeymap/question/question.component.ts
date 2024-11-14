import * as _ from 'lodash';
import { Component } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MMQuestionEditComponent } from './edit.question/edit.question.component';
import { MMQuestionEntity } from '../../../_core/domains/entities/meeymap/mm.question.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MMQuestionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            ActionData.view((item: any) => { this.view(item) }),
            ActionData.edit((item: any) => { this.edit(item) }),
            ActionData.delete((item: any) => { this.delete(item.Id) }),
        ],
        Features: [
            ActionData.addNew(() => { this.addNew(); }),
            ActionData.reload(() => { this.loadItems(); }),
        ],
        UpdatedBy: false,
        Size: ModalSizeType.Large,
        Title: 'Danh sách câu hỏi',
        SearchText: 'Nhập tiêu đề',
        Reference: MMQuestionEntity,
        PageSizes: [5, 10, 20, 50, 100],
    };

    constructor() {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            { Property: 'Title', Title: 'Câu hỏi', Type: DataType.String },
            { Property: 'Slug', Title: 'Slug', Type: DataType.String },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            { Property: 'ParentTitle', Title: 'Câu hỏi cha', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Thêm mới câu hỏi',
            confirmText: 'Tạo câu hỏi',
            size: ModalSizeType.ExtraLarge,
            object: MMQuestionEditComponent,
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Sửa câu hỏi',
            confirmText: 'Lưu thay đổi',
            objectExtra: { item: item },
            size: ModalSizeType.ExtraLarge,
            object: MMQuestionEditComponent,
        }, () => this.loadItems());
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem câu hỏi',
            confirmText: 'Sửa câu hỏi',
            size: ModalSizeType.ExtraLarge,
            object: MMQuestionEditComponent,
            objectExtra: { item: item, viewer: true },
        });
    }
}