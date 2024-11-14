declare var $;
import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { CompareType } from '../../../_core/domains/enums/compare.type';
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MLUserStatisticEntity } from "../../../_core/domains/entities/meeyland/ml.user.entity";
import { MLUserStatisticalSaleTutorialComponent } from './user.statistical.sale.tutorial/user.statistical.sale.tutorial.component';

@Component({
    styleUrls: ['./user.statistical.sale.component.scss'],
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLUserStatisticalSaleComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [
            {
                name: 'Excel',
                systemName: ActionType.Export,
                click: async () => {
                    this.loadingText = 'Đang xuất dữ liệu...';
                    this.loading = true;
                    this.tableToExcel();
                    this.loadingText = null;
                    this.loading = false;
                },
                icon: 'kt-nav__link-icon la la-file-excel-o',
            }
        ],
        Filters: [],
        Actions: [],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        UpdatedBy: false,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        ClassName: 'grid-user-statistic',
        Reference: MLUserStatisticEntity,
        SearchText: 'Nhập mã, điện thoại, email',
        Title: 'Thông kê khách hàng theo Nhân Viên',
        EmbedComponent: MLUserStatisticalSaleTutorialComponent,
        CustomFilters: ['DepartmentId', 'SaleIds', 'DateTime'],
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        // columns
        this.properties = [
            { Property: 'Index', Title: 'STT', Align: 'center' },
            { Property: 'Department', Title: 'Phòng ban' },
            { Property: 'FullName', Title: 'Nhân viên' },
            { Property: 'RefCode', Title: 'Mã giới thiệu', Align: 'center' },
            { Property: 'PhoneNumber', Title: 'SĐT', Align: 'center' },
            { Property: 'Email', Title: 'Email' },
            {
                Property: 'AdminCount', Title: 'Nguồn Meey-Admin', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text = '';
                    text += '<div class="yellow">' + item.AdminCount + '</div>';
                    text += '<div class="pink">' + item.AdminVerifiedCount + '</div>';
                    text += '<div class="red">' + item.AdminSignInCount + '</div>';
                    return text;
                }
            },
            {
                Property: 'AffiliateCount', Title: 'Nguồn Affiliate', Align: 'center',
                Format: (item: any) => {
                    let text = '';
                    text += '<div class="yellow">' + item.AffiliateCount + '</div>';
                    text += '<div class="gray">&nbsp;</div>';
                    text += '<div class="gray">&nbsp;</div>';
                    return text;
                }
            },
            {
                Property: 'IframeCount', Title: 'Nguồn Iframe', Align: 'center',
                Format: (item: any) => {
                    let text = '';
                    text += '<div class="yellow">' + item.IframeCount + '</div>';
                    if (item.IframeAffCount)
                        text += '<div class="yellowgreen">' + item.IframeAffCount + '</div>';
                    else
                        text += '<div class="yellowgreen">&nbsp;</div>';
                    text += '<div class="gray">&nbsp;</div>';
                    return text;
                }
            },
            { Property: 'Total', Title: 'Tổng ID', Align: 'center' },
        ];

        // set filter
        let date = new Date(),
            day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear();
        this.setFilter([{
            Name: 'DateTime',
            Compare: CompareType.D_Between,
            Value: new Date(year, month, 1),
            Value2: new Date(year, month, day),
        }]);

        // render
        await this.renderByUrl('/mLUser/statisticalForSale', this.obj);
    }

    private tableToExcel() {
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name) {
            table = $('.grid-user-statistic .grid-content .table')[0];
            var ctx = { worksheet: 'Thống kê Meey ID', table: table.innerHTML }
            window.location.href = uri + base64(format(template, ctx));
        }();
    }
}