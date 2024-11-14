import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../pipes/_pipe.module';
import { EditorModule } from '../editor/editor.module';
import { ModalAlertComponent } from './alert/alert.component';
import { ComponentModule } from '../components/component.module';
import { ModalPromptComponent } from './prompt/prompt.component';
import { DirectiveModule } from '../directives/_directive.module';
import { ModalConfirmComponent } from './confirm/confirm.component';
import { ModalTimeoutComponent } from './timeout/timeout.component';
import { ModalWrapperComponent } from './wrapper/wrapper.component';
import { ModalExportDataComponent } from './export.data/export.data.component';
import { ModalViewProfileComponent } from './view.profile/view.profile.component';
import { ModalEditProfileComponent } from './edit.profile/edit.profile.component';
import { ModalWrapperAboveComponent } from './wrapper.above/wrapper.above.component';
import { ModalChangePasswordComponent } from './change.password/change.password.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        ComponentModule,
        DirectiveModule,
    ],
    declarations: [
        ModalAlertComponent,
        ModalPromptComponent,
        ModalConfirmComponent,
        ModalTimeoutComponent,
        ModalWrapperComponent,
        ModalExportDataComponent,
        ModalViewProfileComponent,
        ModalEditProfileComponent,
        ModalWrapperAboveComponent,
        ModalChangePasswordComponent,
    ],
    exports: [
        ModalAlertComponent,
        ModalPromptComponent,
        ModalConfirmComponent,
        ModalTimeoutComponent,
        ModalWrapperComponent,
        ModalExportDataComponent,
        ModalViewProfileComponent,
        ModalEditProfileComponent,
        ModalWrapperAboveComponent,
        ModalChangePasswordComponent,
    ]
})
export class ModalModule { }
