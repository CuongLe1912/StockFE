import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './signin.component';
import { UtilityModule } from '../../utility.module';
import { ForgotPasswordComponent } from './forgot.password/forgot.password.component';

@NgModule({
    declarations: [
        SignInComponent,
        ForgotPasswordComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: SignInComponent, pathMatch: 'full', data: { state: 'signin'} },
        ])
    ]
})
export class SignInModule { }
