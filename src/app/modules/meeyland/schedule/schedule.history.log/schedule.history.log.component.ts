import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MLScheduleLogEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';

@Component({
    selector: 'mp-schedule-log',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLScheduleLogComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Large,
        Reference: MLScheduleLogEntity,
        PageSizes: [5, 10, 20, 50, 100],
        Title: 'Lịch sử thao tác lịch xem nhà',
    };

    constructor(public service: MLScheduleService) {
        super();
    }

    ngOnInit() {
        let id = this.params && this.params['id'];
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Action', Title: 'Hành động', Type: DataType.DropDown },
            {
                Property: 'Content', Title: 'Nội dung', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (!item.Content) return null;
                    let items: string[] = item.Content.indexOf('[') >= 0 
                        ? JSON.parse(item.Content)
                        : [item.Content];
                    if (items && items.length > 0) {
                        items.forEach((item: string) => {
                            text += UtilityExHelper.escapeHtml(item) + '<br />';                            
                        });
                    }
                    return text;
                }
            },
            {
                Property: 'User', Title: 'Người thực hiện', Type: DataType.String,
                Format: (item: any) => {
                    return item.User;
                }
            },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime, Align: 'center' },
            { Property: 'Ip', Title: 'IP', Type: DataType.String, Align: 'center' },
        ];
        this.obj.Url = '/admin/mlschedulelog/items/' + id;
        this.render(this.obj);
    }
}