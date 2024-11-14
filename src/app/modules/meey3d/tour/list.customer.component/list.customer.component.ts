import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditTourCustomerComponent } from "../edit.customer.component/edit.customer.component";
import { M3DCustomerEntity } from "../../../../_core/domains/entities/meey3d/m3d.customer.entity";

@Component({
  templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class M3dListCustomerComponent extends GridComponent implements OnInit {
  item: any;
  obj: GridData = {
    Filters: [],
    Imports: [],
    Exports: [],
    Actions: [
      {
        icon: "la la-pencil",
        name: ActionType.Edit,
        systemName: ActionType.Edit,
        className: "btn btn-primary",
        controllerName: 'M3DContactInfo',
        click: (item: any) => {
          this.edit(item);
        },
      },
    ],
    Features: [],
    UpdatedBy: false,
    CustomFilters: [],
    DisableAutoLoad: true,
    SearchText: "Tìm theo tên,mô tả...",
    Reference: M3DCustomerEntity,
    Url: "admin/m3dcontactinfo/items",
  };
  ngOnInit() {
    this.properties = [
      {
        Property: "Index",
        Title: "STT",
        Type: DataType.Number,
        DisableOrder: true,
        Align: "center",
      },
      {
        Property: "Name",
        Title: "Họ và tên",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "Phone",
        Title: "SĐT liên hệ",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "Address",
        Title: "Địa chỉ liên hệ",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "Description",
        Title: "Thông tin thêm",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "Email",
        Title: "Email",
        Type: DataType.String,
        DisableOrder: true,
      },
      {
        Property: "StatusString",
        Title: "Trạng thái",
        Type: DataType.String,
        DisableOrder: true,
        Format: (item: any) => {
          item["StatusString"] = item.Status;
          let option = ConstantHelper.M3D_CUSTOMER_STATUS_TYPE.find(
            (c) => c.value == item["StatusString"]
          );
          let text =
            '<p style="color:' +
            (option && option.color) +
            '">' +
            (option && option.label) +
            "</p>";
          return text;
        },
      },
      {
        Property: "CreatedAt",
        Title: "Ngày tạo",
        Type: DataType.DateTime,
        DisableOrder: true,
      },
    ];
    this.render(this.obj);
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
  edit(item: any) {
    this.dialogService.WapperAsync(
      {
        cancelText: "Đóng",
        title: "Cập nhật trạng thái khách hàng",
        size: ModalSizeType.Medium,
        confirmText: "Lưu thay đổi",
        objectExtra: { item: item },
        object: EditTourCustomerComponent,
      },
      () => this.loadItems()
    );
  }
}
