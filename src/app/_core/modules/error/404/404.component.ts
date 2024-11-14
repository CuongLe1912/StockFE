import { Router } from "@angular/router";
import { Component } from "@angular/core";

@Component({
    styleUrls: ['../error.scss'],
    templateUrl: './404.component.html',
})
export class Error404Component {
    constructor(public router: Router) {

    }
}
