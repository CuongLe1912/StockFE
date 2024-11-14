import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { ResetPasswordComponent } from './reset.password.component';

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: ResetPasswordComponent, pathMatch: 'full', data: { state: 'resetpassword'} },
        ])
    ]
})
export class ResetPasswordModule { }
