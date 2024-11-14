import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { CompareType } from "../../../_core/domains/enums/compare.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { ViewReportViolateComponent } from "./view.reportviolate/view.reportviolate.component";
import { MRVReportViolateEntity } from "../../../_core/domains/entities/meeyreview/mrv.reportviolate.entity";
import { MRVReportViolateStatusType } from "../../../_core/domains/entities/meeyreview/enums/mrv.reportviolate.status.type";

@Component({
  styleUrls: ["./mrvreportviolate.component.scss"],
  templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MRVReportViolateComponent extends GridComponent implements OnInit {
  item: any;
  allowVerify: boolean;
  obj: GridData = {
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.View,
        hidden: (item: any) => {
          let origialItem: any = this.originalItems.find(c => c.Id == item.Id);
          return origialItem.Status == 3;
        },
        click: (item: any) => this.view(item)
      }
    ],
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    Reference: MRVReportViolateEntity, //MeeyReviewUserEntity,
    CustomFilters: ["FilterName", "ProjectId", "Status", "FilterDateRange"],
    ClassName: "meeyreview-user-grid",
    HideSearch: true,
    DisableAutoLoad: true,
    UpdatedBy: false,
    NotKeepPrevData: true
  };
  constructor() {
    super();
  }

  ngOnInit() {
    //this.item.Status = MRVReportViolateStatusType.Pending;
    this.properties = [
      {
        Property: "Index",
        Title: "STT",
        Type: DataType.Number,
        DisableOrder: true,
      },
      {
        Property: "Content",
        Title: "Lý do báo cáo",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "Project",
        Title: "Dự án",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "UserReport",
        Title: "Người báo cáo",
        Type: DataType.String,
        DisableOrder: true,
        Format: (item) => {
          return item?.CreatedBy?.name;
        },
      },
      {
        Property: "CreateDate",
        Title: "Thời gian báo cáo",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "UserHandler",
        Title: "Người xử lý",
        Type: DataType.String,
        DisableOrder: true,
      },

      {
        Property: "Status",
        Title: "Trạng thái xử lý",
        Type: DataType.String,
        DisableOrder: true,
      },
    ];
    this.setFilter([
      {
        Name: 'Status',
        Compare: CompareType.N_Equals,
        Value: MRVReportViolateStatusType.Pending
      }
    ]);
    this.render(this.obj);

    // refresh
    if (!this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(
        async () => {
          this.dialogService.HideAllDialog();
          await this.loadItems();
        }
      );
    }
  }

  view(item: any) {
    this.dialogService.WapperAsync({
      cancelText: "Đóng",
      title: "Chi Tiết",
      object: ViewReportViolateComponent,
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
        viewer: true,
      },
    });
  }

  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 20;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.Index = pagesize * (pageindex - 1) + (index + 1);
      });
    }
  }

  quickView(item: any, type: string): void {
    console.log("xx");
    if (this.allowVerify) {
      if (type && type == "verified") {
        let origialItem: any = this.originalItems.find(
          (c) => c["_id"] == item["_id"]
        );
        if (origialItem.status == 1) origialItem.status = 2;
        else origialItem.status = 1;
        let data = {
          status: origialItem.status,
          adminUserId: this.authen.account.Id,
        };
        this.service
          .callApi(
            "MSHighlight",
            "UpdateStatusProperty/" + item._id,
            data,
            MethodType.Post
          )
          .then(
            async (result) => {
              if (ResultApi.IsSuccess(result)) {
                this.loadItems();
                return;
              }
              ToastrHelper.ErrorResult(result);
            },
            (e: any) => {
              ToastrHelper.Exception(e);
            }
          );
      }
    }
  }
}
