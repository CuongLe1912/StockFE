import { AppInjector } from "../../../app.module";
import { BadwordApiService } from "../badwordapi.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { EntityHelper } from "../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { EditorComponent } from "../../../_core/editor/editor.component";
import { EditComponent } from "../../../_core/components/edit/edit.component";
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";
import { BadwordApiEntity } from "../../../_core/domains/entities/badwordapi/badwordapi.entity";

@Component({
  templateUrl: "./import.badword.component.html",
  styleUrls: [
    "./import.badword.component.scss",
    "../../../../assets/css/modal.scss",
  ],
})
export class ImportBadwordComponent extends EditComponent implements OnInit {
  @ViewChild("importBadword") imporBadword: EditorComponent;

  loading: boolean;
  isActive: boolean = true;
  isImport: boolean;
  isDownload: boolean;
  service: BadwordApiService;
  dialog: AdminDialogService;
  item: BadwordApiEntity = new BadwordApiEntity();
  itemResponseImport: any;
  countSuccess: number;
  wordSuccess: string;
  constructor() {
    super();
    this.service = AppInjector.get(BadwordApiService);
    this.dialogService = AppInjector.get(AdminDialogService);
  }
  ngOnInit() { }

  async confirm(): Promise<boolean> {
    this.processing = true;
    let dataImport = await this.imporBadword.upload();
    let jsonData =
      dataImport && dataImport.length > 0 ? dataImport[0].Path : null;
    if (jsonData) {
      this.itemResponseImport = jsonData;
      ToastrHelper.Success(
        "Import thành công " + this.itemResponseImport.countSuccess + " bản ghi"
      );
      return true;

    } else {
      ToastrHelper.Error("Dữ liệu API bị lỗi hoặc không hợp lệ");
      return false;
    }
  }
  reject() {
    this.dialogService.HideAllDialog();
  }
  changeView(view: number) {
    if (view == 1) {
      this.isDownload = true;
      this.isActive = false;
      this.isImport = false;
    } else if (view == 2) {
      this.isDownload = false;
      this.isActive = false;
      this.isImport = true;
    } else {
      this.isDownload = false;
      this.isActive = true;
      this.isImport = false;
      this.item = EntityHelper.createEntity(BadwordApiEntity);
    }
  }
}
