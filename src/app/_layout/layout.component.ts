declare var require: any
import * as signalR from '@microsoft/signalr';
import { routerTransition } from "../app.animation";
import { UserIdleService } from "angular-user-idle";
import { AppConfig } from '../_core/helpers/app.config';
import { HubDto } from '../_core/domains/objects/hub.dto';
import { VersionService } from "../services/version.service";
import { ToastrHelper } from '../_core/helpers/toastr.helper';
import { DialogData } from '../_core/domains/data/dialog.data';
import { NotifyType } from '../_core/domains/enums/notify.type';
import { MessageDto } from '../_core/domains/objects/message.dto';
import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { NotifyEntity } from '../_core/domains/entities/notify.entity';
import { AdminAuthService } from "../_core/services/admin.auth.service";
import { AdminDataService } from '../_core/services/admin.data.service';
import { AdminEventService } from '../_core/services/admin.event.service';
import { AdminDialogService } from "../_core/services/admin.dialog.service";
import { MCRMCallLogEntity } from '../_core/domains/entities/meeycrm/mcrm.calllog.entity';

@Component({
  animations: [routerTransition],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './layout.component.html',
  styleUrls: [
    '../../assets/plugins/global/plugins.bundle.css', '../../assets/css/style.bundle.css',
    '../../assets/plugins/custom/datatables/datatables.bundle.css',
    '../../assets/css/skins/header/base/dark.css',
    '../../assets/css/skins/header/menu/dark.css',
    '../../assets/css/skins/brand/dark.css',
    '../../assets/css/skins/aside/dark.css',
    '../../assets/css/tooltip.css',
    '../../assets/css/wizard.scss',
    '../../assets/css/icons.scss',
    '../../assets/css/grid.scss',
    '../../assets/css/app.scss',
    './layout.component.scss'
  ]
})
export class LayoutComponent implements OnInit {
  loading: boolean = true;
  dialogRestrict: DialogData;

  constructor(
    public data: AdminDataService,
    public event: AdminEventService,
    public authen: AdminAuthService,
    public userIdle: UserIdleService,
    public dialog: AdminDialogService,
    public versionService: VersionService) {

  }

  async ngOnInit() {
    require('../../assets/plugins/custom/jstree/jstree.bundle.js');
    if (this.authen.account) this.signlar();
    await this.data.loadCountryIp();
    this.loading = false;
    setTimeout(() => {
      let url = window.location.href;
      if (url.indexOf('localhost') < 0) {
        this.versionService.initVersionCheck('version.json', 60000, (version: string) => {
          this.dialog.ConfirmAsync('Đã có phiên bản mới, bạn có muốn cập nhật không?<p>Phiên bản: <b>' + version + '</b></p>', async () => {
            window.location.href = window.location.href;
            location.reload();
          });
        });
      }
      this.dialog.Timeout(this.userIdle, () => { });
    }, 1000);
    // sysend.on('notification', (type: string) => {
    //   if (type == 'new') {
    //     sysend.broadcast('notification', 'close');
    //     if (this.dialogRestrict)
    //       this.dialog.EventHideDialog.emit(this.dialogRestrict);
    //   } else {
    //     this.dialogRestrict = this.dialog.Alert('Hạn chế', 'Bạn đang sử dụng website ở trên một tab khác', true);
    //   }
    // });
    // sysend.broadcast('notification', 'new');
  }


  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }

  private play() {
    try {
      let audio = new Audio();
      audio.src = './assets/soundfiles/all-eyes-on-me.mp3';
      audio.load();
      audio.play();
    }
    catch { }
  }
  private signlar() {
    // Signlar
    let email = this.authen.account.Email;
    let signlarUrl = AppConfig.SignalrUrl + '?email=' + email;
    this.data.connection = new signalR.HubConnectionBuilder()
      .withUrl(signlarUrl)
      .withAutomaticReconnect()
      .build();
    this.connectionStart();
    this.data.connection.onclose(() => {
      //'disconected';
    });
    this.data.connection.on('online', (item: HubDto) => {
      this.event.SignalrNotify.emit({
        type: 'online',
        object: item,
      });
    });
    this.data.connection.on('offline', (item: HubDto) => {
      this.event.SignalrNotify.emit({
        type: 'offline',
        object: item,
      });
    });
    this.data.connection.on('chat', async (item: MessageDto) => {
      this.play();
      this.event.SignalrNotify.emit({
        type: 'chat',
        object: item,
      });
    });
    this.data.connection.on('notify', (notify: NotifyEntity) => {
      this.play();
      if (notify) {
        let needShow: boolean = true;
        switch (notify.Type) {
          case NotifyType.Answer: {
            let json = notify && notify.JsonObject;
            if (json) {
              let obj: MCRMCallLogEntity = JSON.parse(json);
              this.event.SignalrNotify.emit({
                object: obj,
                type: 'call_answer',
              });
              needShow = false;
            }
          }
            break;
          case NotifyType.HangupCall: {
            let json = notify && notify.JsonObject;
            if (json) {
              let obj: MCRMCallLogEntity = JSON.parse(json);
              this.event.SignalrNotify.emit({
                object: obj,
                type: 'call_hangup',
              });
              needShow = false;
            }
          } break;
          case NotifyType.HangupCallDetail: {
            let json = notify && notify.JsonObject;
            if (json) {
              let obj: MCRMCallLogEntity = JSON.parse(json);
              this.event.SignalrNotify.emit({
                object: obj,
                type: 'call_hangup_detail',
              });
              needShow = false;
            }
          }
            break;
          case NotifyType.IncomingCall: {
            let json = notify && notify.JsonObject;
            if (json) {
              let obj: MCRMCallLogEntity = JSON.parse(json);
              this.event.SignalrNotify.emit({
                object: obj,
                type: 'call_incoming',
              });
              needShow = false;
            }
          }
            break;
          case NotifyType.OutcomingCall: {
            let json = notify && notify.JsonObject;
            if (json) {
              let obj: MCRMCallLogEntity = JSON.parse(json);
              this.event.SignalrNotify.emit({
                object: obj,
                type: 'call_outcoming',
              });
              needShow = false;
            }
          }
            break;
          case NotifyType.Logout: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Thông báo', '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>Hệ thống sẽ đăng xuất sau <b> 10 giây </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.LockUser: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Thông báo', '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>Hệ thống sẽ đăng xuất sau <b> 10 giây </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.UpdateRole: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Thông báo', '<p>' + notify.Title + '</p><br /><p>Hệ thống sẽ đăng xuất sau <b> 10 giây </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.ChangePassword: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Thông báo', '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>Hệ thống sẽ đăng xuất sau <b> 10 giây </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
        }

        // show notify
        if (needShow && notify.Title) {
          ToastrHelper.Success(notify.Title);
        }
      }
    });
  }
  private connectionStart() {
    this.data.connection.start().then(async () => {
      //'connected';
    }).catch((err: any) => {
      console.error(err);
      setTimeout(() => {
        if (this.data.connection)
          this.data.connection.start();
      }, 10000);
    });
  }
}
