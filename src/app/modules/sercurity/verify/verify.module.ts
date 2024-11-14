import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { VerifyComponent } from './verify.component';

@NgModule({
    declarations: [
        VerifyComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: VerifyComponent, pathMatch: 'full', data: { state: 'verify'} },
        ])
    ]
})
export class VerifyModule { }
