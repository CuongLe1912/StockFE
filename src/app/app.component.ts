import { routerTransition } from './app.animation';
import { AppConfig } from './_core/helpers/app.config';
import { Component, HostListener } from '@angular/core';
import { VersionService } from './services/version.service';
import { AdminDialogService } from './_core/services/admin.dialog.service';

@Component({
  selector: 'meey-root',
  animations: [routerTransition],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    public dialog: AdminDialogService,
    public versionService: VersionService) {
    AppConfig.setEnvironment();
  }
  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      this.dialog.HideAllDialog();
    }
  }
}
