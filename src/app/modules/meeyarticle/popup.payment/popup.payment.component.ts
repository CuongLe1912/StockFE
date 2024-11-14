import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { MLUserService } from '../../meeyuser/user.service';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { MLUserEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLArticlePostType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLArticleEntity, MLArticlePackageConfig, MLArticlePaymentEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './popup.payment.component.html',
    styleUrls: ['./popup.payment.component.scss'],
})
export class MLPopupPaymentComponent implements OnInit {
    balance: number;
    totalDay: number;
    countdown: number;
    requestId: string;
    totalTime: number;
    error: number = 0;
    pricePush: number;
    totalHour: number;
    user: MLUserEntity;
    success: number = 0;
    errorMessage: string;
    @Input() params: any;
    countdownText: string;
    times: {
        day: string,
        timeGolds: OptionItem[],
        timeOthers: OptionItem[]
    }[];
    countdownResend: number;
    loading: boolean = true;
    disabled: boolean = true;
    article: MLArticleEntity;
    service: MLArticleService;
    errorMesssageUser: string;
    userService: MLUserService;
    amountVerifyOtp: number = 0;
    amountReSendOtp: number = 0;
    countdownResendText: string;
    price: MLArticlePackageConfig;
    item: MLArticlePaymentEntity = new MLArticlePaymentEntity();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
        this.userService = AppInjector.get(MLUserService);
    }

    async ngOnInit() {
        this.price = this.params && this.params['price'];
        this.pricePush = this.params && this.params['pricePush'];
        this.totalTime = this.params && this.params['totalTime'];
        let article = this.params && this.params['item'] as MLArticleEntity;
        if (article) {
            this.article = EntityHelper.createEntity(MLArticleEntity, article);
            this.item.Amount = this.article.ChargeAmount;
            this.article.PushTimes = article.PushTimes;
            this.updatePushTimes();
            this.loadWallet();
        }
    }

    resendOtp() {
        if (this.requestId && this.user && this.user.Phone) {
            this.errorMessage = null;
            this.amountVerifyOtp = 0;
            this.amountReSendOtp += 1;
            if (this.amountReSendOtp <= 3) {
                let requestId = this.requestId; this.requestId = null;
                this.service.reSendOtp(this.user.Phone, requestId).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.updateCountDown(result);
                        this.updateCountDownResend(result);
                    } else {
                        this.errorMessage = 'Vượt quá số lần gửi mã OTP.  Vui lòng thử lại sau.';
                    }
                });
            } else {
                this.errorMessage = 'Vượt quá số lần gửi mã OTP.  Vui lòng thử lại sau.';
            }
        }
    }
    async confirm() {
        this.item.MeeyId = this.user.MeeyId;
        this.item.BuyerName = this.user.Name;
        this.item.BuyerPhone = this.user.Phone;
        this.item.BuyerEmail = this.user.Email;
        this.item.OrderId = this.article.OrderId;
        if (!this.balance || this.item.Amount > this.balance) {
            return false;
        }

        this.item.Amount = this.article.ChargeAmount;
        return await this.service.payment(this.item).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let date = (new Date()).getTime(),
                    publish = this.article.PublishTime.getTime(),
                    message = date >= publish
                        ? 'Thanh toán thành công! Tin đang ở trạng thái Tin đang đăng'
                        : 'Thanh toán thành công! Tin đang ở trạng thái Tin chờ đăng';
                ToastrHelper.Success(message, 'Thông báo');
                return true;
            }
            ToastrHelper.ErrorResult(result);
            return false;
        }, (e) => {
            ToastrHelper.Exception(e);
            return false;
        });
    }
    async otpChange() {
        this.disabled = true;
        let valid = await validation(this.item, ['Otp']);
        if (!this.loading && valid) {
            this.loading = true;
            this.errorMessage = null;
            await this.service.verifyOtp(this.user.Phone, this.requestId, this.item.Otp).then((result: ResultApi) => {
                this.amountVerifyOtp += 1;
                if (ResultApi.IsSuccess(result)) {
                    this.disabled = false;
                    this.requestId = null;
                } else {
                    this.item.Otp = null;
                    this.errorMessage = result.Description || 'Mã OTP không hợp lệ, vui lòng thử lại';
                    if (this.amountVerifyOtp >= 3 ||
                        result.Description == 'Vượt quá số lần xác thực OTP.  Vui lòng thực hiện lại.') {
                        this.countdown = 0;
                    }
                    this.disabled = true;
                }
            });
            this.loading = false;
        }
    }


    private updatePushTimes() {
        this.totalDay = 0; this.totalHour = 0; this.totalTime = 0;
        let pushTime = this.article.PushTime,
            expireTime = this.article.ExpireTime;
        if (pushTime && expireTime) {
            let pushHour = pushTime.getHours(),
                expireHour = expireTime.getHours(),
                pushMinute = pushTime.getMinutes(),
                expireMinute = expireTime.getMinutes(),
                toDay = UtilityExHelper.dateString(new Date()),
                expireDay = UtilityExHelper.dateString(expireTime);
            if (this.article.PushTimes && this.article.PushTimes.length > 0) {
                if (this.article.PostType == MLArticlePostType.Repeat) {
                    this.totalDay = this.article.PostNumber;
                    this.totalHour = this.article.PushTimes[0].Times && this.article.PushTimes[0].Times.length;
                    for (let i = 0; i < this.totalDay; i++) {
                        let times = this.article.PushTimes[0].Times,
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
                    this.totalDay = this.article.PostDays && this.article.PostDays.length;
                    this.totalHour = this.article.PushTimes[0].Times && this.article.PushTimes[0].Times.length;
                    if (this.article.PostByEachDay) {
                        this.article.PushTimes.forEach(element => {
                            time += element.Times ? element.Times.length : 0;
                        });
                        this.totalHour = 0;
                        this.totalTime = time;
                    } else {
                        this.article.PostDays.forEach((choiceDate: Date) => {
                            let times = this.article.PushTimes[0].Times,
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
    }
    private async loadWallet() {
        if (this.article && this.article.UserMeeyId) {
            this.loading = true;
            this.errorMesssageUser = null;
            await this.userService.itemByMeeyId(this.article.UserMeeyId).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.user = EntityHelper.createEntity(MLUserEntity, result.Object);
                    if (this.user) {
                        this.balance = this.user.Balance || 0;
                        if (this.user.DiscountBalance1) this.balance += this.user.DiscountBalance1;
                        if (this.user.DiscountBalance2) this.balance += this.user.DiscountBalance2;
                        if (this.user.MPConnected) {
                            if (this.balance < this.item.Amount) this.errorMesssageUser = 'Tài khoản không đủ số dư, không thể tiếp tục thanh toán';
                            else {
                                if (this.user.Phone) {
                                    await this.service.sendOtp(this.user.Phone).then((result: ResultApi) => {
                                        this.updateCountDown(result);
                                        this.updateCountDownResend(result);
                                    });
                                }
                            }
                        } else this.errorMesssageUser = 'Tài khoản chưa liên kết ví, không thế tiếp tục thanh toán';
                    }
                }
            });
            this.loading = false;
        }
    }
    private updateCountDown(result: ResultApi) {
        if (ResultApi.IsSuccess(result) && result.Object) {
            this.requestId = result.Object.requestId;
            this.countdown = result.Object.countdown;
            let interval = setInterval(() => {
                this.countdown -= 1;
                if (this.countdown <= 0) {
                    this.countdown = 0;
                    clearInterval(interval);
                }
                let minutes = Math.floor(this.countdown / 60),
                    seconds = this.countdown - minutes * 60;
                this.countdownText = minutes == 0 && seconds == 0
                    ? null
                    : minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            }, 1000);
        }
    }
    private updateCountDownResend(result: ResultApi) {
        if (ResultApi.IsSuccess(result) && result.Object) {
            this.countdownResend = 60;
            let interval = setInterval(() => {
                this.countdownResend -= 1;
                if (this.countdownResend <= 0) {
                    this.countdownResend = 0;
                    clearInterval(interval);
                }
                let minutes = Math.floor(this.countdownResend / 60),
                    seconds = this.countdownResend - minutes * 60;
                this.countdownResendText = minutes == 0 && seconds == 0
                    ? null
                    : minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            }, 1000);
        }
    }
}