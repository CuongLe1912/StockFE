import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { ConfigurationService } from "./configuration.service";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ConfigurationComponent } from "./edit.configuration/edit.configuration.component";

@NgModule({
    declarations: [
        ConfigurationComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ConfigurationComponent, pathMatch: 'full', data: { state: 'configuration' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [ConfigurationService]
})
export class ConfigurationModule { }