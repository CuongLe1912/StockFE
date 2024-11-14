import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLScheduleType } from '../../../_core/domains/entities/meeyland/enums/ml.schedule.type';
import { MLArticlePostType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './popup.schedule.article.component.html',
    styleUrls: ['./popup.schedule.article.component.scss'],
})
export class MLPopupScheduleArticleComponent implements OnInit {
    dates: Date[];
    dayTab: string;
    timeTab: string;
    typeTab: string;
    activeDay: number;
    @Input() params: any;
    item: MLArticleEntity;
    disabled: boolean = true;
    houseTimes: string[] = [];
    service: MLArticleService;
    activeChoiceDate: boolean;
    workingTimes: string[] = [];
    enableEventChange: boolean = true;
    MLArticlePostType = MLArticlePostType;

    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        this.enableEventChange = false;
        let hours = [18, 19, 20, 21, 22];
        hours.forEach((hour: number) => {
            let time = hour < 10 ? '0' + hour.toString() : hour.toString(),
                nextTime = (hour + 1) < 10 ? '0' + (hour + 1).toString() : (hour + 1).toString();
            this.houseTimes.push(time + ':00 - ' + time + ':30');
            this.houseTimes.push(time + ':30 - ' + nextTime + ':00');
        });

        hours = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17];
        hours.forEach((hour: number) => {
            let time = hour < 10 ? '0' + hour.toString() : hour.toString(),
                nextTime = (hour + 1) < 10 ? '0' + (hour + 1).toString() : (hour + 1).toString();
            this.workingTimes.push(time + ':00 - ' + time + ':30');
            this.workingTimes.push(time + ':30 - ' + nextTime + ':00');
        });
        let item: MLArticleEntity = this.params && this.params['item'];
        if (item) {
            if (!item.Id) item.Id = item.Id;
            if (!item.ScheduleDays) item.ScheduleDays = [];
            if (!item.ScheduleTimes) item.ScheduleTimes = [];
            if (!item.ReviewTypes) item.ReviewTypes = '[' + MLScheduleType.Online + ',' + MLScheduleType.Offline + ']';
            this.activeDay = item.VipType == 'normal'
                ? item.PublishDayNumber || 30
                : item.PublishDayChoice || 7;
            if (this.activeDay > 30) this.activeDay = 30;
            if (item.ScheduleDays.length == 0) {
                for (let i = 0; i < this.activeDay; i++) {
                    let publishDate: Date = _.cloneDeep(new Date(item.PublishTime));
                    publishDate.setDate(publishDate.getDate() + i + 1);
                    item.ScheduleDays.push(publishDate);
                }
            }
            this.item = _.cloneDeep(item);
            this.updateReviewTypeStrings();
        }
        setTimeout(() => this.enableEventChange = true, 1000);
    }

    selectedDayTab(tab: string) {
        this.dayTab = tab;
    }
    selectedTimeTab(tab: string) {
        this.timeTab = tab;
    }
    selectedTypeTab(tab: string) {
        this.typeTab = tab;
    }

    houseTimeChange() {
        if (this.item.HouseTime) {
            this.houseTimes.forEach((time: string) => {
                this.item.ScheduleTimes.push(time);
            });
        } else {
            this.houseTimes.forEach((time: string) => {
                this.item.ScheduleTimes = this.item.ScheduleTimes.filter(c => c != time);
            });
        }
        this.toggleDisableButton();
    }
    reviewTypeChange() {
        this.updateReviewTypeStrings();
        this.toggleDisableButton();
    }
    scheduleDayChange() {
        if (this.enableEventChange) {
            this.item.ScheduleDays = this.item.ScheduleDays && this.item.ScheduleDays.sort((a, b) => a.getTime() - b.getTime());
            this.toggleDisableButton();
        }
    }
    workingTimeChange() {
        if (this.item.WorkingTime) {
            this.workingTimes.forEach((time: string) => {
                this.item.ScheduleTimes.push(time);
            });
        } else {
            this.workingTimes.forEach((time: string) => {
                this.item.ScheduleTimes = this.item.ScheduleTimes.filter(c => c != time);
            });
        }
        this.toggleDisableButton();
    }
    scheduleTypeChange() {
        if (this.item.PostType == MLArticlePostType.Repeat) {
            this.typeTab = 'time';
        } else this.typeTab = 'day';
    }
    choiceTimeGold(time: string) {
        if (this.item.ScheduleTimes.indexOf(time) == -1)
            this.item.ScheduleTimes.push(time);
        else
            this.item.ScheduleTimes = this.item.ScheduleTimes.filter(c => c != time);

        this.item.WorkingTime = true;
        let hours = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17];
        hours.forEach((hour: number) => {
            let time = hour < 10 ? '0' + hour.toString() : hour.toString(),
                nextTime = (hour + 1) < 10 ? '0' + (hour + 1).toString() : (hour + 1).toString();

            let timeText = time + ':00 - ' + time + ':30';
            if (this.item.ScheduleTimes.indexOf(timeText) == -1) {
                this.item.WorkingTime = false;
                return;
            }

            timeText = time + ':30 - ' + nextTime + ':00';
            if (this.item.ScheduleTimes.indexOf(timeText) == -1) {
                this.item.WorkingTime = false;
                return;
            }
        });
        this.toggleDisableButton();
    }
    choiceTimeOther(time: string) {
        if (this.item.ScheduleTimes.indexOf(time) == -1)
            this.item.ScheduleTimes.push(time);
        else
            this.item.ScheduleTimes = this.item.ScheduleTimes.filter(c => c != time);

        this.item.HouseTime = true;
        let hours = [18, 19, 20, 21, 22];
        hours.forEach((hour: number) => {
            let time = hour < 10 ? '0' + hour.toString() : hour.toString(),
                nextTime = (hour + 1) < 10 ? '0' + (hour + 1).toString() : (hour + 1).toString();

            let timeText = time + ':00 - ' + time + ':30';
            if (this.item.ScheduleTimes.indexOf(timeText) == -1) {
                this.item.HouseTime = false;
                return;
            }

            timeText = time + ':30 - ' + nextTime + ':00';
            if (this.item.ScheduleTimes.indexOf(timeText) == -1) {
                this.item.HouseTime = false;
                return;
            }
        });
        this.toggleDisableButton();
    }
    removeScheduleDay(date: Date) {
        if (this.item.ScheduleDays) {
            this.item.ScheduleDays = this.item.ScheduleDays.filter(c => c != date);
        }
    }

    async confirm() {
        let valid = this.item.ReviewTypeStrings &&
            this.item.ScheduleDays && this.item.ScheduleDays.length > 0 &&
            this.item.ScheduleTimes && this.item.ScheduleTimes.length > 0;
        if (valid) return this.item;
        return null;
    }

    private toggleDisableButton() {
        let valid = this.item.ReviewTypeStrings &&
            this.item.ScheduleDays && this.item.ScheduleDays.length > 0 &&
            this.item.ScheduleTimes && this.item.ScheduleTimes.length > 0;
        this.disabled = !valid;
    }
    private updateReviewTypeStrings() {
        this.item.ReviewTypeStrings = '';
        if (this.item.ReviewTypes && this.item.ReviewTypes.length > 0) {
            let values = this.item.ReviewTypes && JSON.parse(this.item.ReviewTypes) as any[];
            values.forEach((type: any) => {
                let optionItem = ConstantHelper.ML_SCHEDULE_TYPES.find(c => c.value == type);
                if (optionItem) {
                    this.item.ReviewTypeStrings += this.item.ReviewTypeStrings
                        ? ', ' + optionItem.label
                        : optionItem.label;
                }
            });
        }
    }
}