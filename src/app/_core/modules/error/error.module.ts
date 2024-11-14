
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Error404Component } from './404/404.component';
import { Error503Component } from './503/503.component';
import { Error403Component } from './403/403.component';

@NgModule({
    declarations: [
        Error404Component,
        Error403Component,
        Error503Component
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        RouterModule.forChild([           
            { path: '', component: Error404Component, pathMatch: 'full' },
            { path: '404', component: Error404Component, pathMatch: 'full' },
            { path: '503', component: Error503Component, pathMatch: 'full' },
            { path: '403', component: Error403Component, pathMatch: 'full' },
            { path: '**', component: Error404Component, pathMatch: 'full' },
        ])
    ]
})
export class ErrorModule { }
