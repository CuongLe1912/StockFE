import * as _ from 'lodash';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleAccessType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    selector: 'ml-list-article',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() action: ActionType;
    @Input() articles: MLArticleEntity[];
    @Output() removed: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() selected: EventEmitter<MLArticleEntity[]> = new EventEmitter<MLArticleEntity[]>();

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80, DisableOrder: true },
            {
                Property: 'Code', Title: 'Mã tin', Type: DataType.String, Align: 'center', ColumnWidth: 120, DisableOrder: true,
                Click: (item: any) => {
                    this.view(item);
                }
            },
            {
                Property: 'Title', Title: 'Tiêu đề', Type: DataType.String, DisableOrder: true,
                Click: (item: any) => {
                    this.quickViewArticle(item);
                }
            }
        ];
    }

    async ngOnInit() {
        if (this.action) {
            this.properties.unshift(
                {
                    Property: this.action, Title: 'Cho phép', Type: DataType.String, Align: 'center', ColumnWidth: 100, DisableOrder: true,
                    Format: (item: any) => {
                        let checked = item[this.action];
                        let text = '<p class="d-flex align-items-center justify-content-center">'
                            + (checked ? '<i class="la la-check-circle icon-lg text-success"></i>' : '<i class="la la-ban icon-lg text-danger"></i>')
                            + '</p>';
                        if (!checked) text += '<p style="font-size: small;" class="text-danger">(Tin thuộc CSKH khác)</p>';
                        return text;
                    }
                },
            );
        }
        this.items = _.cloneDeep(this.articles) || [];
        this.items.forEach((item: any, index: number) => {
            item.Index = index + 1;
        });
        this.reloadItems(this.items);
    }

    view(item: any) {
        this.selected.emit(item);
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/mlarticle',
        };
        this.router.navigate(['/admin/mlarticle/view'], { state: { params: JSON.stringify(obj) } });
    }

    private renderAction() {
        if (this.items && this.items.length > 1) {
            let action = {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                hidden: (item: any) => {
                    return !this.items || this.items.length <= 1;
                },
                click: (item: any) => {
                    this.dialogService.Confirm('Bạn có chắc chắn muốn xóa tin đăng khỏi danh sách điều chuyển?', () => {
                        this.originalItems = this.originalItems.filter(c => c.Id != item.Id);
                        this.originalItems.forEach((item: any, index: number) => {
                            item.Index = index + 1;
                        });                        
                        this.items = this.items.filter(c => c.Id != item.Id);
                        this.items.forEach((item: MLArticleEntity, index: number) => {
                            item.Index = index + 1;
                        });
                        this.removed.emit(this.originalItems);
                    })
                }
            };
            if (this.obj.Actions.length == 0) this.obj.Actions.push(action);
        }
    }

    reloadItems(items: BaseEntity[]) {
        if (items && items.length > 0) {
            items.forEach((item: MLArticleEntity, index: number) => {
                item.Index = index + 1;
            });
        }
        this.items = items;
        this.renderAction();
        this.render(this.obj, this.items);
    }

    private quickViewArticle(item: any) {
        if (item.AccessType == MLArticleAccessType.Publish && item.Approved) {
            if (item.Path) {
                let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
                window.open(url, "_blank");
            } else {
                this.dialogService.Alert('Thông báo', 'Đường dẫn của tin đăng không tồn tại');
            }
        } else {
            let status = UtilityExHelper.formatArticleStatus(item.StatusType);
            let message = 'Tin đăng đang ở trạng thái: <b>' + status + '</b>';
            this.dialogService.Alert('Thông báo', message);
        }
    }
}