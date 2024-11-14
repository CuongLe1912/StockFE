import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Select2UpdateEvent } from 'ng-select2-component';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { MCRMShowHistoryComponent } from './show.history/show.history.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { DepartmentEntity } from '../../../../_core/domains/entities/department.entity';
import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ControllerType, ActionType as ActionTypeController } from '../../../../_core/domains/enums/action.type';
import { TreeviewConfig, TreeviewEventParser, TreeviewItem, OrderDownlineTreeviewEventParser } from 'ngx-treeview';
import { AssignSaleConfig, DeparmentData, TreeAssignSale } from '../../../../_core/domains/entities/meeycrm/mcrm.assignsaleconfig.entity';

@Component({
  templateUrl: "./assign.sale.config.component.html",
  styleUrls: [
    "./assign.sale.config.component.scss",
    "../../../../../assets/css/modal.scss",
  ],
  providers: [
    {
      provide: TreeviewEventParser,
      useClass: OrderDownlineTreeviewEventParser,
    },
    { provide: TreeviewConfig, useClass: MCRMAssignSaleConfigComponent },
  ],
})
export class MCRMAssignSaleConfigComponent extends EditComponent implements OnInit, AfterContentChecked {
  @Input() params: any;
  id: number;
  popup: boolean;
  departments: TreeAssignSale[];
  model: AssignSaleConfig = new AssignSaleConfig();
  previousModel: AssignSaleConfig;
  loading: boolean = true;
  userService: UserService;
  item: DepartmentEntity = new DepartmentEntity();
  service: MeeyCrmService;
  dialogService: AdminDialogService;
  config: any;
  isEditAssign: boolean = false;
  messConfirmAssign: string;
  //curStatusTogle: boolean;
  addDepartmentList: any[] = [];
  newDepartment: string[] = [];
  newNote: string = "";
  checkAddNote: boolean = true;
  checkAddDepartment: boolean = true;
  checkNote: boolean = true;
  previousToggleState: boolean;

  checkPermissionEdit: boolean;
  checkPermissionViewHistory: boolean;
  checkPermissionAddDepartment: boolean;
  constructor(private changeDetector: ChangeDetectorRef) {
    super();
    this.service = AppInjector.get(MeeyCrmService);
    this.userService = AppInjector.get(UserService);
    this.dialogService = AppInjector.get(AdminDialogService);
    this.config = {
      hasAllCheckBox: false,
      hasFilter: false,
      hasCollapseExpand: false,
      decoupleChildFromParent: false,
      maxHeight: 406,
    };
    this.addBreadcrumb("Cấu hình Phân sale tự động");
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  async ngOnInit() {
    this.id = this.params && this.params["id"];
    this.popup = this.params && this.params["popup"];
    this.checkPermissionEdit = await this.authen.permissionAllow(ControllerType.MCRMAssignSaleConfig, ActionTypeController.Edit);
    this.checkPermissionViewHistory = await this.authen.permissionAllow(ControllerType.MCRMAssignSaleConfig, ActionTypeController.History);
    this.checkPermissionAddDepartment = await this.authen.permissionAllow(ControllerType.MCRMAssignSaleConfig, ActionTypeController.AddDepartment);
    await this.loadItem();
    await this.loadDepartment();
    this.loading = false;

  }

  clickButtonSave() {
    this.checkNote = this.model.Note.trim().length > 0
    if (this.previousToggleState != this.model.IsActive) {
      if (this.model.IsActive == false) { //tắt toggle
        this.messConfirmAssign = "Bạn có chắc muốn tắt Phân sale tự động.<br/>Thao tác này đồng nghĩa các tài khoản mới sẽ tự động về kho công ty.";
      }
      else { //bật toggle         
        this.messConfirmAssign = "Bạn có chắc muốn bật Phân sale tự động.<br/>Thao tác này đồng nghĩa các tài khoản mới sẽ tự động phân về các nhân viên tương ứng.";
        if (!this.checkNote) {
          ToastrHelper.Error("Hãy nhập ghi chú");
          return;
        }
      }
    }
    else {
      this.messConfirmAssign = "Bạn có muốn lưu các thay đổi";
      if (this.model.IsActive == true) //Toggle đang bật
      {
        if (!this.checkNote) {
          ToastrHelper.Error("Hãy nhập ghi chú");
          return;
        }
      }
    }
    let countSaleTicked = 0;
    this.departments.forEach((d) => {
      d.data.forEach((x) => {
        if (x.children) {
          let lsId = x.children.filter((y) => y.checked == true).map((z) => z.value);
          countSaleTicked += lsId.length;
          //ids = lsId.join(",");
        }
      });
    });

    if (countSaleTicked == 0) {
      ToastrHelper.Warning("Chọn ít nhất 1 nhân viên để bật phân sale tự động");
      return;
    }
    this.clickButton('btnConfirmAssign')
  }

  //Load Department tại popup thêm mới phòng ban
  async loadDepartment() {
    let listIdChecked = []

    if (this.model.Data != undefined || this.model.Data != null) {
      listIdChecked = [].concat(
        ...this.model.Data.map((i) => i.DepartmentId)
      );
    }

    const saleDepartmentType = 1;
    const res = await this.service.item("Department/LookupItems", saleDepartmentType)

    if (ResultApi.IsSuccess(res)) {
      res.Object.forEach(async (y) => {
        let urlSale = "Department/LookupSales";
        const resSale = await this.service.item(urlSale, y.Id)
        if (ResultApi.IsSuccess(resSale)) {
          if (resSale.Object.length > 0) {
            this.addDepartmentList.push({
              label: y.Name,
              value: y.Id,
              disabled: listIdChecked.includes(y.Id),
            });
          }
        }
      });
    }
  }

  selectDepartmentAssignSale(event: Select2UpdateEvent<any>) {
    this.newDepartment = event.value;
    this.checkAddDepartment = this.newDepartment.length > 0;
  }

  async addDepartmentAssignSale() {
    this.checkAddDepartment = this.newDepartment.length > 0;
    this.checkAddNote = this.newNote.length > 0;

    if (this.checkAddDepartment && this.checkAddNote) {

      this.addDepartmentList.forEach(
        (x) => {
          if (this.newDepartment.includes(x.value)) {
            x.disabled = true
          }
        }
      );


      let urlSale = "Department/LookupSales";
      this.newDepartment.forEach(async (newDepartment) => {
        let tempChild = [];
        const resSale = await this.service.item(urlSale, newDepartment)
        if (ResultApi.IsSuccess(resSale) && resSale.Object.length > 0) {
          resSale.Object.forEach((res) =>
            tempChild.push({
              text: res.FullName + " - " + res.Email,
              value: res.Id,
              checked: false,
            })
          );
        }

        const resDepartment = await this.service.item("Department/LookupItem", newDepartment)
        if (ResultApi.IsSuccess(resDepartment)) {
          resDepartment.Object.forEach((y) => {
            let tpobj = new TreeAssignSale();
            tpobj.data = [
              new TreeviewItem({
                text: y.Name,
                value: y.Id,
                children: tempChild,
                collapsed: true,
                disabled: !this.isEditAssign,
                checked: false,
              }),
            ];
            tpobj.activeNewMember = false;
            tpobj.note = this.newNote;
            this.departments.push(tpobj);
          });
          this.newDepartment = [];
          this.newNote = "";
        }
        else {
          ToastrHelper.ErrorResult(resDepartment);
        }
      })

      this.clickButton("closeAddDepartment");

    }
  }

  onSelectedChange() {
    this.departments.forEach((x) => {
      x.data.forEach((c) => {
        if (c.children) {
          let tpCheck = c.children.filter((m) => m.checked == false).length;
          if (tpCheck > 0) {
            x.activeNewMember = false;
            x.showActive = false;
          } else {
            x.showActive = true;
          }
        }
      });
    });
  }

  async actionEdit(type: ActionType) {
    switch (type) {
      case ActionType.Edit:
        this.isEditAssign = true;
        await this.loadItem();
        break;

      case ActionType.Save:
        this.loading = true
        const statusActive = { id: this.model.Id, isActive: this.model.IsActive }
        const res = await this.service.callApiByUrl("MCRMAssignSaleConfig/ActiveConfig/", statusActive, MethodType.Put)

        if (!this.model.IsActive && ResultApi.IsSuccess(res)) {
          ToastrHelper.Success("Lưu dữ liệu thành công");
        }

        if (this.model.IsActive == true) {
          await this.updateModelData()
        }

        this.clickButton("closeConfirmAssign")
        this.isEditAssign = false;
        this.loading = false
        break;
    }
  }

  private async updateModelData() {
    this.model.Data = [];
    //let countSaleTicked = 0;

    this.departments.forEach((d) => {
      d.data.forEach((x) => {
        let ids = "";
        if (x.children) {
          let lsId = x.children.filter((y) => y.checked == true).map((z) => z.value);
          //countSaleTicked += lsId.length;
          ids = lsId.join(",");
        }

        let parentId = x.value;

        let departmentData = new DeparmentData()
        departmentData.Ids = ids.length > 0 ? ids : "";
        departmentData.DepartmentId = parentId;
        departmentData.ActiveNewMember = d.activeNewMember;
        departmentData.Note = d.note;

        this.model.Data.push(departmentData);
      });
    });

    // if (countSaleTicked == 0) {
    //   ToastrHelper.Warning("Chọn ít nhất 1 nhân viên để bật phân sale tự động");
    //   return;
    // }

    await this.confirm();
  }
  public async confirm() {
    if (!this.model) return

    this.loading = true;
    const obj = _.cloneDeep(this.model);

    try {
      const result = await this.service.addOrUpdateAssignSale(obj)

      if (ResultApi.IsSuccess(result)) {
        this.loading = false;
        ToastrHelper.Success("Lưu dữ liệu thành công");

        this.disabledCheckboxDepartment()

        //đóng popup
        this.clickButton("closeConfirmAssign");
      } else {
        ToastrHelper.ErrorResult(result);
      }
    } catch (error) {
      ToastrHelper.Error("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  }

  changeSave() {
    this.checkNote = this.model.Note.trim().length > 0
  }

  public history() {
    this.dialogService.WapperAsync({
      cancelText: "Đóng",
      size: ModalSizeType.ExtraLarge,
      title: "Xem lịch sử",
      object: MCRMShowHistoryComponent,
    });
  }

  async loadItem() {
    try {
      this.loading = true
      this.departments = [];
      const result = await this.service.callApiByUrl("MCRMAssignSaleConfig");

      if (!ResultApi.IsSuccess(result)) {
        ToastrHelper.ErrorResult(result);
        return;
      }
      if (result.Object == null) {
        this.model.IsActive = true
        this.model.IsProduct = false
        this.model.Data = []
        const resDepart = await this.service.callApiByUrl("Department/DepartmentForAssignSale")
        if (ResultApi.IsSuccess(resDepart)) {
          resDepart.Object.forEach(x => {
            let departObject = new DeparmentData();
            departObject.DepartmentId = x.Id;
            this.model.Data.push(departObject)
          });
        }
      }
      else {
        this.model = result.Object as AssignSaleConfig;
        this.model.Data = result.Object.Data as DeparmentData[];
      }

      this.previousToggleState = this.model.IsActive
      this.model.Note = "";
      if (this.previousModel == undefined) {

        this.previousModel = _.cloneDeep(this.model)
      }
      if (!this.model.Data || this.model.Data.length < 0) {
        return;
      }
      this.updateDepartment()
      this.loading = false

    } catch (error) {
      ToastrHelper.Error("Có lỗi xảy ra trong quá trình thực hiện");
    }
  }

  private updateDepartment() {
    let listIdChecked = [].concat(
      ...this.model.Data.map((i) => i.Ids.split(","))
    );

    this.model.Data.map(async x => {
      const departmentId = x.DepartmentId;
      const tempChild = [];
      const urlSale = "Department/LookupSales";
      const urlDepartment = "Department/LookupItem";

      const saleResult = await this.service.item(urlSale, departmentId)
      if (ResultApi.IsSuccess(saleResult)) {
        saleResult.Object.forEach(c => {
          if (!c.Locked) {
            tempChild.push({
              text: c.FullName + " - " + c.Email,
              value: c.Id,
              checked: x.ActiveNewMember ? true : false,//Nếu ở trạng thái auto phân sale thì tất cả sale dc tick
            });
          }
        })
      }

      if (!x.ActiveNewMember) {
        tempChild.forEach((c) => {
          if (listIdChecked.includes(c.value.toString())) {
            c.checked = true;
          }
        });
      }

      const departmentResult = await this.service.item(urlDepartment, departmentId)
      if (ResultApi.IsSuccess(departmentResult)) {
        departmentResult.Object.forEach(d => {
          const t = new TreeviewItem({
            text: d.Name,
            value: d.Id,
            children: tempChild,
            collapsed: true,
            disabled: !this.isEditAssign,
            checked: tempChild.length > 0 ? true : false
          })
          const treeAssignSale = new TreeAssignSale();
          treeAssignSale.data = [t]
          treeAssignSale.activeNewMember = x.ActiveNewMember
          this.departments.push(treeAssignSale)
        })
        if (this.departments && this.departments.length > 0) {
          this.departments.sort((a, b) => {
            if (a.data[0].value > b.data[0].value) return 1
            else return -1
          })
        }
      }
    });
  }

  changeAssignSaleMothod(isProduct: boolean) {
    this.model.IsProduct = isProduct;
  }

  clickButton(id: string) {
    const ele = document.getElementById(id)
    if (ele) {
      ele.click()
    }
  }

  onChangeCheckNote() {
    this.checkAddNote = this.newNote.length > 0
  }
  onChangeCheckDepartment(value: boolean) {
    this.checkAddDepartment = value
  }
  addDepartment() {
    this.clickButton('btnAddDepartment')
    this.checkAddDepartment = true
    this.checkAddNote = true
    this.newDepartment = []
    this.newNote = ''
  }
  async clickButtonCancel() {
    await this.loadItem();
    await this.loadDepartment();
    this.isEditAssign = false
  }
  private disabledCheckboxDepartment() {
    this.departments.forEach((d) => {
      d.data.forEach((x) => {
        x.disabled = true;
      });
    });
  }

}
enum ActionType {
  Edit = 1,
  Save = 2
}
