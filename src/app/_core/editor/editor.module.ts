import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { PipeModule } from '../pipes/_pipe.module';
import { OtpComponent } from './otp/otp.component';
import { EditorComponent } from './editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonComponent } from './button/button.component';
import { HtmlBoxComponent } from './htmlbox/htmlbox.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { JsonBoxComponent } from './jsonbox/jsonbox.component';
import { AddressComponent } from './address/address.component';
import { DirectiveModule } from '../directives/_directive.module';
import { NumbericComponent } from './numberic/numberic.component';
import { DateTimeComponent } from './datetime/datetime.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { CheckBoxComponent } from './checkbox/checkbox.component';
import { ComboBoxComponent } from './combobox/combobox.component';
import { PhoneBoxComponent } from './phonebox/phonebox.component';
import { PasswordComponent } from './password/password.component';
import { UploadFileComponent } from './upload.file/upload.file.component';
import { UploadVideoComponent } from './upload.video/upload.video.component';
import { UploadImageComponent } from './upload.image/upload.image.component';
import { RadioButtonComponent } from './radio.button/radio.button.component';
import { CheckBoxListComponent } from './checkbox.list/checkbox.list.component';
import { PopupEditImageComponent } from './upload.image/popup.edit.image/popup.edit.image.component';
import { PopupViewImageComponent } from './upload.image/popup.view.image/popup.view.image.component';
import { PopupViewVideoComponent } from './upload.video/popup.view.video/popup.view.video.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        CommonModule,
        DragDropModule,
        DirectiveModule,
        NgOtpInputModule,
    ],
    declarations: [
        OtpComponent,
        ButtonComponent,
        EditorComponent,
        TextBoxComponent,
        HtmlBoxComponent,
        JsonBoxComponent,
        AddressComponent,
        TextAreaComponent,
        CheckBoxComponent,
        ComboBoxComponent,
        DateTimeComponent,
        NumbericComponent,
        PhoneBoxComponent,
        PasswordComponent,
        UploadFileComponent,
        RadioButtonComponent,
        UploadImageComponent,
        UploadVideoComponent,
        CheckBoxListComponent,
        PopupEditImageComponent,
        PopupViewImageComponent,
        PopupViewVideoComponent
    ],
    exports: [
        OtpComponent,
        ButtonComponent,
        EditorComponent,
        TextBoxComponent,
        HtmlBoxComponent,
        JsonBoxComponent,
        AddressComponent,
        TextAreaComponent,
        CheckBoxComponent,
        ComboBoxComponent,
        DateTimeComponent,
        NumbericComponent,
        PhoneBoxComponent,
        PasswordComponent,
        UploadFileComponent,
        UploadVideoComponent,
        RadioButtonComponent,
        UploadImageComponent,
        CheckBoxListComponent,
        PopupViewImageComponent,
        PopupViewVideoComponent
    ]
})
export class EditorModule { }
