declare var require: any
import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { FileData } from '../../../../_core/domains/data/file.data';

@Component({
    templateUrl: './popup.edit.image.component.html',
    styleUrls: ['./popup.edit.image.component.scss'],
})
export class PopupEditImageComponent implements OnInit {
    editor: any;
    initData: any;
    item: FileData;
    @Input() params: any;

    constructor() {
    }

    ngOnInit() {
        this.item = this.params && this.params['item'];
        if (this.item) {
            const ImageEditor = require('tui-image-editor');
            setTimeout(() => {
                if (this.item.Data) {
                    this.editor = new ImageEditor(document.getElementById('tui-image-editor'), {
                        includeUI: {
                            loadImage: {
                                name: 'Blank',
                                path: this.item.Data,
                            },
                            menuBarPosition: 'right'
                        },
                        cssMaxWidth: 700,
                        cssMaxHeight: 700
                    });
                } else if (this.item.Path) {
                    this.editor = new ImageEditor(document.getElementById('tui-image-editor'), {
                        includeUI: {
                            loadImage: {
                                name: 'Blank',
                                path: this.item.Path,
                            },
                            menuBarPosition: 'right'
                        },
                        cssMaxWidth: 700,
                        cssMaxHeight: 700
                    });

                    this.editor.loadImageFromURL = (() => {
                        let cached_function = this.editor.loadImageFromURL;
                        function waitUntilImageEditorIsUnlocked(imageEditor) {
                            return new Promise<void>((resolve, reject) => {
                                const interval = setInterval(() => {
                                    if (!imageEditor._invoker._isLocked) {
                                        clearInterval(interval);
                                        resolve();
                                    }
                                }, 100);
                            })
                        }
                        return async () => {
                            await waitUntilImageEditorIsUnlocked(this.editor);
                            return cached_function.apply(this);
                        };
                    })();

                    this.editor.loadImageFromURL(this.item.Path, this.item.Name).then((result: any) => {
                        this.editor.ui.resizeEditor({
                            imageSize: { oldWidth: result.oldWidth, oldHeight: result.oldHeight, newWidth: result.newWidth, newHeight: result.newHeight },
                        });
                    }).catch((err: any) => {
                        //ToastrHelper.Error(err);
                    });
                }
            }, 500);
        }
    }

    async confirm() {
        if (this.editor) {
            this.item.Path = '';
            this.item.Data = this.editor.toDataURL();
        }
        return this.item;
    }
}