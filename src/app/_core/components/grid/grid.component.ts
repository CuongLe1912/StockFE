declare var $: any
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { AppInjector } from '../../../app.module';
import { EnumHelper } from '../../helpers/enum.helper';
import { validation } from '../../decorators/validator';
import { NavigationEnd, Router } from '@angular/router';
import { PipeType } from '../../domains/enums/pipe.type';
import { FileType } from '../../domains/enums/file.type';
import { FileEx } from '../../decorators/file.decorator';
import { ResultApi } from '../../domains/data/result.api';
import { TableData } from '../../domains/data/table.data';
import { AlignType } from '../../domains/enums/align.type';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { OrderType } from '../../domains/enums/order.type';
import { EntityHelper } from '../../helpers/entity.helper';
import { RegexType } from '../../domains/enums/regex.type';
import { VideoEx } from '../../decorators/video.decorator';
import { ImageEx } from '../../decorators/image.decorator';
import { UploadData } from '../../domains/data/upload.data';
import { FilterData } from '../../domains/data/filter.data';
import { PagingData } from '../../domains/data/paging.data';
import { ActionData } from '../../domains/data/action.data';
import { OptionItem } from '../../domains/data/option.item';
import { LookupData } from '../../domains/data/lookup.data';
import { MethodType } from '../../domains/enums/method.type';
import { DialogType } from '../../domains/enums/dialog.type';
import { ResultType } from '../../domains/enums/result.type';
import { ObjectEx } from '../../decorators/object.decorator';
import { MessageHelper } from '../../helpers/message.helper';
import { ExportType } from '../../domains/enums/export.type';
import { StringEx } from '../../decorators/string.decorator';
import { NumberEx } from '../../decorators/number.decorator';
import { ActionType } from '../../domains/enums/action.type';
import { SortingData } from '../../domains/data/sorting.data';
import { CompareType } from '../../domains/enums/compare.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { BooleanEx } from '../../decorators/boolean.decorator';
import { EditorComponent } from '../../editor/editor.component';
import { BaseEntity } from '../../domains/entities/base.entity';
import { PropertyData } from '../../domains/data/property.data';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { ValidatorHelper } from '../../helpers/validator.helper';
import { ProductionType } from '../../domains/enums/project.type';
import { AdminApiService } from '../../services/admin.api.service';
import { ModalSizeType } from '../../domains/enums/modal.size.type';
import { TabFilterType } from '../../domains/enums/tab.filter.type';
import { BreadcrumbData } from '../../domains/data/breadcrumb.data';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminAuthService } from '../../services/admin.auth.service';
import { HistoryComponent } from '../edit/history/history.component';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminEventService } from '../../services/admin.event.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { NavigationStateData } from '../../domains/data/navigation.state';
import { DialogAutoData, DialogData } from '../../domains/data/dialog.data';
import { PagingPositionType } from '../../domains/enums/paging.position.type';
import { DateTimeEx, DateTimeFormat } from '../../decorators/datetime.decorator';
import { RequestFilterEntity } from '../../domains/entities/request.filter.entity';
import { RequestFilterComponent } from '../request.filter/request.filter.component';
import { ModalExportDataComponent } from '../../modal/export.data/export.data.component';
import { DataType, DateTimeType, DropdownLoadType, StringType } from '../../domains/enums/data.type';
import { GridData, GridFilterData, GridFormData, MoreActionData } from '../../domains/data/grid.data';
import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';

@Component({
    templateUrl: './grid.component.html'
})
export abstract class GridComponent {
    obj: GridData;
    router: Router;
    objFilter: any;
    objFilter2: any;
    typing: boolean;
    message: string;
    loading: boolean;
    itemTotal: number;
    checkAll: boolean;
    hasChild: boolean;
    itemEditable: any;
    location: Location;
    mergeCount: number;
    loadingText: string;
    items: BaseEntity[];
    checkedAll: boolean;
    DataType = DataType;
    summaryText: string;
    PipeType = PipeType;
    choiceFileItem: any;
    prepareForm: boolean;
    notMergeCount: number;
    selectedIds: number[];
    OrderType = OrderType;
    totalItem: BaseEntity;
    selectedCount: number;
    forms: GridFormData[];
    filterLength: number[];
    searchClicked: boolean;
    StringType = StringType;
    ActionType = ActionType;
    cloneItems: BaseEntity[];
    prepareFormAuto: boolean;
    inlineFilters: ObjectEx[];
    customFilters: ObjectEx[];
    properties: PropertyData[];
    statisticals?: OptionItem[];
    state: NavigationStateData;
    queryCustomFilter: boolean;
    originalItems: BaseEntity[];
    activeCustomFilter: boolean;
    DateTimeType = DateTimeType;
    activeChoiceColumn: boolean;
    moreFeatures: MoreActionData;
    activeRequestFilter: boolean;
    breadcrumbs: BreadcrumbData[];
    TabFilterType = TabFilterType;
    columnActiveAll: boolean = true;
    windowWidth = window.innerWidth;
    activeProperties: PropertyData[];
    editActiveProperties: ObjectEx[];
    pageOrSizeChange: boolean = false;
    originalProperties: PropertyData[];
    activeStatisticalComponent: boolean;
    subscribeRefreshGrids: Subscription;
    DropdownLoadType = DropdownLoadType;
    activeTotalProperties: PropertyData[];
    itemData: TableData = new TableData();
    requestFilters: RequestFilterEntity[];
    groupActiveProperties: PropertyData[];
    PagingPositionType = PagingPositionType;
    choiceFileOptions: ImageEx | FileEx | VideoEx;

    @Input() params: any;
    @ViewChild('fileInput') fileInput: ElementRef;
    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() requestCompleted: EventEmitter<ResultApi> = new EventEmitter<ResultApi>();

    // Service
    event: AdminEventService;
    authen: AdminAuthService;
    service: AdminApiService;
    dataService: AdminDataService;
    dialogService: AdminDialogService;

    boolFilterTypes: OptionItem[] = [];
    numberFilterTypes: OptionItem[] = [];
    stringFilterTypes: OptionItem[] = [];
    foreignFilterTypes: OptionItem[] = [];
    datetimeFilterTypes: OptionItem[] = [];
    private subItemFilterSearchChanged: Subscription;
    private componentFactoryResolver: ComponentFactoryResolver;
    private itemFilterSearchChanged: Subject<string> = new Subject();

    componentInstance: any;
    componentRef: ComponentRef<any>;
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    componentEmbedInstance: any;
    componentEmbedRef: ComponentRef<any>;
    @ViewChildren('upload') uploads: QueryList<EditorComponent>;
    @ViewChild('containerEmbed', { read: ViewContainerRef }) containerEmbed: ViewContainerRef;
    @ViewChildren('containerChilds', { read: ViewContainerRef }) containerChilds: QueryList<ViewContainerRef>;
    @ViewChildren('containerComponents', { read: ViewContainerRef }) containerComponents: QueryList<ViewContainerRef>;

    constructor() {
        this.router = AppInjector.get(Router);
        this.location = AppInjector.get(Location);
        this.event = AppInjector.get(AdminEventService);
        this.authen = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(AdminApiService);
        this.dataService = AppInjector.get(AdminDataService);
        this.dialogService = AppInjector.get(AdminDialogService);
        let compares = EnumHelper.exportCompareOptionItems(CompareType);
        this.componentFactoryResolver = AppInjector.get(ComponentFactoryResolver);
        compares.forEach((item: OptionItem) => {
            let newItem: OptionItem = _.cloneDeep(item);
            newItem.label = UtilityExHelper.createLabel(item.label.split('_')[1]);

            if (item.label.startsWith('B')) this.boolFilterTypes.push(newItem);
            else if (item.label.startsWith('N')) this.numberFilterTypes.push(newItem);
            else if (item.label.startsWith('S')) this.stringFilterTypes.push(newItem);
            else if (item.label.startsWith('F')) this.foreignFilterTypes.push(newItem);
            else if (item.label.startsWith('D')) this.datetimeFilterTypes.push(newItem);
        });

        this.state = this.getUrlState();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (this.breadcrumbs && this.breadcrumbs.length > 0)
                    return;
                this.breadcrumbs = [];
                var url = new URL(location.href);
                let currentUrl = url.pathname.replace('/edit', '').replace('/view', '') + '$';
                if (this.authen && this.authen.links && this.authen.links.length > 0) {
                    this.authen.links.forEach((group: any) => {
                        if (group.items && group.items.length > 0) {
                            group.items.forEach((item: any) => {
                                if (this.breadcrumbs.length == 0) {
                                    if (item.Childrens && item.Childrens.length > 0) {
                                        item.Childrens.forEach((child: any) => {
                                            let link = child.Link + '$';
                                            if (link != '/') {
                                                if (link == currentUrl) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name });
                                                    this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                } else if (currentUrl.indexOf(link) >= 0) {
                                                    let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                    if (!existChild) {
                                                        if (item.Group)
                                                            this.breadcrumbs.push({ Name: item.Group });
                                                        this.breadcrumbs.push({ Name: item.Name });
                                                        this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        let link = item.Link + '$';
                                        if (link != '/') {
                                            if (link == currentUrl) {
                                                if (item.Group)
                                                    this.breadcrumbs.push({ Name: item.Group });
                                                this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                            } else if (currentUrl.indexOf(link) >= 0) {
                                                let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                if (!existChild) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    back() {
        if (this.state)
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        else
            window.history.back();
    }

    addNew() {
        if (this.obj.Editable) {
            if (this.items && this.items.length > 0) {
                this.items.forEach((itm: BaseEntity) => {
                    itm.Editable = false;
                });
            }
            if (!this.items) this.items = [];
            this.itemEditable = EntityHelper.createEntity(this.obj.Reference);
            setTimeout(() => {
                var objDiv = document.getElementsByClassName("grid-content")[0];
                if (objDiv)
                    objDiv.scrollTop = objDiv.scrollHeight;
            }, 300);
        } else {
            this.prepareForm = true;
            setTimeout(() => {
                this.dialogService.Dialog({
                    object: null,
                    objectExtra: this.obj,
                    cancelFunction: () => {
                        this.prepareForm = false;
                    },
                    okFunction: () => {
                        this.loadItems();
                        this.prepareForm = false;
                    },
                    type: DialogType.AdminEdit,
                });
            }, 300);
        }
    }

    search() {
        if (this.itemData.Search) {
            this.itemData.Search = this.itemData.Search.trim();
        }
        this.searchClicked = true;
        if (!this.itemData.Paging)
            this.itemData.Paging = new PagingData();
        this.itemData.Paging.Index = 1;
        this.loadItems();
    }

    clearSearch() {
        setTimeout(() => {
            if (!this.typing) {
                this.searchClicked = false;
                if (!this.itemData.Search)
                    this.loadItems();
            }
        }, 500);
    }

    resetCache() {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Có phải bạn muốn xóa bộ nhớ tạm của toàn bộ dữ liệu này?', async () => {
                await this.service.resetCache(this.obj.ReferenceName).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success('Xóa bộ nhớ tạm thành công');
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    customFilter() {
        if (!this.queryCustomFilter) {
            this.beforeFilter();
            this.queryCustomFilter = true;
            setTimeout(() => this.queryCustomFilter = false, 500);
            if (this.customFilters && this.customFilters.length > 0) {
                let items: FilterData[] = _.cloneDeep(this.itemData.Filters || []);
                for (let i = 0; i < this.customFilters.length; i++) {
                    let obj = this.customFilters[i];
                    let value2 = this.objFilter2 && this.objFilter2[obj.property],
                        value = this.objFilter && this.objFilter[obj.property],
                        compareType = CompareType.S_Contains;
                    if (!obj.compareType) {
                        switch (obj.dataType) {
                            case DataType.Number: {
                                compareType = CompareType.N_Equals;
                                if (value && value2) {
                                    if ((Number(value) > Number(value2))) {
                                        this.dialogService.Alert('Thông báo', 'Dữ liệu tìm kiếm trường: ' + obj.label + ' không hợp lệ');
                                        this.loading = false;
                                        return;
                                    }
                                    compareType = CompareType.N_Between;
                                }
                                else if (value2)
                                    compareType = CompareType.N_LessThanOrEqual;
                                else if (value)
                                    compareType = CompareType.N_GreaterThanOrEqual;
                                if (value == null || value == undefined || value == '')
                                    value = null;
                            }; break;
                            case DataType.Boolean: {
                                compareType = CompareType.B_Equals;
                                if (value == null || value == undefined || value == '')
                                    value = null;
                            } break;
                            case DataType.String: {
                                if (value) {
                                    value = value.trim();
                                    while (value.indexOf('  ') >= 0)
                                        value = value.replace('  ', ' ');
                                }
                                compareType = CompareType.S_Contains;
                            } break;
                            case DataType.DropDown: {
                                if (typeof value == 'string') {
                                    compareType = CompareType.S_Equals;
                                    if (value) {
                                        value = value.trim();
                                        while (value.indexOf('  ') >= 0)
                                            value = value.replace('  ', ' ');
                                    }
                                    if (value == null || value == undefined || value == '')
                                        value = null;
                                } else if (Array.isArray(value)) {
                                    compareType = CompareType.S_Contains;
                                } else {
                                    compareType = CompareType.N_Equals;
                                    if (value == null || value == undefined || value == '')
                                        value = null;
                                }
                            } break;
                            case DataType.DateTime: {
                                let objDate = <DateTimeEx>obj;
                                compareType = CompareType.D_Between;
                                if (objDate.type == DateTimeType.DateMonth) {
                                    compareType = CompareType.S_Equals;
                                }
                                if (value == null || value == undefined || value == '')
                                    value = null;
                            } break;
                        }
                    } else compareType = obj.compareType;

                    let index = items.findIndex(c => c.Name == obj.property);
                    if (value != null && value != undefined) {
                        if (value2 != null && value2 != undefined) {
                            let itemFilter = { Value: value, Value2: value2, Name: obj.property, Compare: compareType }
                            if (index >= 0) items[index] = itemFilter;
                            else items.push(itemFilter);
                        } else {
                            let itemFilter = obj.dataType == DataType.DropDown
                                ? { Value: value, Name: obj.property, Compare: compareType }
                                : Array.isArray(value)
                                    ? { Value: value[0], Value2: value[1], Name: obj.property, Compare: compareType }
                                    : { Value: value, Name: obj.property, Compare: compareType };
                            if (index >= 0) items[index] = itemFilter;
                            else items.push(itemFilter);
                        }
                    } else if (value2 != null && value2 != undefined) {
                        let itemFilter = { Value: null, Value2: value2, Name: obj.property, Compare: compareType }
                        if (index >= 0) items[index] = itemFilter;
                        else items.push(itemFilter);
                    } else if (index >= 0) items.splice(index, 1);
                }
                this.searchClicked = true;
                if (!this.itemData.Paging)
                    this.itemData.Paging = new PagingData();
                this.itemData.Paging.Index = 1;
                this.filters(items);
            }
        }
    }

    beforeFilter(items: FilterData[] = null) {
        if (!this.itemData.Filters)
            this.itemData.Filters = [];
        if (items && items.length > 0) {
            items.forEach((item: FilterData) => {
                let index = this.itemData.Filters.findIndex(c => c.Name == item.Name);
                if (index >= 0)
                    this.itemData.Filters[index] = item;
                else
                    this.itemData.Filters.push(item);
            });
        }
    }

    inlineFilter() {
        if (this.inlineFilters && this.inlineFilters.length > 0) {
            let items: FilterData[] = _.cloneDeep(this.itemData.Filters || []);
            this.inlineFilters.forEach((obj: ObjectEx) => {
                let value = this.objFilter && this.objFilter[obj.property],
                    compareType = CompareType.S_Contains;
                switch (obj.dataType) {
                    case DataType.Number: compareType = CompareType.N_Equals; break;
                    case DataType.Boolean: compareType = CompareType.B_Equals; break;
                    case DataType.String: {
                        if (value) {
                            value = value.trim();
                            while (value.indexOf('  ') >= 0)
                                value = value.replace('  ', ' ');
                        }
                        compareType = CompareType.S_Contains;
                    } break;
                    case DataType.DropDown: {
                        if (typeof value == 'string') {
                            compareType = CompareType.S_Equals;
                            if (value) {
                                value = value.trim();
                                while (value.indexOf('  ') >= 0)
                                    value = value.replace('  ', ' ');
                            }
                        } else if (Array.isArray(value)) {
                            compareType = CompareType.S_Contains;
                        } else compareType = CompareType.N_Equals;
                    } break;
                    case DataType.DateTime: {
                        let objDate = <DateTimeEx>obj;
                        compareType = CompareType.D_Between;
                        if (objDate.type == DateTimeType.DateMonth) {
                            compareType = CompareType.S_Equals;
                        }
                    } break;
                }

                let index = items.findIndex(c => c.Name == obj.property);
                if (value) {
                    let itemFilter = obj.dataType == DataType.DropDown
                        ? { Value: value, Name: obj.property, Compare: compareType }
                        : Array.isArray(value)
                            ? { Value: value[0], Value2: value[1], Name: obj.property, Compare: compareType }
                            : { Value: value, Name: obj.property, Compare: compareType };
                    if (index >= 0) items[index] = itemFilter;
                    else items.push(itemFilter);
                } else if (index >= 0) items.splice(index, 1);
            });
            if (!this.itemData.Paging)
                this.itemData.Paging = new PagingData();
            this.itemData.Paging.Index = 1;
            this.filters(items);
        }
    }

    delete(id: any) {
        if (typeof (id) == 'object') {
            id = id.Id;
        }
        if (this.obj && this.obj.Reference) {
            this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu này?', () => {
                this.service.delete(this.obj.ReferenceName, id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    loadComplete() {
    }

    checkAllChange() {
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: BaseEntity) => {
                item.Checked = item.Checkable ? this.checkAll : false;
                this.addToChecked(item);
            });

            let count = this.originalItems.filter(c => c.Checked).length;
            this.eventCheckChange(count);
            this.selectedCount = count;
        }
    }

    async loadItems() {
        if (!this.searchClicked) this.itemData.Search = null;
        if (this.obj && this.obj.Reference) {
            this.loading = true;
            this.checkAll = false;
            //this.checkAllChange();
            if (this.obj.IgnoreIds) this.itemData.IgnoreIds = this.obj.IgnoreIds;
            if (this.obj.FilterData && this.obj.FilterData.length > 0) {
                this.obj.FilterData.forEach((filter: FilterData) => {
                    if (!this.itemData.Filters) this.itemData.Filters = [];
                    let filterDb = this.itemData.Filters.find(c => c.Name == filter.Name);
                    if (!filterDb) {
                        this.itemData.Filters.push(filter);
                    }
                });
            }
            this.loadingText = 'Đang tải dữ liệu...';
            let pageSize = this.pageOrSizeChange ? this.itemData.Paging?.Size : (this.getParam('pageSize') || this.itemData.Paging?.Size),
                pageIndex = this.pageOrSizeChange ? this.itemData.Paging?.Index : (this.getParam('pageIndex') || this.itemData.Paging?.Index);
            if (pageIndex || pageSize) {
                if (!this.itemData.Paging)
                    this.itemData.Paging = new PagingData();
                if (pageSize) this.itemData.Paging.Size = parseInt(pageSize);
                if (pageIndex) this.itemData.Paging.Index = parseInt(pageIndex);
            }
            await this.service.items(this.itemData, this.obj.Url).then((result: ResultApi) => {
                this.requestCompleted.emit(result);
                if (result && result.Type == ResultType.Success) {
                    if (result.ObjectExtra)
                        this.itemData = result.ObjectExtra as TableData || new TableData();
                    this.renderItems(result.Object, result.ObjectStatistical);
                    this.itemTotal = result.Total;
                    this.storeItemData();

                    // fix pagging
                    if (this.itemData && !this.obj.IsPopup) {
                        let size = this.itemData?.Paging?.Size || 20,
                            index = this.itemData?.Paging?.Index || 1;
                        var url = new URL(location.href);
                        if (url.searchParams.has('pageSize'))
                            url.searchParams.set('pageSize', size.toString());
                        else url.searchParams.append('pageSize', size.toString());

                        if (url.searchParams.has('pageIndex'))
                            url.searchParams.set('pageIndex', index.toString());
                        else url.searchParams.append('pageIndex', index.toString());
                        let href = url.pathname + url.search;
                        this.location.go(href);
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                    this.message = result && result.Description;
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.message = MessageHelper.SystemWrong;
            });
        }
        this.loadComplete();
        this.renderEmbed();
    }

    onSearchBoxBlur() {
        let value = this.itemData.Search;
        if (value) {
            if (value) {
                value = value.trim();
                while (value.indexOf('  ') >= 0)
                    value = value.replace('  ', ' ');
            }
            this.itemData.Search = value;
        }
    }

    clickClearSearch() {
        this.itemData.Search = '';
        this.clearStorage();
        this.clearSearch();
    }

    saveRequestFilter() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Lưu bộ lọc',
            size: ModalSizeType.Small,
            title: 'Lưu thông tin bộ lọc',
            object: RequestFilterComponent,
            objectExtra: {
                controller: this.obj.ReferenceName,
                filter: JSON.stringify(this.itemData),
            },
        }, async () => this.loadRequestFilter());
    }

    autoCustomFilter(property: ObjectEx) {
        this.customFilterChange(property);
        if (this.obj.DisableAutoLoad)
            return;
        this.customFilter();
    }

    customFilterChange(property: ObjectEx) {

    }

    loadRequestFilter() {
        if (this.obj.ReferenceName) {
            this.service.requestByUrl('/admin/RequestFilter/MyRequestFilters?controller=' + this.obj.ReferenceName).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.requestFilters = result.Object;
                }
            });
        }
    }

    choiceColumnChange() {
        this.renderResize();
        this.renderActiveProperties(true);
        this.renderGroupActiveProperties();
        this.renderActiveTotalProperties();
        this.renderEditActiveProperties(true);

        // save
        this.storeItemData();
    }

    renderCustomFilter() {
        this.filterLength = [];
        let customFilters: ObjectEx[] = [];
        if (this.obj.CustomFilters && this.obj.CustomFilters.length > 0) {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            this.objFilter2 = _.cloneDeep(this.objFilter);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                properties = _.cloneDeep(properties);
                this.obj.CustomFilters.forEach((propertyFilter: string | GridFilterData) => {
                    if (typeof propertyFilter == 'string') {
                        let name = propertyFilter;
                        let property = properties.find(c => c.property == name);
                        if (property) {
                            property.allowClear = true;
                            customFilters.push(property);
                        }
                    } else {
                        let name = propertyFilter.Name;
                        let property: DropDownEx = properties.find(c => c.property == name);
                        if (property) {
                            property.allowClear = true;
                            let optionItems: OptionItem[] = [];
                            property.placeholder = propertyFilter.Placeholder;
                            if (propertyFilter.Types && propertyFilter.Types.length > 0) {
                                propertyFilter.Types.forEach((type: CompareType) => {
                                    let label: string;
                                    switch (type) {
                                        case CompareType.N_Equals: label = ' = '; break;
                                        case CompareType.N_LessThan: label = ' < '; break;
                                        case CompareType.N_NotEquals: label = ' != '; break;
                                        case CompareType.N_GreaterThan: label = ' > '; break;
                                        case CompareType.N_LessThanOrEqual: label = ' <= '; break;
                                        case CompareType.N_GreaterThanOrEqual: label = ' >= '; break;
                                    }
                                    optionItems.push({ value: type, label: label });
                                });
                            }
                            property.lookup = LookupData.ReferenceItems(optionItems);
                            if (propertyFilter.AllowClear != null && propertyFilter.AllowClear != undefined)
                                property.allowClear = propertyFilter.AllowClear;
                            customFilters.push(property);
                        }
                    }
                });
            }
        } else {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            this.objFilter2 = _.cloneDeep(this.objFilter);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                properties = _.cloneDeep(properties);
                customFilters = properties.filter(c => c.allowSearch);
            }
        }
        if (this.itemData && this.itemData.Filters) {
            this.itemData.Filters.forEach((item: FilterData) => {
                if (item.Name != 'IsActive' && item.Name != 'IsDelete') {
                    if (item.Value2) {
                        let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false),
                            property = properties.find(c => c.property == item.Name);
                        if (property && property.dataType == DataType.DateTime)
                            this.objFilter[item.Name] = [item.Value, item.Value2];
                        else {
                            if (item.Value) this.objFilter[item.Name] = item.Value;
                            this.objFilter2[item.Name] = item.Value2;
                        }
                    } else this.objFilter[item.Name] = item.Value;
                    this.activeCustomFilter = true;
                }
            });
        }

        if (customFilters && customFilters.length > 0) {
            customFilters.forEach((item: ObjectEx) => {
                if (item.dataType == DataType.DateTime) {
                    if ((<DateTimeEx>item).type != DateTimeType.DateMonth) {
                        (<DateTimeEx>item).format = DateTimeFormat.DMY;
                        (<DateTimeEx>item).type = DateTimeType.DateRange;
                    }
                } else if (item.dataType == DataType.String) {
                    let decoratorString: StringEx = item;
                    if (decoratorString.type == StringType.MultiText)
                        (<StringEx>item).type = StringType.Text;
                    else if (decoratorString.type == StringType.AutoGenerate)
                        (<StringEx>item).type = StringType.Text;
                } else if (item.dataType == DataType.Number) {

                }
            });
        }
        let length = customFilters && customFilters.length > 0
            ? 4 - customFilters.length % 4 - 1
            : 0;
        for (let i = 0; i < length; i++) {
            this.filterLength.push(i);
        }
        this.customFilters = customFilters;
    }

    renderInlineFilter() {
        let inlineFilters: ObjectEx[] = [];
        if (this.obj.InlineFilters && this.obj.InlineFilters.length > 0) {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            this.objFilter2 = _.cloneDeep(this.objFilter);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                properties = _.cloneDeep(properties);
                this.obj.InlineFilters.forEach((propertyFilter: string | GridFilterData) => {
                    if (typeof propertyFilter == 'string') {
                        let name = propertyFilter;
                        let property = properties.find(c => c.property == name);
                        if (property) {
                            property.allowClear = true;
                            inlineFilters.push(property);
                        }
                    } else {
                        let name = propertyFilter.Name;
                        let property: DropDownEx = properties.find(c => c.property == name);
                        if (property) {
                            property.allowClear = true;
                            let optionItems: OptionItem[] = [];
                            if (propertyFilter.Types && propertyFilter.Types.length > 0) {
                                propertyFilter.Types.forEach((type: CompareType) => {
                                    let label: string;
                                    switch (type) {
                                        case CompareType.N_Equals: label = ' = '; break;
                                        case CompareType.N_LessThan: label = ' < '; break;
                                        case CompareType.N_NotEquals: label = ' != '; break;
                                        case CompareType.N_GreaterThan: label = ' > '; break;
                                        case CompareType.N_LessThanOrEqual: label = ' <= '; break;
                                        case CompareType.N_GreaterThanOrEqual: label = ' >= '; break;
                                    }
                                    optionItems.push({ value: type, label: label });
                                });
                            }
                            property.lookup = LookupData.ReferenceItems(optionItems);
                            if (propertyFilter.AllowClear != null && propertyFilter.AllowClear != undefined)
                                property.allowClear = propertyFilter.AllowClear;
                            inlineFilters.push(property);
                        }
                    }
                });
                this.inlineFilters = inlineFilters;
            }
        }

        if (this.itemData && this.itemData.Filters) {
            this.itemData.Filters.forEach((item: FilterData) => {
                if (item.Name != 'IsActive' && item.Name != 'IsDelete') {
                    if (item.Value2) {
                        let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false),
                            property = properties.find(c => c.property == item.Name);
                        if (property && property.dataType == DataType.DateTime)
                            this.objFilter[item.Name] = [item.Value, item.Value2];
                        else {
                            if (item.Value) this.objFilter[item.Name] = item.Value;
                            this.objFilter2[item.Name] = item.Value2;
                        }
                    } else this.objFilter[item.Name] = item.Value;
                }
            });
        }
    }

    async editedConfirm() {
        UtilityExHelper.clearSelectElement();
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            if (await validation(this.itemEditable)) {
                this.loading = true;
                this.loadingText = 'Đang lưu dữ liệu...';
                let properties = this.editActiveProperties;
                for (let i = 0; i < properties.length; i++) {
                    let property: ObjectEx = properties[i];
                    if (property.dataType == DataType.Image ||
                        property.dataType == DataType.Video ||
                        property.dataType == DataType.File) {
                        let multiple: boolean = property['multiple'];
                        for (let j = 0; j < this.uploads.length; j++) {
                            const upload = this.uploads.toArray()[j];
                            if (upload.property == property.property) {
                                let files = await upload.upload();
                                if (multiple) {
                                    this.itemEditable[upload.property] = files && files.length > 0
                                        ? files.map(c => { return c.Path })
                                        : null;
                                } else {
                                    this.itemEditable[upload.property] = files && files.length > 0
                                        ? files[0].Path || files[0].Base64Data || files[0].ByteData
                                        : null;
                                }
                            }
                        }
                    }
                }
                this.service.save(table.name, this.itemEditable).then(async (result: ResultApi) => {
                    this.loading = false;
                    if (ResultApi.IsSuccess(result)) {
                        let message = (this.itemEditable.Id ? 'Sửa ' : 'Thêm mới ') + this.obj.Title.toLowerCase() + ' thành công';
                        ToastrHelper.Success(message);
                        this.itemEditable = null;
                        await this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            }
        }
    }

    view(item: BaseEntity) {
        this.prepareForm = true;
        setTimeout(() => {
            this.dialogService.Dialog({
                object: item.Id,
                objectExtra: this.obj,
                cancelFunction: () => {
                    this.prepareForm = false;
                },
                okFunction: () => {
                    this.loadItems();
                    this.prepareForm = false;
                },
                type: DialogType.AdminView,
            });
        }, 300);
    }

    edit(item: BaseEntity) {
        if (this.obj.Editable) {
            if (this.items && this.items.length > 0) {
                this.items.forEach((itm: BaseEntity) => {
                    itm.Editable = false;
                });
            }
            this.itemEditable = null;
            if (item.Id && item.Id < 999999999) {
                this.service.item(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        item.Editable = true;
                        this.itemEditable = EntityHelper.createEntity(this.obj.Reference, result.Object);
                    } else ToastrHelper.ErrorResult(result);
                });
            } else {
                item.Editable = true;
                this.itemEditable = EntityHelper.createEntity(this.obj.Reference, item);
            }
        } else {
            this.prepareForm = true;
            setTimeout(() => {
                this.dialogService.Dialog({
                    object: item.Id,
                    objectExtra: this.obj,
                    cancelFunction: () => {
                        this.prepareForm = false;
                    },
                    okFunction: () => {
                        this.loadItems();
                        this.prepareForm = false;
                    },
                    type: DialogType.AdminEdit,
                });
            }, 300);
        }
    }

    editValueChange(item: any, column: ObjectEx) {
        let property = this.properties.find(c => c.Property == column.property || c.EditProperty == column.property);
        if (property && property.ValueChange) {
            property.ValueChange(item);
        }
    }

    renderItems(items: any, statisticals: any = null) {
        try {
            this.items = items;
            if (this.items) {
                this.items.forEach((item: BaseEntity) => {
                    if (!item.Id)
                        item.Id = parseInt(UtilityExHelper.randomNumber(10));
                });
            }
            this.cloneItems = _.cloneDeep(items);
            if (!this.originalItems) this.originalItems = [];
            if (this.cloneItems && this.cloneItems.length > 0) {
                this.cloneItems.forEach((item: BaseEntity) => {
                    let exists = this.originalItems.findIndex(c => c.Id == item.Id);
                    if (exists == -1)
                        this.originalItems.push(item);
                    else
                        this.originalItems[exists] = item;
                });
            }

            // auto correct properties
            if (this.properties && this.properties.length > 0) {
                this.properties.forEach((item: PropertyData) => {
                    if (!item.Type) {
                        item.Type = DataType.String;
                        if (item.Property == 'Id')
                            item.Type = DataType.Number;
                    }
                });
            }

            this.originalProperties = this.properties && _.cloneDeep(this.properties);
            this.hasChild = this.items && this.items.findIndex(c => c['HasChild']) >= 0;
            if (this.items && this.items.length > 0) {
                let item = this.items[0],
                    properties = Object.keys(item),
                    ignoreProperties = ['CreatedDate', 'UpdatedDate', 'CreatedBy', 'UpdatedBy', 'IsActive', 'IsDelete'];
                if (!this.properties) {
                    this.properties = [];
                    properties.forEach((propertyItem: string) => {
                        if (ignoreProperties.indexOf(propertyItem) >= 0)
                            return;
                        if (propertyItem != 'Id' && propertyItem.endsWith('Id')) {
                            let propertyId = propertyItem.substring(0, propertyItem.length - 2);
                            if (properties.indexOf(propertyId) >= 0)
                                return;
                        }
                        let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem) ||
                            DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem + 'Id'),
                            title = UtilityExHelper.createLabel(propertyItem),
                            align = 'left';
                        if (property) {
                            title = UtilityExHelper.createLabel(property.label || propertyItem);
                            align = property.dataType == DataType.DateTime || property.dataType == DataType.Image
                                ? 'center'
                                : (property.dataType == DataType.Boolean
                                    ? ((<BooleanEx>property).lookup ? 'left' : 'center')
                                    : property.dataType == DataType.Number && property.property != 'Id'
                                        ? 'right'
                                        : 'left');
                        }
                        this.properties.push({
                            Title: title,
                            Align: align,
                            Property: propertyItem,
                            TabFilterType: TabFilterType.Basic,
                            AllowFilter: property?.allowFilter,
                            Type: property ? property.dataType : DataType.String,
                        });
                    });
                }

                // add active properties
                let decoratorProperties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
                if (!this.objFilter) {
                    this.objFilter = EntityHelper.createEntity(this.obj.Reference);
                    this.objFilter2 = _.cloneDeep(this.objFilter);
                }
                this.properties.forEach((propertyItem: PropertyData) => {
                    if (this.itemData.Columns && this.itemData.Columns.length > 0) {
                        if (this.itemData.Columns.includes(propertyItem.Property)) {
                            propertyItem.Active = true;
                        } else {
                            propertyItem.Active = false;
                        }
                    } else if (propertyItem.Active == null) {
                        propertyItem.Active = true;
                    }
                    if (!propertyItem.Title) {
                        let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property) ||
                            DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property + 'Id'),
                            title = UtilityExHelper.createLabel(property.label || propertyItem.Property);
                        propertyItem.Title = UtilityExHelper.createLabel(title);
                    }
                    if (propertyItem.AllowFilterInline) {
                        if (decoratorProperties && decoratorProperties.length > 0) {
                            decoratorProperties.forEach((item: ObjectEx) => {
                                if (item.property == propertyItem.Property) {
                                    propertyItem.ColumnFilter = item;
                                }
                            });
                        }
                    }
                });

                // render
                this.items.forEach((item: BaseEntity) => {
                    this.properties.forEach(async (propertyItem: PropertyData) => {
                        if (item.Checkable == null || item.Checkable == undefined)
                            item.Checkable = (!propertyItem.HideCheckbox || !propertyItem.HideCheckbox(item));
                        else if (propertyItem.HideCheckbox)
                            item.Checkable = !propertyItem.HideCheckbox(item);
                        if (propertyItem.Format) {
                            item[propertyItem.Property] = propertyItem.Format(item);
                            return;
                        } if (propertyItem.FormatAsync) {
                            item[propertyItem.Property] = await propertyItem.FormatAsync(item);
                            return;
                        } else {
                            let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property) ||
                                DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property + 'Id');
                            if (property) {
                                if (property.dataType == DataType.DropDown) {
                                    let propertyDropDown = <DropDownEx>property;
                                    if (propertyDropDown.lookup && propertyDropDown.lookup.items) {
                                        let optionItem = propertyDropDown.lookup.items.find(c => c.value == item[propertyDropDown.property]);
                                        if (optionItem) {
                                            item[propertyDropDown.property + '_Color'] = optionItem.color;
                                            item[propertyDropDown.property] = UtilityExHelper.createLabel(optionItem.label);
                                        }
                                    }
                                } else if (property.dataType == DataType.Boolean) {
                                    let propertyBoolean = <BooleanEx>property;
                                    if (propertyBoolean.lookup && propertyBoolean.lookup.items) {
                                        if (propertyItem.Format) {
                                            item[propertyItem.Property] = propertyItem.Format(item);
                                        } else {
                                            let values = item[propertyBoolean.property] && JSON.parse(item[propertyBoolean.property]) as any[];
                                            if (Array.isArray(values)) {
                                                if (values && values.length > 0) {
                                                    let valueString: string = '';
                                                    values.forEach((value: any) => {
                                                        let optionItem = propertyBoolean.lookup.items.find(c => c.value == value);
                                                        if (optionItem) {
                                                            valueString += valueString ? ', ' + optionItem.label : optionItem.label;
                                                        }
                                                        item[propertyBoolean.property + '_Text'] = valueString;
                                                    });
                                                }
                                            } else {
                                                let optionItem = propertyBoolean.lookup.items.find(c => c.value == item[propertyBoolean.property]);
                                                if (optionItem) {
                                                    item[propertyBoolean.property + '_Color'] = optionItem.color;
                                                    item[propertyBoolean.property] = UtilityExHelper.createLabel(optionItem.label);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    item.Checked = this.selectedIds && this.selectedIds.indexOf(item.Id) >= 0;
                });
                if (this.obj.Checkable) this.obj.Checkable = this.items.find(c => c.Checkable)?.Checkable;
            } else {
                // add active properties
                let decoratorProperties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
                if (!this.objFilter) {
                    this.objFilter = EntityHelper.createEntity(this.obj.Reference);
                    this.objFilter2 = _.cloneDeep(this.objFilter);
                }
                this.properties.forEach((propertyItem: PropertyData) => {
                    if (propertyItem.Align) {
                        if (propertyItem.Align == AlignType.Left) propertyItem.Align = 'left';
                        else if (propertyItem.Align == AlignType.Right) propertyItem.Align = 'right';
                        else if (propertyItem.Align == AlignType.Center) propertyItem.Align = 'center';
                    }
                    if (this.itemData.Columns && this.itemData.Columns.length > 0) {
                        if (this.itemData.Columns.includes(propertyItem.Property)) {
                            propertyItem.Active = true;
                        } else {
                            propertyItem.Active = false;
                        }
                    } else if (propertyItem.Active == null) {
                        propertyItem.Active = true;
                    }
                    if (!propertyItem.Title) {
                        let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property) ||
                            DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property + 'Id'),
                            title = UtilityExHelper.createLabel(property.label || propertyItem.Property);
                        propertyItem.Title = UtilityExHelper.createLabel(title);
                    }
                    if (propertyItem.AllowFilterInline) {
                        if (decoratorProperties && decoratorProperties.length > 0) {
                            decoratorProperties.forEach((item: ObjectEx) => {
                                if (item.property == propertyItem.Property) {
                                    propertyItem.ColumnFilter = item;
                                }
                            });
                        }
                    }
                });

                if (this.itemData && this.itemData.Search) {
                    let check = RegexType.TextNoSpecial.test(String(this.itemData.Search).toLowerCase());
                    if (!check) {
                        this.message = 'Hiện tại không có dữ liệu nào phù hợp cho từ khóa bạn tìm kiếm';
                    } else this.message = 'Hiện tại không có dữ liệu nào phù hợp cho từ khóa: ' + this.itemData.Search
                } else this.message = 'Hiện tại không có dữ liệu nào phù hợp';
            }

            // render statisticals
            if (statisticals) {
                let keys = Object.keys(statisticals);
                if (keys && keys.length > 0) {
                    this.statisticals = [];
                    keys.forEach((key: string) => {
                        let option: OptionItem = {
                            label: key,
                            value: statisticals[key]
                        };
                        this.statisticals.push(option);
                    });
                }
            }

            this.renderSelectedCount();
            this.renderActiveProperties();
            this.renderEditActiveProperties();
            this.renderGroupActiveProperties();
            this.renderActiveTotalProperties();
            if (this.obj.ItemComponent)
                this.renderItemComponent(this.items);

            // asyn load
            if (this.obj.AsynLoad) this.obj.AsynLoad();
        } catch {
        }
    }

    choiceColumnAllChange() {
        this.properties.forEach((property) => {
            property.Active = this.columnActiveAll;
        })
        this.choiceColumnChange();
    }

    trash(item: BaseEntity) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Có phải bạn muốn <b>' + (item.IsDelete ? 'khôi phục' : 'xóa') + '</b> dữ liệu này?', async () => {
                await this.service.trash(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success((item.IsDelete ? 'Khôi phục ' : 'Xóa ') + this.obj.Title.toLowerCase() + ' thành công');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    active(item: BaseEntity) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Có phải bạn muốn <b>' + (item.IsActive ? 'gỡ xuống' : 'xuất bản') + '</b> dữ liệu này?', async () => {
                await this.service.active(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success((item.IsDelete ? 'Gỡ xuống ' : 'Xuất bản ') + this.obj.Title.toLowerCase() + ' thành công');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    public closeFilterMenu() {
        if (this.properties && this.properties.length > 0) {
            this.properties.forEach((item: PropertyData) => {
                item.ActiveFilter = false;
            });
        }
    }

    toggleSubTable(item: any) {
        if (item['ActiveChild'])
            item['ActiveChild'] = false;
        else {
            item['ActiveChild'] = true;
            this.renderSubTable(item);
        }
    }

    renderSubTable(item: any) {

    }

    viewForm(obj: GridFormData) {
        if (!this.forms)
            this.forms = [];

        let objDb = this.forms.find(c => c.Item.Id == obj.Item.Id);
        if (!objDb) this.forms.push(obj);
    }

    onSearchBoxKeypress(e: any) {
        this.typing = true;
        let input = e.target,
            val = input.value,
            end = input.selectionEnd;
        if (e.keyCode == 32 && (val[end - 1] == " " || val[end] == " ")) {
            return false;
        }
        this.typing = false;
    }

    public readFile(item: any, resultUpload: any[]) {
        this.loadItems();
    }

    getFilterValue(name: string) {
        return this.objFilter && this.objFilter[name]
    }

    sort(property: PropertyData) {
        if (this.obj && this.obj.Reference) {
            if (property.DisableOrder) return;
            if (!this.itemData) this.itemData = new TableData();
            if (!this.itemData.Orders) this.itemData.Orders = [];
            if (!this.itemData.Paging) this.itemData.Paging = new PagingData();
            let order = this.itemData.Orders.find(c => c.Name == property.Property);
            let orderType = order && order.Type && order.Type == OrderType.Asc
                ? OrderType.Desc
                : OrderType.Asc;
            this.itemData.Orders = [{
                Type: orderType,
                Name: property.Property,
            }];
            this.itemData.Paging.Index = 1;
            this.properties.forEach((property: PropertyData) => {
                property.Order = null;
            });
            property.Order = orderType;
            this.loadItems();
        }
    }

    public choiceFile(item: any, options: ImageEx | FileEx | VideoEx) {
        this.choiceFileItem = item;
        this.choiceFileOptions = options;
        if (options) {
            if (!options.size) options.size = 10;
            if (!options.totalSize) options.totalSize = 1000;
            if (!options.dataType) options.dataType = DataType.Image;
            if (!options.max) options.max = options.multiple ? 50 : 1;
            switch (options.dataType) {
                case DataType.Image: {
                    if (!options.accept) options.accept = 'image/jpg,image/jpeg,image/png';
                    if (!options.description) options.description = 'Định dạng: png, jpg, jpeg...';
                } break;
                case DataType.Video: {
                    if (!options.description) options.description = 'Định dạng: mpeg, mp4, avi, webm...';
                    if (!options.accept) options.accept = 'video/mpeg, video/ogg, video/webm, video/3gb, video/mp4, video/avi, video/wmv, video/vob, video/mkv, video/flv, video/wmv9';
                } break;
                case DataType.File: {
                    if (!options.description) options.description = 'Định dạng: pdf, doc, xls, zip...';
                    if (!options.accept) options.accept = 'image/jpg,image/jpeg,image/png,image/gif,image/svg+xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,application/xml,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed';
                } break;
            }
            if (options.accept)
                this.fileInput.nativeElement.setAttribute('accept', options.accept);
            if (options.multiple)
                this.fileInput.nativeElement.setAttribute('multiple', true);
            else
                this.fileInput.nativeElement.removeAttribute('multiple');
        }
        this.fileInput.nativeElement.click();
    }

    public async selectedFile(event: any) {
        this.loading = true;
        let resultUploads = [];
        let files = event.srcElement.files;
        if (files && files.length > 0) {
            let type = FileType.Image;
            if (this.choiceFileOptions.dataType == DataType.File)
                type = FileType.File;
            else if (this.choiceFileOptions.dataType == DataType.Video)
                type = FileType.Video;

            //valid
            let valid = true;
            if (type == FileType.Image) {
                valid = await ValidatorHelper.validImages(files, this.choiceFileOptions, this.fileInput, this.dialogService);
            } else if (type == FileType.File) {

            } else if (type == FileType.Video) {

            }

            if (!valid) {
                this.loading = false;
                return;
            }

            // upload file
            for (var i = 0; i < files.length; i++) {
                let file = files[i]
                let obj: UploadData = {
                    data: file,
                    type: type,
                    processFunction: (percent: number) => {
                        this.loadingText = 'Đang tải lên...' + percent + '%';
                    }
                };
                await this.service.customUpload(this.choiceFileOptions.customUpload, obj).then(async (result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        resultUploads.push(result.Object);
                    }
                }, () => {
                    this.loading = false;
                });
            }
            this.loading = false;
            this.fileInput.nativeElement.value = '';
            this.readFile(this.choiceFileItem, resultUploads);
        }
    }

    async pageChanged(page: PagingData) {
        if (!this.itemData)
            this.itemData = new TableData();
        this.pageOrSizeChange = true;
        this.itemData.Paging = page;
        await this.loadItems();

        // scroll
        setTimeout(() => {
            this.pageOrSizeChange = false;
            $('.grid-content').animate({ scrollTop: 0 }, "fast");
        }, 300);
    }

    setFilter(items: FilterData[]) {
        if (!this.itemData)
            this.itemData = new TableData();
        this.itemData.Filters = items;
    }

    setOrder(items: SortingData[]) {
        this.itemData.Orders = items;
    }

    setPageSize(size: number = 20) {
        if (!this.itemData.Paging)
            this.itemData.Paging = new PagingData();
        this.itemData.Paging.Size = size;
        this.storeItemData();
    }

    syncItems(type: ProductionType) {
        let ids = this.originalItems.filter(c => c.Checked).map(c => c.Id);
        if (ids && ids.length > 0) {
            let obj = {
                Ids: ids,
                Type: type,
            };
            this.loading = true;
            let enviroment = type == ProductionType.Stag
                ? 'STAG'
                : 'PROD';
            this.loadingText = 'Đang đồng bộ ' + enviroment + '...';
            this.service.callApi(this.obj.ReferenceName, 'CopyTo', obj, MethodType.Post).then((result: ResultApi) => {
                this.loading = false;
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Đồng bộ thành công cho môi trường ' + enviroment);
                } else ToastrHelper.ErrorResult(result);
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn ít nhất một phần tử để đồng bộ');
    }

    rowDoubleClick(item: BaseEntity) {
        //this.view(item);
    }

    toggleActiveStatisticalComponent() {
        this.activeStatisticalComponent = !this.activeStatisticalComponent;
        if (this.activeStatisticalComponent) {
            this.renderStatistical();
        }
    }

    async onScroll(item: PropertyData) {
        if (!item.LoadingFilter && item.AllowLoadMore) {
            item.PageIndex += 1;
            await this.loadItemFilter(item);
        }
    }

    clearSignleCustomeFilter(value: any) {
        if (!value) this.customFilter();
    }

    columlClick(e: any, item: BaseEntity) {
        let routerLink = e.target.attributes.routerlink || e.target.parentElement.attributes.routerlink;
        if (routerLink && routerLink.value) {
            let type = e.target.attributes.type || e.target.parentElement.attributes.type;
            if (routerLink.value.indexOf('quickView') >= 0) this.quickView(item, type && type.value);
            else if (routerLink.value.indexOf('view') >= 0) this.view(item);
            else if (routerLink.value.indexOf('copy') >= 0) {
                e.target.parentElement.attributes.tooltip.value = 'Đã sao chép';
                UtilityExHelper.copyString(e.target.parentElement.attributes.data.value);
            }
        }
    }

    cellClick(column: PropertyData, item: any) {
        if (column.Click) {
            this.items.forEach(c => c["rowClicked"] = false);
            item.rowClicked = true;
            column.Click(item);
        }
    }

    deleteRequestFilter(item: BaseEntity) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Có phải bạn muốn xóa bộ lọc này?', async () => {
                await this.service.trash('RequestFilter', item.Id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success('Xóa bộ lọc thành công');
                        this.requestFilters = this.requestFilters.filter(c => c.Id != item.Id);
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    filterChoiceColumn(item: PropertyData) {
        return item.Active;
    }

    checkChange(evt: any, item: BaseEntity) {
        item.Checked = evt.target.checked;
        this.addToChecked(item);

        let count = this.originalItems.filter(c => c.Checked).length;
        this.eventCheckChange(count);
        this.selectedCount = count;
    }

    toggleCheckChange(item: BaseEntity) {
        if (item.Checkable) {
            item.Checked = !item.Checked;
            this.addToChecked(item);

            let count = this.originalItems.filter(c => c.Checked).length;
            this.eventCheckChange(count);
            this.selectedCount = count;
        }
    }

    quickView(item: BaseEntity, type: string) {

    }

    async filters(items?: FilterData | FilterData[]) {
        if (!this.itemData) this.itemData = new TableData();
        this.itemData.Filters = items && Array.isArray(items)
            ? items as FilterData[]
            : items ? [items as FilterData] : null;
        await this.loadItems();
    }

    checkRadioChange(evt: any, item: BaseEntity) {
        this.items.forEach((itm: BaseEntity) => {
            itm.Checked = false;
        });
        item.Checked = evt.target.checked;
        this.addToCheckedRadio(item);

        let count = this.originalItems.filter(c => c.Checked).length;
        this.eventCheckChange(count);
        this.selectedCount = count;
    }

    viewHistory(id: number, controller?: string) {
        if (!controller) {
            controller = this.obj.ReferenceName;
        }
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            object: HistoryComponent,
            title: 'Nhật ký hoạt động',
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: id, type: controller },
        });
    }

    clearCustomFilter(callFilter: boolean = true) {
        this.customFilters.forEach((item: ObjectEx) => {
            if (item.allowClear) {
                this.objFilter[item.property] = null;
                if (this.objFilter2)
                    this.objFilter2[item.property] = null;
            }
        });
        //this.objFilter = EntityHelper.createEntity(this.obj.Reference);
        //this.objFilter2 = _.cloneDeep(this.objFilter);
        this.itemData.Search = '';
        this.itemData.Orders = null;
        if (this.properties) {
            this.properties.forEach((item: PropertyData) => {
                item.Order = null;
            });
        }
        if (callFilter) this.customFilter();
    }

    filterByRequestFilter(item: RequestFilterEntity) {
        this.activeRequestFilter = false;
        if (item && item.FilterData) {
            let data: TableData = JSON.parse(item.FilterData);
            if (data && data.Filters) {
                this.clearCustomFilter(false); this.filters(data.Filters);
                if (this.itemData && this.itemData.Filters) {
                    this.itemData.Filters.forEach((item: FilterData) => {
                        if (item.Name != 'IsActive' && item.Name != 'IsDelete') {
                            if (item.Value2) {
                                let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false),
                                    property = properties.find(c => c.property == item.Name);
                                if (property && property.dataType == DataType.DateTime)
                                    this.objFilter[item.Name] = [item.Value, item.Value2];
                                else {
                                    if (item.Value) this.objFilter[item.Name] = item.Value;
                                    this.objFilter2[item.Name] = item.Value2;
                                }
                            } else this.objFilter[item.Name] = item.Value;
                            this.activeCustomFilter = true;
                        }
                    });
                }
            }
        }
    }

    async render(obj: GridData, items?: BaseEntity[], statisticals: any = null) {
        this.obj = obj;
        if (this.obj && this.obj.Reference) {
            if (!this.obj.Filters) {
                this.obj.Filters = [];
                this.obj.Filters.push({
                    name: 'Nháp',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters({
                            Value: false,
                            Name: "IsActive",
                            Compare: CompareType.B_Equals
                        });
                    },
                    icon: 'kt-nav__link-icon la la-recycle',
                });
                this.obj.Filters.push({
                    name: 'Mặc định',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters();
                    },
                    icon: 'kt-nav__link-icon la la-skyatlas',
                });
                this.obj.Filters.push({
                    name: 'Thùng rác',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters({
                            Value: true,
                            Name: "IsDelete",
                            Compare: CompareType.B_Equals
                        });
                    },
                    icon: 'kt-nav__link-icon la la-trash',
                });
            }

            if (!this.obj.ReferenceName) {
                let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                this.obj.ReferenceName = table.name.toLowerCase();
            }

            let allowExport = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Export);
            if (allowExport) {
                if (!this.obj.Exports) {
                    this.obj.Exports = [];
                    this.obj.Exports.push({
                        name: 'Excel',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                confirmText: 'Xuất dữ liệu',
                                title: 'Xuất dữ liệu [Excel]',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Excel,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-excel-o',
                    });
                    this.obj.Exports.push({
                        name: 'CSV',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                title: 'Xuất dữ liệu [CSV]',
                                confirmText: 'Xuất dữ liệu',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Csv,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-text-o',
                    });
                    this.obj.Exports.push({
                        name: 'PDF',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                title: 'Xuất dữ liệu [PDF]',
                                confirmText: 'Xuất dữ liệu',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Pdf,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-pdf-o',
                    });
                }
            } else {
                this.obj.Exports = [];
            }

            let allowImport = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Import);
            if (!allowImport) {
                this.obj.Imports = [];
            }

            if (this.obj.Editable) {
                this.obj.EditActions = [];
                let allowEdit = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Edit);
                if (allowEdit) {
                    this.obj.EditActions.push(ActionData.confirm(async (item: BaseEntity) => {
                        if (item)
                            item.Editable = false;
                        await this.editedConfirm();
                    }));
                }

                this.obj.EditActions.push(ActionData.cancel((item: BaseEntity) => {
                    if (item)
                        item.Editable = false;
                    this.itemEditable = null;
                }));
            }

            if (!this.obj.Actions) {
                this.obj.Actions = [];
                let allowEdit = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Edit);
                if (allowEdit) {
                    this.obj.Actions.push(ActionData.edit((item: any) => {
                        this.edit(item);
                    }));
                }
                let allowView = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.View);
                if (allowView) {
                    this.obj.Actions.push(ActionData.view((item: any) => {
                        this.view(item);
                    }));
                }
                // let allowPublish = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Publish);
                // if (allowPublish) {
                //     this.obj.Actions.push(ActionData.active((item: any) => {
                //         this.active(item);
                //     }));
                // }
                let allowDelete = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Delete);
                if (allowDelete) {
                    this.obj.Actions.push(ActionData.delete((item: any) => {
                        this.trash(item);
                    }));
                }
            } else {
                this.obj.Actions.forEach(async (item: ActionData) => {
                    item.controllerName = item.controllerName || this.obj.ReferenceName;
                    let allow = item.systemName != ActionType.Empty
                        ? await this.authen.permissionAllow(item.controllerName, item.systemName)
                        : true;
                    if (!allow) {
                        this.obj.Actions = this.obj.Actions.filter(c => !(c.systemName.toLowerCase() == item.systemName.toLowerCase() && c.controllerName.toLowerCase() == item.controllerName.toLowerCase()));
                    }
                });

                let featureView = this.obj.Actions.find(c => c.systemName.toLowerCase() == ActionType.View.toLowerCase());
                if (featureView) {
                    let controllerName = featureView.controllerName || this.obj.ReferenceName;
                    let allowView = await this.authen.permissionAllow(controllerName, ActionType.View);
                    if (!allowView) {
                        this.obj.Actions = this.obj.Actions.filter(c => c.systemName.toLowerCase() != ActionType.View.toLowerCase())
                    }
                }

                let featureEdit = this.obj.Actions.find(c => c.systemName.toLowerCase() == ActionType.Edit.toLowerCase());
                if (featureEdit) {
                    let controllerName = featureEdit.controllerName || this.obj.ReferenceName;
                    let allowEdit = await this.authen.permissionAllow(controllerName, ActionType.Edit);
                    if (!allowEdit) {
                        this.obj.Actions = this.obj.Actions.filter(c => c.systemName.toLowerCase() != ActionType.Edit.toLowerCase())
                    }
                }

                let featureDelete = this.obj.Actions.find(c => c.systemName.toLowerCase() == ActionType.Delete.toLowerCase());
                if (featureDelete) {
                    let controllerName = featureDelete.controllerName || this.obj.ReferenceName;
                    let allowDelete = await this.authen.permissionAllow(controllerName, ActionType.Delete);
                    if (!allowDelete) {
                        this.obj.Actions = this.obj.Actions.filter(c => c.systemName.toLowerCase() != ActionType.Delete.toLowerCase())
                    }
                }
                // let allowPublish = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Publish);
                // if (!allowPublish) {
                //     this.obj.Actions = this.obj.Actions.filter(c => c.systemName.toLowerCase() != ActionType.Publish.toLowerCase());
                // }
            }

            if (!this.obj.Features) {
                this.obj.Features = [];
                let allowAdd = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AddNew);
                if (allowAdd) {
                    this.obj.Features.push(ActionData.addNew(() => {
                        this.addNew();
                    }));
                }
                this.obj.Features.push(ActionData.reload(() => {
                    this.loadItems();
                }));
            } else {
                this.obj.Features.forEach(async (item: ActionData) => {
                    item.controllerName = item.controllerName || this.obj.ReferenceName;
                    let allow = item.systemName != ActionType.Empty
                        ? await this.authen.permissionAllow(item.controllerName, item.systemName)
                        : true;
                    if (!allow) {
                        this.obj.Features = this.obj.Features.filter(c => !(c.systemName.toLowerCase() == item.systemName.toLowerCase() && c.controllerName.toLowerCase() == item.controllerName.toLowerCase()));
                    }
                });

                let featureAdd = this.obj.Features.find(c => c.systemName.toLowerCase() == ActionType.AddNew.toLowerCase());
                if (featureAdd) {
                    let controllerName = featureAdd.controllerName || this.obj.ReferenceName;
                    let allowAdd = await this.authen.permissionAllow(controllerName, ActionType.AddNew);
                    if (!allowAdd) {
                        this.obj.Features = this.obj.Features.filter(c => c.systemName.toLowerCase() != ActionType.AddNew.toLowerCase())
                    }
                }
            }

            if (this.obj.MoreActions) {
                this.obj.MoreActions.forEach(async (item: ActionData) => {
                    item.controllerName = item.controllerName || this.obj.ReferenceName;
                    let allow = item.systemName != ActionType.Empty
                        ? await this.authen.permissionAllow(item.controllerName, item.systemName)
                        : true;
                    if (!allow) {
                        this.obj.MoreActions = this.obj.MoreActions.filter(c => !(c.systemName.toLowerCase() == item.systemName.toLowerCase() && c.controllerName.toLowerCase() == item.controllerName.toLowerCase()));
                    }
                });
            }

            if (this.obj.MoreFeatures && this.obj.MoreFeatures.Actions) {
                this.obj.MoreFeatures.Actions.forEach(async (item: ActionData) => {
                    item.controllerName = item.controllerName || this.obj.ReferenceName;
                    let allow = item.systemName != ActionType.Empty
                        ? await this.authen.permissionAllow(item.controllerName, item.systemName)
                        : true;
                    if (!allow) {
                        this.obj.MoreFeatures.Actions = this.obj.MoreFeatures.Actions.filter(c => !(c.systemName.toLowerCase() == item.systemName.toLowerCase() && c.controllerName.toLowerCase() == item.controllerName.toLowerCase()));
                    }
                });
            }
            this.moreFeatures = this.obj.MoreFeatures;

            if (this.obj.UpdatedBy == null)
                this.obj.UpdatedBy = true;

            this.itemData = this.loadItemData();
            if (this.itemData.Search)
                this.searchClicked = true;
            this.itemData.Name = this.obj.ReferenceName;
            if (this.obj) {
                if (!this.obj.Title) {
                    let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                    this.obj.Title = table.title;
                }
                if (!this.obj.Size) this.obj.Size = ModalSizeType.Medium;
            }

            if (!items) await this.loadItems();
            else {
                this.renderItems(items, statisticals);
            }

            this.renderCustomFilter();
            this.renderInlineFilter();
            this.loadRequestFilter();
            this.renderResize();
            this.renderEmbed();
        }
    }

    async renderByForeign(foreignKeyId: number, obj: GridData, items?: BaseEntity[]) {
        if (!foreignKeyId) foreignKeyId = 0;
        if (obj && !obj.Url) {
            if (!this.obj.ReferenceName) {
                let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                this.obj.ReferenceName = table.name.toLowerCase();
            }
            obj.Url = '/admin/' + obj.ReferenceName.toLowerCase() + '/items/' + foreignKeyId;
        }
        await this.render(obj, items);
    }

    async renderByUrl(url: string, obj: GridData, items?: BaseEntity[], statisticals: any = null) {
        if (obj && !obj.Url) {
            if (!this.obj.ReferenceName) {
                let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                this.obj.ReferenceName = table.name.toLowerCase();
            }
            obj.Url = url.indexOf('admin/') >= 0
                ? url
                : '/admin/' + url;
            obj.Url = obj.Url.replace('//', '/');
        }
        await this.render(obj, items, statisticals);
    }

    public async toggleFilterMenu(property: PropertyData) {
        let active = !property.ActiveFilter;
        this.closeFilterMenu();
        property.ActiveFilter = active;
        if (!property.ItemFilters || property.ItemFilters.length == 0) {
            property.PageIndex = 1;
            property.ItemFilters = [];
            property.AllowLoadMore = true;
            property.LoadingFilter = false;
            property.ItemFiltersSearch = null;
            if (property.ActiveFilter) {
                this.loadItemFilter(property);
            }
        }
    }

    protected renderItemComponent(items: any[], params?: any) {
        setTimeout(() => {
            if (this.containerComponents && this.containerComponents.length > 0) {
                this.containerComponents.toArray().forEach((child: ViewContainerRef) => {
                    let id = child.element.nativeElement.id;
                    items.forEach((item: any) => {
                        if (id == 'component_template_' + (item.Id || item._id)) {
                            child.clear();
                            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.obj.ItemComponent);
                            let componentRef = child.createComponent(componentFactory);
                            let componentRefInstance = <any>componentRef.instance;
                            if (params)
                                componentRefInstance.params = params;
                            if (item)
                                componentRefInstance.item = item;
                            componentRef.changeDetectorRef.detectChanges();
                        }
                    });
                });
            }
        }, 300);
    }

    async itemFilterSearchChange(text: string, item: PropertyData) {
        this.itemFilterSearchChanged.next(text);
        if (!this.subItemFilterSearchChanged) {
            this.subItemFilterSearchChanged = this.itemFilterSearchChanged.pipe(
                debounceTime(500),
                distinctUntilChanged()
            ).subscribe(async (text: string) => {
                if (!item.LoadingFilter) {
                    item.PageIndex = 1;
                    item.ItemFilters = [];
                    item.AllowLoadMore = true;
                    item.ItemFiltersSearch = text;
                    await this.loadItemFilter(item, false);
                    item.LoadingFilter = false;
                }
            });
        }
    }

    public activeTabFilterMenu(property: PropertyData, type: TabFilterType) {
        property.TabFilterType = type;
    }

    protected renderSubTableComponent(item: any, component?: any, params?: any) {
        setTimeout(() => {
            if (this.containerChilds && this.containerChilds.length > 0) {
                this.containerChilds.toArray().forEach((child: ViewContainerRef) => {
                    let id = child.element.nativeElement.id;
                    if (id == 'child_template_' + (item.Id || item._id)) {
                        child.clear();
                        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
                        let componentRef = child.createComponent(componentFactory);
                        let componentRefInstance = <any>componentRef.instance;
                        if (params) componentRefInstance.params = params;
                        componentRef.changeDetectorRef.detectChanges();
                    }
                });
            }
        }, 300);
    }

    resetColumnsActive() {
        this.originalProperties.forEach((propertyItem: PropertyData) => {
            if (propertyItem.Active == null || propertyItem.Active) {
                propertyItem.Active = true;
            }
            this.properties.find(p => p.Property == propertyItem.Property).Active = propertyItem.Active;
        });

        this.choiceColumnChange();
    }

    public getParam(key: string) {
        let value = this.params && this.params[key];
        if (value == null || value == undefined) {
            value = this.router?.routerState?.snapshot?.root?.queryParams[key];
            if (value == null || value == undefined) {
                let queryParams = this.router.parseUrl(this.router.url).queryParams;
                value = queryParams && queryParams[key];
                if (value == null || value == undefined) {
                    value = this.params && this.params[key];
                    if (value == null || value == undefined)
                        value = this.state && this.state[key];
                    if (value == null || value == undefined && this.state?.object)
                        value = this.state?.object && this.state?.object[key];
                }
            }
        }
        return value;
    }

    private renderEmbed() {
        if (this.obj.EmbedComponent) {
            setTimeout(() => {
                if (this.componentEmbedInstance) {
                    if (this.containerEmbed) {
                        this.containerEmbed.remove();
                        this.componentEmbedRef.destroy();
                    }
                    this.componentEmbedInstance = null;
                }
                let component = this.componentFactoryResolver.resolveComponentFactory(this.obj.EmbedComponent);
                this.componentEmbedRef = this.containerEmbed.createComponent(component);
                this.componentEmbedInstance = <any>this.componentEmbedRef.instance;
                this.componentEmbedInstance.params = { TableData: this.itemData };
                this.componentEmbedRef.changeDetectorRef.detectChanges();
            }, 300);
        }
    }
    private clearStorage() {
        let stateKey = 'params',
            controller = this.getController(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        sessionStorage.removeItem(sessionKey);
    }
    private renderResize() {
        setTimeout(() => {
            let $handle: any,
                $column: any,
                startX: number,
                pressed = false,
                startWidth: number;
            $(document).on({
                mouseup: () => {
                    if (pressed) {
                        $column.removeClass('resizing');
                        pressed = false;
                    }
                },
                mousemove: (event: any) => {
                    if (pressed) {
                        $column.width(startWidth + (event.pageX - startX));
                    }
                },
            }).on('mousedown', '.table-resizable th .handle-resize', function (event: any) {
                $handle = $(this);
                $column = $handle.closest('th').addClass('resizing');
                startWidth = $column.width();
                startX = event.pageX;
                pressed = true;
            });
        }, 300);
    }
    private loadItemData() {
        if (this.obj.IsPopup)
            this.obj.NotKeepPrevData = true;
        if (!this.obj.NotKeepPrevData) {
            let dataKey = this.obj.ReferenceKey || this.obj.ReferenceName;
            let item = localStorage.getItem('data_' + dataKey);
            if (item) return JSON.parse(item) as TableData;
        }
        return this.itemData || new TableData();
    }
    private storeItemData() {
        if (this.obj.IsPopup)
            this.obj.NotKeepPrevData = true;
        if (!this.obj.NotKeepPrevData) {
            let dataKey = this.obj.ReferenceKey || this.obj.ReferenceName;
            localStorage.setItem('data_' + dataKey, JSON.stringify(this.itemData));
        }
    }
    public getController() {
        let url = this.router.url
            .replace('/admin/', '')
            .replace('admin/', '');
        let items = url.split('/');
        return items && items[0];
    }
    private renderStatistical() {
        if (this.obj.StatisticalComponent && this.activeStatisticalComponent) {
            setTimeout(() => {
                if (this.componentInstance) {
                    if (this.container) {
                        this.container.remove();
                        this.componentRef.destroy();
                    }
                    this.componentInstance = null;
                }
                let component = this.componentFactoryResolver.resolveComponentFactory(this.obj.StatisticalComponent);
                this.componentRef = this.container.createComponent(component);
                this.componentInstance = <any>this.componentRef.instance;
                this.componentRef.changeDetectorRef.detectChanges();
            }, 300);
        }
    }
    eventCheckChange(count: number) {
        let buttons = this.obj.Features.filter(c => c.toggleCheckbox);
        if (buttons && buttons.length > 0) {
            buttons.forEach((button: ActionData) => {
                let controllerName = button.controllerName || this.obj.ReferenceName;
                let allow = this.authen.permissionAllowSync(controllerName, button.systemName);
                if (allow) button.hide = !count;
            });
        }

        if (this.obj.MoreFeatures && this.obj.MoreFeatures.Actions && this.obj.MoreFeatures.Actions.length > 0) {
            buttons = this.obj.MoreFeatures.Actions.filter(c => c.toggleCheckbox);
            if (buttons && buttons.length > 0) {
                buttons.forEach((button: ActionData) => {
                    let controllerName = button.controllerName || this.obj.ReferenceName;
                    let allow = this.authen.permissionAllowSync(controllerName, button.systemName);
                    if (allow) button.hide = !count;
                });
            }
        }
    }
    private renderSelectedCount() {
        this.selectedCount = this.originalItems.filter(c => c.Checked).length;
    }
    private renderActiveTotalProperties() {
        this.activeTotalProperties = this.activeProperties.filter(c => c.SumOrCount);
        if (this.activeTotalProperties && this.activeTotalProperties.length > 0) {
            this.totalItem = new BaseEntity();
            let firstProperty = this.activeTotalProperties[0];
            this.activeTotalProperties.forEach((property: PropertyData) => {
                if (property.SumOrCount) this.totalItem[property.Property] = property.SumOrCount();
                else this.totalItem[property.Property] = this.items.reduce((sum, current) => sum + current[property.Property], 0);
            });
            let totalMergeCount = this.activeTotalProperties.reduce((sum, current) => sum + current.ColSpan || 1, 0);
            this.mergeCount = this.activeProperties.findIndex(c => c.Property == firstProperty.Property);
            this.notMergeCount = this.activeProperties.length - totalMergeCount - this.mergeCount;
            if (this.obj.Actions && this.obj.Actions.length > 0) this.notMergeCount += 1;
            if (this.obj.UpdatedBy) this.notMergeCount += 1;
        }
    }
    private addToChecked(item: BaseEntity) {
        if (!this.selectedIds) this.selectedIds = [];
        if (item.Checkable) {
            if (item.Checked) {
                if (this.selectedIds.indexOf(item.Id) < 0)
                    this.selectedIds.push(item.Id);
            } else {
                this.checkAll = false;
                if (this.selectedIds.indexOf(item.Id) >= 0)
                    this.selectedIds = this.selectedIds.filter(c => c != item.Id);
            }
        }

        // set checked for orignalItem
        this.originalItems.forEach((item: BaseEntity) => {
            item.Checked = this.selectedIds.indexOf(item.Id) >= 0;
        });
    }
    private getUrlState(): NavigationStateData {
        let stateKey = 'params',
            controller = this.getController(),
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller,
            valueJson = navigation && navigation.extras && navigation.extras.state
                ? navigation.extras.state[stateKey]
                : sessionStorage.getItem(sessionKey);
        if (valueJson) sessionStorage.setItem(sessionKey, valueJson.toString());
        return JSON.parse(valueJson) as NavigationStateData;
    }
    private addToCheckedRadio(item: BaseEntity) {
        this.selectedIds = [];
        if (item.Checkable) {
            if (item.Checked) {
                this.selectedIds.push(item.Id);
            }
        }

        // set checked for orignalItem
        this.originalItems.forEach((item: BaseEntity) => {
            item.Checked = this.selectedIds.indexOf(item.Id) >= 0;
        });
    }
    protected renderGroupActiveProperties() {
        this.groupActiveProperties = [];
        let properties = this.properties.filter(c => c.ColSpanTitle && c.Active);
        if (properties)
            this.groupActiveProperties.push(...properties);
    }
    protected renderActiveProperties(force?: boolean) {
        if (force || (!this.itemData.Columns || this.itemData.Columns.length == 0))
            this.itemData.Columns = this.properties.filter(c => c.Active).map(c => c.Property);
        this.activeProperties = [];
        this.itemData.Columns.forEach((column: string) => {
            let property = this.properties.find(c => c.Property == column && c.Active);
            if (property) this.activeProperties.push(property);
        });
    }
    protected renderEditActiveProperties(force?: boolean) {
        if (force || (!this.itemData.Columns || this.itemData.Columns.length == 0))
            this.itemData.Columns = this.properties.filter(c => c.Active).map(c => c.Property);
        this.editActiveProperties = [];
        let properties = DecoratorHelper.decoratorProperties(this.obj.Reference);

        this.itemData.Columns.forEach((column: string) => {
            let property = this.properties.find(c => c.Property == column && c.Active);
            if (property) {
                let propertyName = property.EditProperty || property.Property,
                    propertyItem = properties.find(c => c.property == propertyName);
                if (propertyItem) {
                    propertyItem.readonly = property.Readonly;
                    this.editActiveProperties.push(propertyItem);
                } else this.editActiveProperties.push({
                    viewer: true,
                    readonly: true,
                    property: property.Property,
                });
            }
        });
    }
    private async loadItemFilter(property: PropertyData, append: boolean = true) {
        property.LoadingFilter = true;
        if (!property.PageSize) property.PageSize = 20;
        if (!property.PageIndex) property.PageIndex = 1;
        let decorator = DecoratorHelper.decoratorProperty(this.obj.Reference, property.Property) ||
            DecoratorHelper.decoratorProperty(this.obj.Reference, property.Property + 'Id');
        if (decorator) {
            switch (decorator.dataType) {
                case DataType.String: {
                    let objEx = <StringEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookup('/' + this.obj.ReferenceName + '/lookup', columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        return OptionItem.createOptionItemsFromObject(result.Object as any[], objEx.property);
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.DateTime: {
                    let objEx = <DateTimeEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookupDateTime('/' + this.obj.ReferenceName + '/lookup', columns, null, null, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        let options: OptionItem[] = [];
                        let itemDates = result.Object as any[];
                        if (itemDates && itemDates.length > 0) {
                            itemDates.forEach((item: any) => {
                                let date: Date = item['Date'] as Date,
                                    dateString = UtilityExHelper.dateString(date);
                                let option: OptionItem = {
                                    value: item && date,
                                    label: item && dateString,
                                };
                                options.push(option);
                            });
                        }
                        return options;
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.Number: {
                    let objEx = <NumberEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookup('/' + this.obj.ReferenceName + '/lookup', columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        return OptionItem.createOptionItemsFromObject(result.Object as any[], objEx.property);
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.DropDown: {
                    let objEx = <DropDownEx>decorator;
                    if (objEx.lookup && objEx.lookup.items) {
                        property.ItemFilters = objEx.lookup.items;
                    } else if (objEx.lookup.url) {
                        let columns: any[] = _.cloneDeep(objEx.lookup.propertyDisplay || ['Name']);
                        columns.unshift(objEx.lookup.propertyValue || 'Id');
                        if (objEx.lookup.propertyGroup)
                            columns.push(objEx.lookup.propertyGroup);
                        let items = await this.service.lookup(objEx.lookup.url, columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, objEx);
                        });
                        this.cloneItems = _.cloneDeep(this.items);
                        if (items && items.length > 0) {
                            if (items.length < property.PageSize) property.AllowLoadMore = false;
                            if (append) {
                                items.forEach(itm => {
                                    property.ItemFilters.push(itm);
                                });
                            } else property.ItemFilters = items;
                        } else property.AllowLoadMore = false;
                    }
                } break;
                case DataType.Boolean: {
                    let objEx = <BooleanEx>decorator;
                    if (objEx.lookup && objEx.lookup.items) {
                        property.ItemFilters = objEx.lookup.items;
                    } else if (objEx.lookup.url) {
                        let columns: any[] = _.cloneDeep(objEx.lookup.propertyDisplay || ['Name']);
                        columns.unshift(objEx.lookup.propertyValue || 'Id');
                        if (objEx.lookup.propertyGroup)
                            columns.push(objEx.lookup.propertyGroup);
                        let items = await this.service.lookup(objEx.lookup.url, columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, objEx);
                        });
                        this.cloneItems = _.cloneDeep(this.items);
                        if (items && items.length > 0) {
                            if (items.length < property.PageSize) property.AllowLoadMore = false;
                            if (append) {
                                items.forEach(itm => {
                                    property.ItemFilters.push(itm);
                                });
                            } else property.ItemFilters = items;
                        } else property.AllowLoadMore = false;
                    } else {
                        property.ItemFilters = OptionItem.createOptionItemsFromBoolean();
                    }
                } break;
            }
        }
        setTimeout(() => {
            property.LoadingFilter = false;
        }, 1000);
    }
    protected popupAutoAsync(obj: DialogAutoData, okFunction?: (item?: any) => Promise<any>) {
        this.prepareFormAuto = true;
        this.dialogService.HideAllDialog();
        setTimeout(() => {
            this.dialogService.Dialog({
                object: obj,
                title: obj.title || this.obj.Title,
                cancelText: obj.cancelText || 'Đóng',
                size: obj.size || ModalSizeType.Medium,
                confirmText: obj.confirmText || 'Đồng ý',
                cancelFunction: () => {
                    this.prepareFormAuto = false;
                },
                okFunction: async () => {
                    if (okFunction) {
                        await okFunction();
                        this.prepareFormAuto = false;
                    } else this.prepareFormAuto = false;
                },
                type: DialogType.Automatic,
            });
        }, 300);
    }
    protected popupAsync(obj: DialogData, okFunction?: (item?: any) => Promise<any>,
        rejectFunction?: (item?: any) => Promise<any>, resultFunction?: (item?: any) => Promise<any>,
        cancelFunction: (item?: any) => void = null, minimizeFunction: (item?: any) => void = null) {
        this.dialogService.WapperAsync(obj, okFunction, rejectFunction, resultFunction, cancelFunction, minimizeFunction);
    }
    protected popupAboveAsync(obj: DialogData, okFunction?: (item?: any) => Promise<any>,
        rejectFunction?: (item?: any) => Promise<any>, resultFunction?: (item?: any) => Promise<any>,
        cancelFunction: (item?: any) => void = null, minimizeFunction: (item?: any) => void = null) {
        this.dialogService.WapperAboveAsync(obj, okFunction, rejectFunction, resultFunction, cancelFunction, minimizeFunction);
    }
}