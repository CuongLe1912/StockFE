import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { DateTimeType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticlePostType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: './popup.push.article.component.html',
    styleUrls: ['./popup.push.article.component.scss'],
})
export class MLPopupPushArticleComponent implements OnInit {
    dates: Date[];
    dayTab: string;
    loaded: boolean;
    timeTab: string;
    totalDay: number;
    totalTime: number;
    activeDay: number;
    pricePush: number;
    totalHour: number;
    @Input() params: any;
    item: MLArticleEntity;
    typeTab: string = 'time';
    disabled: boolean = true;
    service: MLArticleService;
    activeChoiceDate: boolean;
    DateTimeType = DateTimeType;
    selectedTimeOthers: string[] = [];
    enableEventChange: boolean = false;
    MLArticlePostType = MLArticlePostType;
    times: { day: string, timeGolds: OptionItem[], timeOthers: OptionItem[] }[];

    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        this.pricePush = this.params && this.params['pricePush'];
        let item = this.params && this.params['item'] as MLArticleEntity;
        if (item) {
            if (!item.PushTime)
                item.PushTime = _.cloneDeep(new Date(item.PublishTime));
            if (!item.PostType) {
                item.PostType = MLArticlePostType.Repeat;
            }
            if (!item.PostNumber) {
                let day1 = item.PushTime.getTime(),
                    day2 = item.ExpireTime.getTime(),
                    difference = Math.abs(day2 - day1),
                    days = difference / (1000 * 3600 * 24);
                item.PostNumber = Math.round(days);
            }
            if (!item.MaxPostNumber) item.MaxPostNumber = item.PostNumber + 1;

            this.activeDay = item.VipType == 'normal'
                ? item.PublishDayNumber || 999
                : item.PublishDayChoice || 7;
            this.typeTab = item.PostType == MLArticlePostType.Repeat ? 'time' : 'day';

            // times
            this.times = [];
            if (item.PushTimes && item.PushTimes.length > 0) {
                item.PushTimes.forEach((time) => {
                    let timeGolds = UtilityExHelper.createTimes([8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23], false, time);
                    let timeOthers = UtilityExHelper.createTimes([6, 7, 12, 15, 16, 17, 18, 19], true, time);
                    this.times.push({
                        day: time.Day,
                        timeGolds: timeGolds,
                        timeOthers: timeOthers
                    });
                });
            } else this.times.push(UtilityExHelper.createDefaultTime());
            setTimeout(() => { this.loaded = true }, 1000);
        }
        setTimeout(() => { this.enableEventChange = true }, 1000);
        this.item = _.cloneDeep(item);
        this.updatePushTimes();
    }

    resetTimes() {
        this.item.PushTime = _.cloneDeep(new Date(this.item.PublishTime));
        this.item.PostType = MLArticlePostType.Repeat;
        let day1 = this.item.PushTime.getTime(),
            day2 = this.item.ExpireTime.getTime(),
            difference = Math.abs(day2 - day1),
            days = difference / (1000 * 3600 * 24);
        this.item.PostNumber = Math.round(days);
        this.activeDay = this.item.VipType == 'normal'
            ? this.item.PublishDayNumber || 999
            : this.item.PublishDayChoice || 7;
        this.item.PushTimes = null;
        this.item.PostDays = null;
        this.times = [];
        this.times.push(UtilityExHelper.createDefaultTime());
        this.updatePushTimes();
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

    postTypeChange() {
        this.typeTab = this.item.PostType == MLArticlePostType.Repeat ? 'time' : 'day';
        if (this.item.PostType == MLArticlePostType.Repeat) {
            this.item.PostByEachDay = false;
        }
        this.postByEachDayChange();
    }
    postDaysChange() {
        this.item.PostDays = this.item.PostDays && this.item.PostDays.sort((a, b) => a.getTime() - b.getTime());
        let hours = this.item.PublishTime.getHours(),
            minutes = this.item.PublishTime.getMinutes(),
            seconds = this.item.PublishTime.getSeconds();
        if (this.item.PostDays && this.item.PostDays.length > 0) {
            let pushTime: Date = _.cloneDeep(this.item.PostDays[0]);
            if (pushTime <= this.item.PublishTime) {
                pushTime.setHours(hours); pushTime.setMinutes(minutes); pushTime.setSeconds(seconds);
                this.item.PushTime = pushTime;
            } else this.item.PushTime = pushTime;
        }
        this.postByEachDayChange();
    }
    pushTimeChange() {
        if (this.enableEventChange) {
            let hours = this.item.PublishTime.getHours(),
                minutes = this.item.PublishTime.getMinutes(),
                seconds = this.item.PublishTime.getSeconds(),
                expireTime = _.cloneDeep(this.item.ExpireTime),
                pushTime: Date = _.cloneDeep(this.item.PushTime);
            pushTime.setHours(hours); pushTime.setMinutes(minutes); pushTime.setSeconds(seconds);

            let day1 = pushTime.getTime(),
                day2 = expireTime.getTime(),
                difference = Math.abs(day2 - day1),
                days = Math.round(difference / (1000 * 3600 * 24));
            this.item.PostNumber = Math.round(days);
            this.item.PushTime = pushTime;
        }
        setTimeout(() => { this.enableEventChange = true }, 1000);
    }
    postNumberChange() {
        this.updatePushTimes();
    }
    postByEachDayChange() {
        if (this.loaded) {
            let times = [];
            if (!this.item.PostByEachDay) times.push(UtilityExHelper.createDefaultTime());
            else if (this.item.PostDays && this.item.PostDays.length > 0) {
                times = [];
                this.item.PostDays.forEach((item: Date) => {
                    let today = new Date(),
                        hour = today.getHours(),
                        day = UtilityExHelper.dateString(item);
                    if (today < item) {
                        times.push({
                            day: day,
                            timeOthers: UtilityExHelper.createTimes([6, 7, 12, 15, 16, 17, 18, 19], false),
                            timeGolds: UtilityExHelper.createTimes([8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23], true),
                        });
                    } else {
                        times.push({
                            day: day,
                            timeOthers: UtilityExHelper.createTimes([6, 7, 12, 15, 16, 17, 18, 19], false),
                            timeGolds: UtilityExHelper.createTimes([8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23], true),
                        });
                    }
                });
            }
            this.times = times;
            this.updatePushTimes();
        }
        if (this.typeTab != 'day')
            this.typeTab = this.times && this.times.length > 0 && this.times[0].day;
    }
    removePostDay(date: Date) {
        if (this.item.PostDays) {
            this.item.PostDays = this.item.PostDays.filter(c => c != date);
        }
        if (this.item.PostDays && this.item.PostDays.length > 0) {
            let hours = this.item.PublishTime.getHours(),
                minutes = this.item.PublishTime.getMinutes(),
                seconds = this.item.PublishTime.getSeconds();
            let pushTime: Date = _.cloneDeep(this.item.PostDays[0]);
            if (pushTime <= this.item.PublishTime) {
                pushTime.setHours(hours); pushTime.setMinutes(minutes); pushTime.setSeconds(seconds);
                this.item.PushTime = pushTime;
            } else this.item.PushTime = pushTime;
        }
    }
    choiceTime(time: OptionItem) {
        time.selected = !time.selected;
        this.updatePushTimes();
    }

    async confirm() {
        let valid = this.totalTime > 0;
        if (valid) return this.item;
        return null;
    }

    private updatePushTimes() {
        this.item.PushTimes = [];
        this.updateDiabledPushTimes();
        this.times.forEach((time: any) => {
            let allTimes: string[] = [];
            if (time.timeGolds && time.timeGolds.length > 0) {
                time.timeGolds.forEach((item: OptionItem) => {
                    if (item.selected) allTimes.push(item.value);
                });
            }
            if (time.timeOthers && time.timeOthers.length > 0) {
                time.timeOthers.forEach((item: OptionItem) => {
                    if (item.selected) allTimes.push(item.value);
                });
            }
            this.item.PushTimes.push({ Day: time.day, Times: allTimes });
        });
        this.totalDay = 0; this.totalHour = 0; this.totalTime = 0;

        let pushTime = this.item.PushTime,
            expireTime = this.item.ExpireTime;
        if (pushTime && expireTime) {
            let pushHour = pushTime.getHours(),
                expireHour = expireTime.getHours(),
                pushMinute = pushTime.getMinutes(),
                expireMinute = expireTime.getMinutes(),
                toDay = UtilityExHelper.dateString(new Date()),
                expireDay = UtilityExHelper.dateString(expireTime);
            if (this.item.PushTimes && this.item.PushTimes.length > 0) {
                if (this.item.PostType == MLArticlePostType.Repeat) {
                    this.totalDay = this.item.PostNumber;
                    this.totalHour = this.item.PushTimes[0].Times && this.item.PushTimes[0].Times.length;
                    for (let i = 0; i < this.totalDay; i++) {
                        let times = this.item.PushTimes[0].Times,
                            choiceDate: Date = _.cloneDeep(pushTime);
                        choiceDate.setDate(choiceDate.getDate() + i);
                        let choiceDay = UtilityExHelper.dateString(choiceDate);
                        times.forEach((itemTime: string) => {
                            this.totalTime += 1;
                            let hour = parseInt(itemTime.split(':')[0]),
                                minute = parseInt(itemTime.split(':')[1]);
                            if (toDay == choiceDay) {
                                if (pushHour > hour) this.totalTime -= 1;
                                else if (pushHour == hour && pushMinute > minute) this.totalTime -= 1;
                            }
                            if (expireDay == choiceDay) {
                                if (expireHour < hour) this.totalTime -= 1;
                                else if (expireHour == hour && expireMinute < minute) this.totalTime -= 1;
                            }
                        });
                    }
                } else {
                    let time: number = 0;
                    this.totalDay = this.item.PostDays && this.item.PostDays.length;
                    this.totalHour = this.item.PushTimes[0].Times && this.item.PushTimes[0].Times.length;
                    if (this.item.PostByEachDay) {
                        this.item.PushTimes.forEach(element => {
                            time += element.Times ? element.Times.length : 0;
                        });
                        this.totalHour = 0;
                        this.totalTime = time;
                    } else {
                        if (!this.item.PostDays) this.item.PostDays = [];
                        this.item.PostDays.forEach((choiceDate: Date) => {
                            let times = this.item.PushTimes[0].Times,
                                choiceDay = UtilityExHelper.dateString(choiceDate);
                            times.forEach((itemTime: string) => {
                                this.totalTime += 1;
                                let hour = parseInt(itemTime.split(':')[0]),
                                    minute = parseInt(itemTime.split(':')[1]);
                                if (toDay == choiceDay) {
                                    if (pushHour > hour) this.totalTime -= 1;
                                    else if (pushHour == hour && pushMinute > minute) this.totalTime -= 1;
                                }
                                if (expireDay == choiceDay) {
                                    if (expireHour < hour) this.totalTime -= 1;
                                    else if (expireHour == hour && expireMinute < minute) this.totalTime -= 1;
                                }
                            });
                        });
                    }
                }
            }
        }
        this.toggleDisableButton();
    }
    private toggleDisableButton() {
        let valid = this.totalTime > 0;
        this.disabled = !valid;
    }
    public updateDiabledPushTimes() {
        let day = this.item.PostType == MLArticlePostType.Repeat
            ? this.item.PostNumber
            : this.item.PostDays && this.item.PostDays.length;
        let choiceDate = this.item.PostType == MLArticlePostType.Repeat
            ? this.item.PushTime
            : this.item.PostDays && this.item.PostDays.length > 0 && this.item.PostDays[0];
        if (day && choiceDate && this.times && this.times.length > 0) {
            let pushTime = this.item.PushTime,
                expireTime = this.item.ExpireTime;
            this.times.forEach((time: any) => {
                if (time.day == 'Chọn giờ đẩy tin') {
                    if (day == 1) {
                        let pushHour = pushTime.getHours(),
                            expireHour = expireTime.getHours(),
                            pushMinute = pushTime.getMinutes(),
                            expireMinute = expireTime.getMinutes(),
                            pushDay = UtilityExHelper.dateString(pushTime),
                            expireDay = UtilityExHelper.dateString(expireTime),
                            choiceDay = UtilityExHelper.dateString(choiceDate || new Date());
                        if (expireDay == choiceDay) {
                            time.timeGolds.forEach((itemTime: OptionItem) => {
                                let hour = itemTime.value.split(':')[0],
                                    minute = itemTime.value.split(':')[1];
                                itemTime.disabled = false;
                                if (expireHour < hour) itemTime.disabled = true;
                                else if (expireHour == hour && expireMinute < minute) itemTime.disabled = true;
                            });
                            time.timeOthers.forEach((itemTime: OptionItem) => {
                                let hour = itemTime.value.split(':')[0],
                                    minute = itemTime.value.split(':')[1];
                                itemTime.disabled = false;
                                if (expireHour < hour) itemTime.disabled = true;
                                else if (expireHour == hour && expireMinute < minute) itemTime.disabled = true;
                            });
                        }
                        if (pushDay == choiceDay) {
                            time.timeGolds.forEach((itemTime: OptionItem) => {
                                let hour = itemTime.value.split(':')[0],
                                    minute = itemTime.value.split(':')[1];
                                itemTime.disabled = false;
                                if (pushHour > hour) itemTime.disabled = true;
                                else if (pushHour == hour && pushMinute > minute) itemTime.disabled = true;
                            });
                            time.timeOthers.forEach((itemTime: OptionItem) => {
                                let hour = itemTime.value.split(':')[0],
                                    minute = itemTime.value.split(':')[1];
                                itemTime.disabled = false;
                                if (pushHour > hour) itemTime.disabled = true;
                                else if (pushHour == hour && pushMinute > minute) itemTime.disabled = true;
                            });
                        }
                    } else {
                        time.timeGolds.forEach((itemTime: OptionItem) => {
                            itemTime.disabled = false;
                        });
                        time.timeOthers.forEach((itemTime: OptionItem) => {
                            itemTime.disabled = false;
                        });
                    }
                } else {
                    let choiceDay = time.day,
                        publishHour = pushTime.getHours(),
                        expireHour = expireTime.getHours(),
                        pushMinute = pushTime.getMinutes(),
                        expireMinute = expireTime.getMinutes(),
                        pushDay = UtilityExHelper.dateString(pushTime),
                        expireDay = UtilityExHelper.dateString(expireTime);
                    if (expireDay == choiceDay) {
                        time.timeGolds.forEach((itemTime: OptionItem) => {
                            let hour = itemTime.value.split(':')[0],
                                minute = itemTime.value.split(':')[1];
                            itemTime.disabled = false;
                            if (expireHour < hour) itemTime.disabled = true;
                            else if (expireHour == hour && expireMinute < minute) itemTime.disabled = true;
                        });
                        time.timeOthers.forEach((itemTime: OptionItem) => {
                            let hour = itemTime.value.split(':')[0],
                                minute = itemTime.value.split(':')[1];
                            itemTime.disabled = false;
                            if (expireHour < hour) itemTime.disabled = true;
                            else if (expireHour == hour && expireMinute < minute) itemTime.disabled = true;
                        });
                    }
                    if (pushDay == choiceDay) {
                        time.timeGolds.forEach((itemTime: OptionItem) => {
                            let hour = itemTime.value.split(':')[0],
                                minute = itemTime.value.split(':')[1];
                            itemTime.disabled = false;
                            if (publishHour > hour) itemTime.disabled = true;
                            else if (publishHour == hour && pushMinute > minute) itemTime.disabled = true;
                        });
                        time.timeOthers.forEach((itemTime: OptionItem) => {
                            let hour = itemTime.value.split(':')[0],
                                minute = itemTime.value.split(':')[1];
                            itemTime.disabled = false;
                            if (publishHour > hour) itemTime.disabled = true;
                            else if (publishHour == hour && pushMinute > minute) itemTime.disabled = true;
                        });
                    }
                }
            });
        } else if (this.times && this.times.length > 0) {
            this.times.forEach((time: any) => {
                if (time.day == 'Chọn giờ đẩy tin') {
                    time.timeGolds.forEach((itemTime: OptionItem) => {
                        itemTime.disabled = true;
                    });
                    time.timeOthers.forEach((itemTime: OptionItem) => {
                        itemTime.disabled = true;
                    });
                }
            });
        }
    }
}