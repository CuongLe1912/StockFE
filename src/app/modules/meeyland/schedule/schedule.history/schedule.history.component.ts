import { MLScheduleService } from '../schedule.service';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MLEditScheduleHistoryComponent } from './edit/edit.schedule.history.component';
import { MLScheduleHistoryEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';

@Component({
    selector: 'mp-schedule-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLScheduleHistoryComponent extends GridComponent implements OnInit {
    @Input() params: any;
    @Output() countChange: EventEmitter<number> = new EventEmitter<number>();

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
            ActionData.reload(() => { this.loadItems(); })
        ],
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideCustomFilter: true,
        Title: 'Lịch sử hỗ trợ',
        Size: ModalSizeType.Small,
        PageSizes: [5, 10, 20, 50, 100],
        Reference: MLScheduleHistoryEntity,
    };

    constructor(public service: MLScheduleService) {
        super();
    }

    async ngOnInit() {
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/mlschedulehistory/items/' + id;
        this.obj.IsPopup = this.params && this.params['popup'];
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Title: 'Người hỗ trợ', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.FullName, item.Phone, item.Email);
                })
            },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime, Align: 'center' },
            { Property: 'Content', Title: 'Nội dung', Type: DataType.String },
        ];
        if (this.obj.IsPopup) {
            this.obj.Actions = [];
            this.obj.HideHeadActions = true;
        }
        if (this.itemData && this.itemData.Orders)
            this.itemData.Orders = [];
        await this.render(this.obj);
    }

    async addNew() {
        let index = 1,
            scheduleId = this.params && this.params['id'];
        await this.service.getMaxIndex(scheduleId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                index = result.Object as number;
            }
        });
        this.dialogService.WapperAsync({
            confirmText: 'Lưu',
            cancelText: 'Hủy bỏ',
            size: ModalSizeType.Medium,
            title: 'Thêm lịch sử hỗ trợ',
            object: MLEditScheduleHistoryComponent,
            objectExtra: {
                index: index,
                scheduleId: scheduleId,
            }
        }, async () => {
            await this.loadItems();
            this.countChange.emit(this.items.length);
        });
    }

    delete(id: number) {
        if (id && this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            this.dialogService.Confirm('Có phải bạn muốn xóa lịch sử hỗ trợ này?', () => {
                this.service.delete(this.obj.ReferenceName, id).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        await this.loadItems();
                        this.countChange.emit(this.items.length);
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    edit(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Cập nhật',
            size: ModalSizeType.Medium,
            title: 'Chỉnh sửa lịch sử hỗ trợ',
            object: MLEditScheduleHistoryComponent,
            objectExtra: {
                id: item.Id,
                scheduleId: this.state.id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Medium,
            title: 'Xem lịch sử hỗ trợ',
            object: MLEditScheduleHistoryComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        }, async () => {
            this.loadItems();
        });
    }
}