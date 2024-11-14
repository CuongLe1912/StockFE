import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppInjector } from '../../../app.module';
import { EditComponent } from '../../components/edit/edit.component';
import { validation, validations } from '../../decorators/validator';
import { ActionData } from '../../domains/data/action.data';
import { NavigationStateData } from '../../domains/data/navigation.state';
import { ResultApi } from '../../domains/data/result.api';
import { ActionType } from '../../domains/enums/action.type';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { CreateEntityService } from './create.entitys.service';
import { ModuleEntity, DecoratorEntity } from './entities/create.decorator.entity';
import { DecoratorSystemType, DecoratorType, SystemType } from './enums/decorator.type';

import * as template from './template/module.template.json'

@Component({
  templateUrl: "./create.entitys.component.html",
  styleUrls: ["./create.entitys.component.scss"],
})
export class CreateEntitysComponent extends EditComponent implements OnInit {
  @ViewChild('codeEditorEntity') private codeEditorEntity;
  @ViewChild('codeEditorModule') private codeEditorModule;
  @ViewChild('codeEditorComponent') private codeEditorComponent;
  @ViewChild('codeImportEntity') private codeImportEntity;

  @ViewChild("preview") preview: ElementRef;

  service: CreateEntityService;
  
  actions: ActionData[] = [];
  loading: boolean = true;
  router: Router;
  state: NavigationStateData;
  tab: string = 'entity';
  tabInput: string = 'input';
  showTable = true;
  saveFolderPath = true;

  item: ModuleEntity = new ModuleEntity();
  decorator: DecoratorEntity[] = [new DecoratorEntity()];

  authen: AdminAuthService;
  dialog: AdminDialogService;

  contentEntity: string = '\t\t \\* Nhập đủ thông tin để tạo File Entity *\\ \n';
  contentModule: string = '\t\t \\* Nhập đủ thông tin để tạo File Module *\\ \n';
  contentComponent: string = '\t\t \\* Nhập đủ thông tin để tạo File Component *\\ \n';
  contentImportEntity: string = '//Sao chép Entity từ C# vào để lấy thông tin \n';

  options = { // xem thêm cấu hình : https://codemirror.net/doc/manual.html#config
    theme: 'material',
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
    lineWiseCopyCut: true
  }
  optionsAsp = {
    theme: 'material',
    mode: 'text/x-csharp',
    lineNumbers: true,
    tabSize: 2,
    lineWiseCopyCut: true
  }
  // '\a' is alert/bell
  // '\b' is backspace/rubout
  // '\n' is newline
  // '\r' is carriage return (return to left margin)
  // '\t' is tab

  constructor() { 
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(CreateEntityService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();

    this.item.FolderPath = localStorage.getItem('create-entity-folder')
  }

  ngOnInit() {
    this.addBreadcrumb("Tạo thư mục Module");
    this.renderActions();
    this.loading = false;
    this.item.BaseEntity = true;
  }

  private async renderActions() {
    let actions: ActionData[] = [
      {
        name: "Xem trước",
        icon: 'la la-terminal',
        className: 'btn btn-primary',
        systemName: ActionType.View,
        click: async () => {
          await this.view();
        }
      },
      {
        name: "Tạo file",
        processButton: true,
        icon: 'la la-download',
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: async () => {
          await this.exportFile();
        }
      }
    ];
    this.actions = await this.authen.actionsAllow(DecoratorEntity, actions);
  }

  public async view () {
    this.processing = true;
    if (await validation(this.item, ['ModuleName']) && await validations(this.decorator, ['Name', 'Type'])) {
      this.contentEntity = this.getEntityFile('')
      this.contentModule = this.getModuleFile('')
      this.contentComponent = this.getComponentFile('')
      this.preview.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    this.processing = false;
  }

  public async exportFile () {    
    this.processing = true;
    if (await validation(this.item, ['ModuleName', 'FolderPath']) && await validations(this.decorator, ['Name', 'Type'])) {
      await this.confirmAndBack();
    }
    this.processing = false;
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      // this.back();
    });
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.saveFolderPath) {
      localStorage.setItem('create-entity-folder', this.item.FolderPath)
    }
    this.contentEntity = this.item.ContentEntity = this.getEntityFile('')
    this.contentModule = this.item.ContentModule = this.getModuleFile('')
    this.contentComponent = this.item.ContentComponent = this.getComponentFile('')
    const contentDialog = '<p><h4 style="text-align: center;">Bạn muốn tạo "' + this.getUpperCase(this.item.ModuleName) + 'Module" ?</h4></p>'
                        + '<p><em>Lưu ý: Module sẽ đc tạo trong thư mục "' + this.item.FolderPath + 'src/app/modules/' + (this.item.GroupName ? this.item.GroupName : '') + '".</em></p>'
                        + '<p><i class="la la-chevron-down"></i> src/app/modules/' + (this.item.GroupName ? this.item.GroupName : '') + ' </p>'
                        + '<p style="padding-left: 1.5em"><i class="la la-chevron-down"></i> ' + this.getLowerCase(this.item.ModuleName) + ' </p>'
                        + '<p style="padding-left: 3em"><i class="la la-chevron-down" aria-hidden="true"></i> entities</p>'
                        + '<p style="padding-left: 4.5em"><i class="la la-file-text-o"></i> ' + this.getLowerCase(this.item.ModuleName) + '.entity.ts</p>'
                        + '<p style="padding-left: 3em"><i class="la la-file-code-o"></i> ' + this.getLowerCase(this.item.ModuleName) + '.component.ts</p>'
                        + '<p style="padding-left: 3em"><i class="la la-th-list"></i> ' + this.getLowerCase(this.item.ModuleName) + '.module.ts</p>'
                        + '<p></p>'
    this.dialogService.ConfirmAsync(contentDialog, async () => {
      await this.service.ExportFile(this.item).then((result: ResultApi) => {
        this.processing = false;
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Tạo file Entity thành công');
          if (complete) complete();
          return true;
        } else {
            ToastrHelper.ErrorResult(result);
            return false;
        }
      });
    });
    return false;
  }

  selectedTab(tab: string) {
    this.tab = tab;
  }

  selectedTabInput(tab: string) {
    this.tabInput = tab;
  }

  addTableEntity() {
    this.decorator.push(new DecoratorEntity());
  }

  deleteRowEntity(decorator: DecoratorEntity) {
    if (decorator) {
      const index = this.decorator.indexOf(decorator, 0);
      if (index > -1) {
        this.showTable = false;
        this.decorator.splice(index, 1);
        
        setTimeout(() => this.showTable = true);
      }
    }
  }

  copyCode() {
    const editor = this.codeEditorEntity.codeMirror;
    // const doc = editor.getDoc();
    navigator.clipboard.writeText(editor.getValue());
    ToastrHelper.Success('Sao chép Entity thành công');
  }

  copyModule() {
    const editor = this.codeEditorModule.codeMirror;
    navigator.clipboard.writeText(editor.getValue());
    ToastrHelper.Success('Sao chép Module thành công');
  }

  copyComponent() {
    const editor = this.codeEditorComponent.codeMirror;
    navigator.clipboard.writeText(editor.getValue());
    ToastrHelper.Success('Sao chép Component thành công');
  }

  importCode() {
    const editor = this.codeImportEntity.codeMirror;
    let lineCode: string[] = editor.getValue().split('\n');
    let decorator: DecoratorEntity[] = []; 
    lineCode.forEach(code => {
      code = code.trim().replace(/\s\s+/g, ' ');
      if (code.replace(/ /g, '').includes('{get;set;}')) {
        code = this.removeGetSet(code)
        let listType = code.split(' ')
        listType = listType.filter(function (el) {
          return el != null && el != '';
        });
        if (listType.length > 1) {
          let type: string = listType[listType.length - 2] != null ? listType[listType.length - 2].replace('?', '') : listType[listType.length - 2]
          let property = listType[listType.length - 1]
          let entity = new DecoratorEntity()
          entity.Label = property;
          entity.Name = property;
          let systemType = <SystemType> type.toLowerCase();
          if(systemType) {
            entity.SystemType = systemType
            let option = DecoratorSystemType.DECORATOR_SYSTEM.find(c => c.value.includes(systemType))
            if(option && option.label) {
              entity.Type = option.label
            }
          }
          decorator.push(entity)
        }        
      }
    })

    if (decorator.length > 0) {
      this.decorator = decorator
      this.selectedTabInput('input')
    }
  }

  removeGetSet(code: string): string {
    if (code.replace(/ /g, '').includes('{get;set;}')) {
      let str = ""
      if(code.indexOf("{ get") > 0) {
        str = "{ get"
      } else if(code.indexOf("{get") > 0) {
        str = "{get"
      }
      code = code.substr(0, code.indexOf(str))
    }
    return code
  }

  getEntityFile(content): string {    
    let body = ''
    let listImport = []
    let listImportType = []
    this.decorator.forEach(d => {
      let decoratorText = ''
      let type = ''
      switch (parseInt(d.Type.toString())) {
        case DecoratorType.String: {
          let inputImp = template.entity.import.string
          let inputImpType = template.entity.import.type.string
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          let impt = listImportType.find(s => inputImpType)
          if(!impt) listImportType.push(inputImpType)
          decoratorText = '@StringDecorator({ label: "' + d.Label + '", type: StringType.Text })'
          type = 'string'
        } break;
        case DecoratorType.Number: {
          let inputImp = template.entity.import.number
          let inputImpType = template.entity.import.type.number
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          let impt = listImportType.find(s => s === inputImpType)
          if(!impt) listImportType.push(inputImpType)
          decoratorText = '@NumberDecorator({ label: "' + d.Label + '", type: NumberType.Numberic })'
          type = 'number'
        } break;
        case DecoratorType.Boolean: {
          let inputImp = template.entity.import.boolean
          let inputImpType = template.entity.import.type.boolean
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          let impt = listImportType.find(s => s === inputImpType)
          if(!impt) listImportType.push(inputImpType)
          decoratorText = '@BooleanDecorator({ label: "' + d.Label + '", type: BooleanType.Checkbox })'
          type = 'boolean'
        } break;
        case DecoratorType.Datetime: {
          let inputImp = template.entity.import.datetime
          let inputImpType = template.entity.import.type.datetime
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          let impt = listImportType.find(s => s === inputImpType)
          if(!impt) listImportType.push(inputImpType)
          decoratorText = '@DateTimeDecorator({ label: "' + d.Label + '", type: DateTimeType.DateTime })'
          type = 'Date'
        } break;
        case DecoratorType.DropDown: {
          let inputImp = template.entity.import.dropdown
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          decoratorText = '@DropDownDecorator({ label: "' + d.Label + '" })'
          type = 'number'
        } break;
        case DecoratorType.File: {
          let inputImp = template.entity.import.file
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          decoratorText = '@FileDecorator({ label: "' + d.Label + '", url: "upload/MGUpload" })'
          type = 'string'
        } break;
        case DecoratorType.Image: {
          let inputImp = template.entity.import.image
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          decoratorText = '@ImageDecorator({ label: "' + d.Label + '", url: "upload/MGUpload" })'
          type = 'string'
        } break;
        case DecoratorType.Video: {
          let inputImp = template.entity.import.video
          let imp = listImport.find(s => s === inputImp)
          if (!imp) listImport.push(inputImp)
          decoratorText = '@VideoDecorator({ label: "' + d.Label + '", url: "upload/MGUpload" })'
          type = 'string'
        } break;
        case DecoratorType.Object: {
          decoratorText = ''
          type = 'object'
        } break;
      }
      if (type) {
        if (decoratorText) body += '\t' + decoratorText + '\n'
        body += '\t' + d.Name + ': ' + type + ';\n';
        body += '\n';
      }      
    })

    content = this.getHeaderFile(content, listImport, listImportType);
    content += body;
    
    content += '}\n';
    return content;
  }

  getHeaderFile(content, listImport: string[], listImportType: string[]): string {
    content += template.entity.import.base + '\n';
    content += template.entity.import.table + '\n';
    content += template.entity.import.type.allString.replace('{{TypeImport}}', listImportType.join(', ')) + '\n';
    listImport.forEach(i => {
      content += i + '\n';
    })

    content += '\n\n';
    content += '@TableDecorator()\n';
    content += 'export class ' + this.getUpperCase(this.item.ModuleName) + 'Entity';
    if (this.item.BaseEntity) {
      content += ' extends BaseEntity';
    }
    content += ' {\n'

    return content;
  }

  getModuleFile(content): string {
    let moduleName = this.getUpperCase(this.item.ModuleName)
    let moduleFolder = this.getLowerCase(this.item.ModuleName)
    this.item.ModuleFolder = moduleFolder
    content = template.module.join("\n");
    content = content.replace(/{{ModuleName}}/g, moduleName);
    content = content.replace(/{{ModuleNameLowerCase}}/g, moduleFolder);
    return content
  }

  getComponentFile(content): string {
    let moduleName = this.getUpperCase(this.item.ModuleName)
    let moduleFolder = this.getLowerCase(this.item.ModuleName)
    content = template.component.join("\n");
    content = content.replace(/{{ModuleName}}/g, moduleName);
    content = content.replace(/{{ModuleNameLowerCase}}/g, moduleFolder);
    return content
  }

  getLowerCase(text): string {
    return text.toLowerCase().replace(/ /g, '.');
  }
  getUpperCase(text): string {
    text = text.replace(/\b[a-z]/g, (x) => x.toUpperCase());
    return text.replace(/ /g, '');
  }
}
