import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../pipes/_pipe.module';
import { ChatComponent } from './chat/chat.component';
import { CallComponent } from './call/call.component';
import { EditorModule } from '../editor/editor.module';
import { PagingComponent } from './paging/paging.component';
import { LoadingComponent } from './loading/loading.component';
import { DirectiveModule } from '../directives/_directive.module';
import { DropdownComponent } from './dropdown/dropdown.component';
import { HistoryComponent } from './edit/history/history.component';
import { EditHeaderComponent } from './edit/header/edit.header.component';
import { FileManagerComponent } from './file.manager/file.manager.component';
import { GridEditAutoComponent } from './grid/edit.auto/edit.auto.component';
import { GridEditPopupComponent } from './grid/edit.popup/edit.popup.component';
import { RequestFilterComponent } from './request.filter/request.filter.component';
import { EditHeaderViewComponent } from './edit/header.view/edit.header.view.component';
import { GridEditPopupAutoComponent } from './grid/edit.popup.auto/edit.popup.auto.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule,
    ],
    declarations: [
        ChatComponent,
        CallComponent,
        PagingComponent,
        LoadingComponent,
        HistoryComponent,
        DropdownComponent,
        EditHeaderComponent,
        FileManagerComponent,
        GridEditAutoComponent,
        GridEditPopupComponent,
        RequestFilterComponent,
        EditHeaderViewComponent,
        GridEditPopupAutoComponent,
    ],
    exports: [
        ChatComponent,
        CallComponent,
        PagingComponent,
        LoadingComponent,
        HistoryComponent,
        DropdownComponent,
        EditHeaderComponent,
        FileManagerComponent,
        GridEditAutoComponent,
        RequestFilterComponent,
        GridEditPopupComponent,
        EditHeaderViewComponent,
        GridEditPopupAutoComponent,
    ]
})
export class ComponentModule { }
