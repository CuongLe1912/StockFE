import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { HttpEventType } from '@angular/common/http';
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { TableData } from '../../../../_core/domains/data/table.data';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ExportType } from '../../../../_core/domains/enums/export.type';
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { ActionType, ControllerType } from '../../../../_core/domains/enums/action.type';
import { MCRMCallManagementStaffEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.call.management.entity";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCallManagementStaffComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                controllerName: ControllerType.MCRMCallLog,
                click: () => {
                    if (this.itemData?.Paging?.Total > 50000) {
                        this.dialogService.Alert('Thông báo', 'File export tối đa 50 nghìn dòng!');
                        this.export();
                    } else this.export()
                },
            },
            ActionData.reload(() => this.loadItems())
        ],
        UpdatedBy: false,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        Reference: MCRMCallManagementStaffEntity,
        CustomFilters: ["OperatorId", "CallTime"]
    };

    constructor() {
        super();

        this.properties = [
            {
                Property: 'Index', Title: 'STT', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Star) {
                        text += '<h3><i class="la la-star" style="color: #eea200;"></i></h3>'
                    } else {
                        text += item.Index
                    }
                    return text;
                })
            },
            {
                Property: 'FullName', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.UserName) text += '<p>' + item.UserName + '</p>';
                    if (item.FullName) text += '<p>' + item.FullName + '</p>';
                    return text;
                })
            },
            {
                Property: 'Department', Title: 'Phòng ban', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Department) text += '<p>' + item.Department + '</p>';
                    return text;
                })
            },
            {
                Property: 'CallSuccess', Title: 'Số cuộc gọi thành công', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.CallSuccess) text += '<p>' + item.CallSuccess + '</p>';
                    return text;
                })
            },
            {
                Property: 'TimeCall', Title: 'Thời gian gọi', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.TimeCall) {
                        let totalCall = UtilityExHelper.toHourMinuteSecond(item.TimeCall);
                        text += '<p>' + totalCall + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'TotalCustomer', Title: 'Khách hàng đang chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.TotalCustomer) text += '<p>' + item.TotalCustomer + '</p>';
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        this.obj.Url = '/admin/MCRMCallLog/EmployeeItems';

        // fix filter
        this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'CallTime')) || [];
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
        this.itemData.Filters.push({
            Name: 'CallTime',
            Compare: CompareType.D_Between,
            Value: new Date(year, month, day),
            Value2: new Date(year, month, day, 23, 59, 59),
        });

        // render
        this.setPageSize(20);
        await this.render(this.obj);
    }

    loadComplete() {
        this.summaryText = 'Tổng thời gian: <b>' + UtilityExHelper.toHourMinuteSecond(this.itemTotal) + '</b>';
    }
    async export() {
        if (this.items && this.items.length > 0) {
            this.loading = true
            let objData: TableData = this.itemData;
            objData.Export = {
                Type: ExportType.Excel,
            }
            let urlExport = '/admin/MCRMCallLog/ExportDataEmployee';
            let fileName = "dsCuocGoi_" + new Date().getTime();
            return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
                this.loading = false
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        break;
                    case HttpEventType.Response:
                        let extension = 'xlsx';
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = fileName + '.' + extension;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
                return true;
            }).catch(ex => {
                this.loading = false
            });
        }
        else {
            ToastrHelper.Error('Không có dữ liệu xuất excel');
        }
    }
}