import { FormData } from "./form.data";
import { ActionData } from "./action.data";
import { FilterData } from "./filter.data";
import { CompareType } from "../enums/compare.type";
import { BaseEntity } from "../entities/base.entity";
import { ModalSizeType } from "../enums/modal.size.type";
import { PagingPositionType } from "../enums/paging.position.type";

export class GridData {
    Url?: string;
    Title?: string;
    IsPopup?: boolean;
    ScrollX?: boolean;
    Forms?: FormData[];
    ClassName?: string;
    Editable?: boolean;
    TotalTitle?: string;
    Checkable?: boolean;
    Radioable?: boolean;
    SearchText?: string;
    UpdatedBy?: boolean;
    ItemComponent?: any;
    IgnoreIds?: number[];
    Size?: ModalSizeType;
    HideSearch?: boolean;
    PageSizes?: number[];
    HidePaging?: boolean;
    EmbedComponent?: any;
    AsynLoad?: () => void;
    ReferenceKey?: string;
    Actions?: ActionData[];
    Exports?: ActionData[];
    Imports?: ActionData[];
    Filters?: ActionData[];
    ReferenceName?: string;
    Features?: ActionData[];
    Reference?: new () => {};
    FilterData?: FilterData[];
    HideHeadActions?: boolean;
    NotKeepPrevData?: boolean;
    DisableAutoLoad?: boolean;
    StatisticalComponent?: any;
    MoreActions?: ActionData[];
    HideCustomFilter?: boolean;
    EditActions?: ActionData[];
    TimerReload?: TimerReloadData;
    MoreFeatures?: MoreActionData;
    HideSkeletonLoading?: boolean;
    PagingPositionType?: PagingPositionType;
    CustomFilters?: (string | GridFilterData)[];
    InlineFilters?: (string | GridFilterData)[];
}

export class GridFormData {
    Params?: any;
    Component: any;
    Item: BaseEntity;
}

export class MoreActionData {
    Icon: string;
    Name: string;
    Actions?: ActionData[]
}

export class TimerReloadData {
    Timer: number;
    AutoReload: boolean;
    AllowReload: boolean;
}

export class GridFilterData {
    Name: string;
    Placeholder?: string;
    AllowClear?: boolean;
    Types?: CompareType[];
}