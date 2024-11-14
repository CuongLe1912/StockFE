import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LockComponent } from './lock.component';
import { UtilityModule } from '../../utility.module';

@NgModule({
    declarations: [
        LockComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: LockComponent, pathMatch: 'full', data: { state: 'lock'} },
        ])
    ]
})
export class LockModule { }
