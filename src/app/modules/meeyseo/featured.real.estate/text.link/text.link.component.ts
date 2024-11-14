import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { MSSeoService } from '../../seo.service';
import { AppInjector } from '../../../../../app/app.module';
import { Component, OnInit, ViewChild } from "@angular/core";
import { TableData } from '../../../../_core/domains/data/table.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { FilterData } from '../../../../_core/domains/data/filter.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { MSStructureComponent } from '../components/structure.component';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MSPropertiesComponent } from '../components/properties.component';
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { EditConfigTextLinkComponent } from '../edit.config/edit.config.textlink.component';

@Component({
    templateUrl: './text.link.component.html',
    styleUrls: ['./text.link.component.scss'],
})
export class TextLinkComponent extends EditComponent implements OnInit {
    prevJson: string;
    allowEdit: boolean;
    idTextLink: string;
    maxTextLink: number;
    service: MSSeoService;
    event: AdminEventService;
    limitTextLinkAuto: number;
    limitTextLinkManual: number;
    title: string = 'THUỘC TÍNH';
    allowLoadStructure: boolean = true;
    subscribeLimitTextLink: Subscription;
    @ViewChild("gridStructure") gridStructure: MSStructureComponent;
    @ViewChild("gridProperties") gridProperties: MSPropertiesComponent;

    constructor(private dialog: AdminDialogService) {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.event = AppInjector.get(AdminEventService);
    }

    ngOnDestroy() {
        if (this.subscribeLimitTextLink) {
            this.subscribeLimitTextLink.unsubscribe();
            this.subscribeLimitTextLink = null;
        }
    }

    async ngOnInit(): Promise<void> {
        this.getconfig();
        if (this.router.url.indexOf('auto') >= 0) this.title = 'CÚ PHÁP';

        if (this.router.url.indexOf('auto') >= 0) {
            this.allowEdit = await this.authen.permissionAllow('msseotextlinkauto', ActionType.EditTextLink);
        } else {
            this.allowEdit = await this.authen.permissionAllow('msseotextlinkmanual', ActionType.EditTextLink);
        }

        // subscribe refreshItems
        if (!this.subscribeLimitTextLink) {
            this.subscribeLimitTextLink = this.event.RefreshLimitTextLink.subscribe(() => {
                this.getconfig();
            });
        }
    }

    async loadProperties(obj?: any) {
        if (obj) {
            let json = JSON.stringify(obj);
            if (json != this.prevJson) {
                this.prevJson = json;
                this.allowLoadStructure = false;
                await this.gridProperties.loadProperties(obj);
                setTimeout(() => {
                    this.allowLoadStructure = true;
                }, 2000);
            }
        }
    }
    loadStructures(data: TableData) {
        if (this.allowLoadStructure) {
            let filters: FilterData[] = _.cloneDeep(data.Filters) || [];
            if (data.Search) {
                filters.push({
                    Value: data.Search,
                    Name: 'FilterAnchorText',
                    Compare: CompareType.S_Equals
                });
            }
            this.gridStructure.filters(filters);
        }
    }

    async editconfig() {
        this.dialog.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                id: this.idTextLink,
                value: this.maxTextLink,
            },
            title: 'Chỉnh sửa',
            confirmText: 'Lưu lại',
            size: ModalSizeType.Small,
            object: EditConfigTextLinkComponent,
        }, async () => this.getconfig());
    }
    private getconfig() {
        this.service.callApi('MSHighlight', 'GetConfigSetting', null, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result) && result.Object && result.Object.data) {
                this.idTextLink = result.Object.data.config?._id;
                this.maxTextLink = result.Object.data.config?.value;
                this.limitTextLinkAuto = result.Object.data.maxLimitAuto;
                this.limitTextLinkManual = result.Object.data.maxLimitManual;
            }
        });
    }
}