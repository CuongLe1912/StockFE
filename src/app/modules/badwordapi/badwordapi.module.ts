import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadwordapiComponent } from './badwordapi.component';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../utility.module';
import { AddBadwordComponent } from './add.badword/add.badword.component';
import { EditBadwordComponent } from './edit.badword/edit.badword.component';
import { ImportBadwordComponent } from './import.badword/import.badword.component';
import { DeleteBadwordComponent } from './delete.badword/delete.badword.component';


@NgModule({
  declarations: [
    BadwordapiComponent,
    AddBadwordComponent,
    EditBadwordComponent,
    ImportBadwordComponent,
    DeleteBadwordComponent
  ],
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: BadwordapiComponent, pathMatch: 'full' },
  ]),
  ]
})
export class BadwordapiModule { }
