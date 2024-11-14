declare var require: any
import * as _ from 'lodash';
import { Carousel, Panzoom } from "@fancyapps/ui";
import { Component, Input, OnInit } from '@angular/core';
import { FileData } from '../../../domains/data/file.data';
import { Autoplay } from "@fancyapps/ui/dist/carousel.autoplay.esm.js";
Carousel.Plugins.Autoplay = Autoplay;

@Component({
    templateUrl: './popup.view.image.component.html',
    styleUrls: ['./popup.view.image.component.scss'],
})
export class PopupViewImageComponent implements OnInit {
    images: string[];
    items: FileData[];
    index: number = 0;
    @Input() params: any;

    constructor() {
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        this.images = this.params && this.params['images'];
        this.index = this.params && this.params['index'];

        if (this.items || this.images) {
            setTimeout(() => {
                const mainCarousel = new Carousel(document.querySelector("#mainCarousel"), {
                    Dots: false,
                    initialPage: this.index,
                    on: {
                        createSlide: (carousel, slide) => {
                            slide.Panzoom = new Panzoom(slide.$el.querySelector(".panzoom"), {
                                panOnlyZoomed: true,
                                resizeParent: true,
                            });
                        },
                        deleteSlide: (carousel, slide) => {
                            if (slide.Panzoom) {
                                slide.Panzoom.destroy();
                                slide.Panzoom = null;
                            }
                        },
                    },
                    Autoplay: {
                        timeout: 3000
                    }
                });
                new Carousel(document.querySelector("#thumbCarousel"), {
                    Sync: {
                        target: mainCarousel,
                        friction: 0,
                    },
                    Dots: false,
                    center: true,
                    infinite: false,
                    Navigation: false,
                    keyboard: {
                        PageUp: "next",
                        Escape: "close",
                        Delete: "close",
                        ArrowUp: "next",
                        PageDown: "prev",
                        ArrowDown: "prev",
                        ArrowLeft: "prev",
                        Backspace: "close",
                        ArrowRight: "next",
                    }
                });
            }, 300);
        }
    }
}