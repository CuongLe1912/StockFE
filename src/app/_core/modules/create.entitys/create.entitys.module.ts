import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEntitysComponent } from './create.entitys.component';
import { UtilityModule } from '../../../modules/utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../guards/admin.auth.guard';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { CreateEntityService } from './create.entitys.service';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    CodemirrorModule,
    RouterModule.forChild([
      { path: '', component: CreateEntitysComponent, pathMatch: 'full', data: { state: 'create.entitys' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [CreateEntitysComponent],
  providers: [CreateEntityService],
})
export class CreateEntitysModule { }
