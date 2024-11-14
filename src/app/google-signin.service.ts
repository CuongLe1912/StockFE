import { Injectable } from '@angular/core';
import { createMimeMessage } from 'mimetext';
import { Observable, ReplaySubject } from 'rxjs';
import { FileData } from './_core/domains/data/file.data';

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {
  //hướng dẫn kết nối : https://www.youtube.com/watch?v=G5HPBdZgcx8
  // - https://developers.google.com/identity/sign-in/web/reference

  private CLIENT_ID = '671021191667-480t8tvt49a46ioqehnii0t5v22hqvrj.apps.googleusercontent.com'
  private API_KEY = 'AIzaSyBbqM0m8U-OoFnNGdSMmUFQDSv-Jlc6lzE'
  private SCOPE = 'https://www.googleapis.com/auth/gmail.send'
  private DISCOVERY_DOCS = ['https://gmail.googleapis.com/$discovery/rest?version=v1'];
  private PLUGIN_NAME = 'meey-admin';
  private GOOGLE_PLATFORM_API = 'https://apis.google.com/js/platform.js?onload=init'

  private auth2: gapi.auth2.GoogleAuth
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)

  constructor() {
    this.loadScript(this.GOOGLE_PLATFORM_API, () => {
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: this.API_KEY,
          clientId: this.CLIENT_ID,
          discoveryDocs: this.DISCOVERY_DOCS,
          scope: this.SCOPE,
          plugin_name: this.PLUGIN_NAME
        }).then(() => {
          this.auth2 = window.gapi.auth2.getAuthInstance();
        });
      });
    });
  }

  public signIn(): Promise<gapi.auth2.GoogleUser> {
    return new Promise((resolve, reject) => {
      this.auth2.signIn({
        scope: this.SCOPE,
        prompt: 'select_account'
      }).then(user => {
        this.subject.next(user);
        resolve(user)
      }).catch((error) => {
        this.subject.next(null);
        reject(error)
      })
    })
  }

  public currentUser(): gapi.auth2.GoogleUser {
    if (this.auth2?.currentUser)
      return this.auth2.currentUser.get();
    return null;
  }

  public signOut() {
    return this.auth2.signOut().then(() => {
      this.subject.next(null);
    })
  }

  public observable(): Observable<gapi.auth2.GoogleUser> {
    return this.subject.asObservable();
  }

  public sendMessage(user: gapi.auth2.GoogleUser, subject, body, from: { name: string, addr: string }, to: string[], cc: string[] = [], bcc: string[] = [], attachment: FileData[] = []) {
    const msg = createMimeMessage()
    msg.setSender({
      name: "=?utf-8?B?" + window.btoa(unescape(encodeURIComponent(from.name))) + "?=",
      addr: from.addr
    })
    msg.setTo(to)
    msg.setCc(cc)
    msg.setBcc(bcc)
    msg.setSubject(subject)
    msg.setMessage('text/plain', body)
    msg.setMessage('text/html', body)

    attachment.forEach(async (file: FileData) => {
      let base64result = file.Data.split(',')[1];
      msg.setAttachment(file.Name, file.NativeData.type, base64result)
    });

    return new Promise((resolve, reject) => {
      gapi.client.gmail.users.messages.send({
        userId: user.getId(),
        access_token: user.getAuthResponse().access_token,
        resource: {
          raw: msg.asEncoded()
        }
      }).then(response => {
        resolve(response.result)
      }).catch((error) => {
        reject(error.result)
      })
    })
  }

  private loadScript(url: string, complete: any) {
    let node: any = document.createElement('script');
    node.src = url; node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
    if (node.readyState) { // only required for IE <9
      node.onreadystatechange = () => {
        if (node.readyState === "loaded" || node.readyState === "complete") {
          node.onreadystatechange = null;
          complete();
        }
      };
    } else { //Others
      node.onload = () => {
        complete();
      };
    }
  }
}
