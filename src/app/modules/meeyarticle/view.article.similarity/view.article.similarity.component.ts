import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActionData } from '../../../_core/domains/data/action.data';
import { EditComponent } from '../../../_core/components/edit/edit.component';

@Component({
    selector: 'ml-view-article-similarity',
    templateUrl: './view.article.similarity.component.html',
    styleUrls: ['./view.article.similarity.component.scss'],
})
export class MLViewArticleSimilarityComponent extends EditComponent implements OnInit {
    id: string;
    code: string;
    articleIds: string;
    @Input() params: any;
    service: MLArticleService;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MLArticleService);
        this.actions.push(ActionData.back(() => {
            this.router.navigateByUrl('/admin/mlarticle');
        }));
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.code = this.getParam('code');
        this.articleIds = this.getParam('articleIds');

        // breadcrumbs
        this.breadcrumbs.push({ Name: 'Xem chi tiết độ trùng tin đăng: [' + this.code + ']' })
    }
}