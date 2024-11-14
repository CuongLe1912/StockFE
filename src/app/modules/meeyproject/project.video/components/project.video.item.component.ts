import { Component, Input } from "@angular/core";

@Component({
    templateUrl: "./project.video.item.component.html",
    styleUrls: ["./project.video.item.component.scss"],
})
export default class MPOProjectVideoItemComponent {
    @Input() item: any;
}
