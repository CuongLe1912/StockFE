import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup.signin.gmail',
  templateUrl: './popup.signin.gmail.component.html',
  styleUrls: ['./popup.signin.gmail.component.scss']
})
export class PopupSigninGmailComponent implements OnInit {

  message: any;
  @Input() params: any;

  constructor() { }

  ngOnInit() {
    this.message = this.params && this.params['message'];
  }

  confirm() {
    return true;
  }
}
