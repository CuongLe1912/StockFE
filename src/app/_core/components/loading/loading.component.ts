import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: 'loading',
    styleUrls: ['./loading.scss'],
    templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {
    @Input() icon: string;
    @Input() text: string;
    @Input() overlay: boolean;

    ngOnInit() {
        if (this.overlay == null) this.overlay = true;
        if (!this.text) this.text = 'Đang tải dữ liệu...';
    }
}
