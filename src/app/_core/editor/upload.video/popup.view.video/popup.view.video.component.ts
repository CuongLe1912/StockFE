declare var require: any
import * as _ from 'lodash';
import { Carousel, Panzoom } from "@fancyapps/ui";
import { Component, Input, OnInit } from '@angular/core';
import { FileData } from '../../../domains/data/file.data';

@Component({
    templateUrl: './popup.view.video.component.html',
    styleUrls: ['./popup.view.video.component.scss'],
})
export class PopupViewVideoComponent implements OnInit {
    youtube: boolean;
    videos: string[];
    items: FileData[];
    @Input() params: any;

    constructor() {
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        this.videos = this.params && this.params['videos'];
        if (this.videos && this.videos.length > 0) {
            for (let i = 0; i < this.videos.length; i++) {
                if (this.videos[i].indexOf('youtube') >= 0) {
                    this.youtube = true;
                    this.videos[i] = this.videos[i].replace('watch?v=', 'embed/').replace('shorts/', 'embed/');
                }
            }
        }
        if (this.items || this.videos) {
            setTimeout(() => {
                const mainCarousel = new Carousel(document.querySelector("#mainVideoCarousel"), {
                    Dots: false,
                });
                if (!this.youtube) {
                    new Carousel(document.querySelector("#thumbVideoCarousel"), {
                        Sync: {
                            target: mainCarousel,
                            friction: 0,
                        },
                        Dots: false,
                        center: true,
                        infinite: false,
                        Navigation: false,
                    });
                }
            }, 300);
        }
    }
}