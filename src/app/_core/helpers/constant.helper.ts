import { Dictionary } from "../domains/data/dictionnary";
import { OptionItem } from "../domains/data/option.item";
import { PermissionType } from "../domains/enums/permission.type";
import { DepartmentType } from "../domains/enums/department.type";
import { EmailTemplateType } from "../domains/enums/email.template.type";
import { MSTagType } from "../domains/entities/meeyseo/enums/ms.tag.type";
import { MSUrlType } from "../domains/entities/meeyseo/enums/ms.url.type";
import { MGPageType } from "../domains/entities/meeygroup/enums/mg.page.type";
import { MSStatusType } from "../domains/entities/meeyseo/enums/ms.status.type";
import { MSActionType } from "../domains/entities/meeyseo/enums/ms.action.type";
import { MSDemandType } from "../domains/entities/meeyseo/enums/ms.demand.type";
import { MBBannerType } from "../domains/entities/meeybanner/enums/mb.banner.type";
import { MBSourceType } from "../domains/entities/meeybanner/enums/mb.source.type";
import { MBStatusType } from "../domains/entities/meeybanner/enums/mb.status.type";
import { StructureType } from "../domains/entities/meeyseo/enums/ms.structure.type";
import { MGPartnerType } from "../domains/entities/meeygroup/enums/mg.partner.type";
import { MBProductType } from "../domains/entities/meeybanner/enums/mb.product.type";
import { MSFurnitureType } from "../domains/entities/meeyseo/enums/ms.furniture.type";
import { MPOAvatarType } from "../domains/entities/meeyproject/enums/mpo.avatar.type";
import { MBPlatformType } from "../domains/entities/meeybanner/enums/mb.platform.type";
import { MGBannerDevice, MGBannerStatusType } from "../domains/entities/meeygroup/enums/mg.banner.type";
import { MSPrioritizedType } from "../domains/entities/meeyseo/enums/ms.prioritized.type";
import { UnitDurationType } from "../domains/entities/meeyorder/enums/unit.duration.type";
import { MGProfileStatusType } from "../domains/entities/meeygroup/enums/mg.profile.type";
import { MPRevenueStatusType } from "../domains/entities/meeypay/enums/mp.revenue.status.type";
import { MLCompanyStatusType } from "../domains/entities/meeyland/enums/ml.company.status.type";
import { MCRMDistributionType } from "../domains/entities/meeycrm/enums/mcrm.distribution.type";
import { MGCategoryLeaderType } from "../domains/entities/meeygroup/enums/mg.category.leader.type";
import { PaymentCycleType, PaymentType } from "../domains/entities/meeyaffiliate/enums/policy.type";
import { MGSectionPageType, MGSectionType } from "../domains/entities/meeygroup/enums/mg.section.type";
import { MGOfficeStrategyType, MGOfficeType } from "../domains/entities/meeygroup/enums/mg.office.type";
import { MCRMCustomerLeadStatusType } from "../domains/entities/meeycrm/enums/mcrm.customer.status.type";
import { MGCategoryAnnouncedType } from "../domains/entities/meeygroup/enums/mg.category.announced.type";
import { MSMetaSeoCategoryType, MSMetaSeoCategoryTypeV2, MSMetaSeoType } from "../domains/entities/meeyseo/enums/ms.meta.seo.type";
import { MMLookupHistoryStatusType } from "../domains/entities/meeymap/enums/mm.lookup.history.status.type";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../domains/entities/meeyorder/enums/price.config.type";
import { RequestTransferType, TransferStatusType } from "../../modules/meeyorder/service.history/enums/request.transfer.type";
import { MLEmployeeHistoryActionType, MLEmployeeImportStatusType, MLEmployeeStatusType } from "../domains/entities/meeyland/enums/ml.employee.status.type";
import { MLScheduleDateType, MLScheduleStatusType, MLScheduleType } from "../domains/entities/meeyland/enums/ml.schedule.type";
import { MLCouponHMCObjectStatusType, MLCouponHMCStatusType } from "../domains/entities/meeyland/enums/ml.coupon.hmc.status.type";
import { MMRequestStatusType, MMRequestActionType, MMRequestType } from "../domains/entities/meeymap/enums/mm.request.status.type";
import { MLUSerInterestedProductType, MLUserReasonLockType, MLUserStatusType, MLUserType, MLUserVerifyPhone, MLUserWalletLinked } from "../domains/entities/meeyland/enums/ml.user.type";
import { MCRMCallLogStatusType, MCRMCallLogType, MCRMCallManagementStatusType, MCRMIFameSaleType } from "../domains/entities/meeycrm/enums/mcrm.calllog.type";
import { MAFStatusCommissionType, MAFActionType, MAFRankType, MAFRequestStatusType } from "../domains/entities/meeyaffiliate/enums/affiliate.type";
import { MCCouponExpireDateType, MCCouponStatusType, MCCouponUpdateStatusType, MCCouponUseType } from "../domains/entities/meeycoupon/enums/coupon.type";
import { MgRecruitmentExperienceType, MgRecruitmentSalaryUnitType, MgRecruitmentStatusType, MgRecruitmentType } from "../domains/entities/meeygroup/enums/mg.recruitment.type";
import { MOOderActionStatusType, MOOderAuthorStatusType, MOOderProcessingStatusType, MOOrderStatusPaymentType, MOOrderStatusType } from "../domains/entities/meeyorder/enums/order.status.type";
import { MPPaymentMethodType, MPTransactionAuthorType, MPTransactionFundsType, MPTransactionStatusType, MPTransactionType, MPWalletHistoryType } from "../domains/entities/meeypay/enums/mp.transaction.status.type";
import { MAFContractCommissionStatus, MAFContractSignStatus, MAFContractStatus, MAFContractType, MAFFilterChannelType, MAFFilterContractStatus, MAFInvoiceStatus, MAFStatusPaymentType, MAFSyntheticContractStatus, TransactionCommissionType } from "../domains/entities/meeyaffiliate/enums/contract.type";
import { MLArticleAccessType, MLArticleReasonType, MLArticleRejectOptionType, MLArticlePostType, MLArticleType, MLArtilceMediateType, MLArtilceSyncType, MLArticleApproveContentType, MLArticleStatusType, MLArticleViewType, MLArticleReasonReportType, MLArticleReportStatusType } from "../domains/entities/meeyland/enums/ml.article.type";
import { CustomerStoreType, CustomerTransferType, MCRMCustomerActionType, MCRMCustomerActivityType, MCRMCustomerExpireType, MCRMCustomerNoteCallStatusType, MCRMCustomerNoteCallType, MCRMCustomerNoteEmailStatusType, MCRMCustomerPotentialType, MCRMCustomerRequestStatusType, MCRMCustomerStatusType, MCRMCustomerType, MCRMSaleAssignConfigHistoryTypes } from "../domains/entities/meeycrm/enums/mcrm.customer.type";
import { MGAnnouncedStatusType } from "../domains/entities/meeygroup/enums/mg.announced.type";
import { M3DTourStatusType } from "../domains/entities/meey3d/enums/tour.status.type";
import { M3DTourType } from "../domains/entities/meey3d/enums/tour.type";
import { M3DGroundTourType } from "../domains/entities/meey3d/enums/tour.ground.type";
import { MRVUserType } from "../domains/entities/meeyreview/enums/mrv.user.type";
import { MRVUserStatusType } from "../domains/entities/meeyreview/enums/mrv.user.status.type";
import { MRVUserGenderType } from "../domains/entities/meeyreview/enums/mrv.user.gender.type";
import { MRVProjectStatusType } from "../domains/entities/meeyreview/enums/mrv.project.status.type";
import { MRVProjectVoteScoreType } from "../domains/entities/meeyreview/enums/mrv.project.votescore.type";
import { M3DContactFromStatus } from "../domains/entities/meey3d/enums/contactform.status";
import { M3DCensorshipType } from "../domains/entities/meey3d/enums/tour.censorship.type";
import { MRVReportViolateStatusType } from "../domains/entities/meeyreview/enums/mrv.reportviolate.status.type";
import { MBankRecruitmentExperienceType, MBankRecruitmentSalaryUnitType, MBankRecruitmentStatusType, MBankRecruitmentType } from "../domains/entities/meeybank/enums/mbank.recruitment.type";

export class ConstantHelper {
    public static ICONS = [
        'socicon-modelmayhem',
        'socicon-mixcloud', 'socicon-drupal',
        'socicon-swarm', 'socicon-istock', 'socicon-yammer',
        'socicon-ello', 'socicon-stackoverflow', 'socicon-persona', 'socicon-triplej',
        'socicon-houzz', 'socicon-rss', 'socicon-paypal', 'socicon-odnoklassniki', 'socicon-airbnb',
        'socicon-periscope', 'socicon-outlook', 'socicon-coderwall', 'socicon-tripadvisor', 'socicon-appnet',
        'socicon-goodreads', 'socicon-tripit', 'socicon-lanyrd', 'socicon-slideshare', 'socicon-buffer', 'socicon-disqus',
        'socicon-vkontakte', 'socicon-whatsapp', 'socicon-patreon', 'socicon-storehouse', 'socicon-pocket', 'socicon-mail', 'socicon-blogger',
        'socicon-technorati', 'socicon-reddit', 'socicon-dribbble', 'socicon-stumbleupon', 'socicon-digg', 'socicon-envato', 'socicon-behance',
        'socicon-delicious', 'socicon-deviantart', 'socicon-forrst', 'socicon-play', 'socicon-zerply', 'socicon-wikipedia', 'socicon-apple', 'socicon-flattr',
        'socicon-github', 'socicon-renren', 'socicon-friendfeed', 'socicon-newsvine', 'socicon-identica', 'socicon-bebo', 'socicon-zynga', 'socicon-steam', 'socicon-xbox',
        'socicon-windows', 'socicon-qq', 'socicon-douban', 'socicon-meetup', 'socicon-playstation', 'socicon-android', 'socicon-snapchat', 'socicon-twitter', 'socicon-facebook',
        'socicon-yahoo', 'socicon-skype', 'socicon-yelp', 'socicon-feedburner', 'socicon-linkedin', 'socicon-viadeo', 'socicon-xing', 'socicon-myspace', 'socicon-soundcloud', 'socicon-spotify',
        'socicon-grooveshark', 'socicon-lastfm', 'socicon-youtube', 'socicon-vimeo', 'socicon-dailymotion', 'socicon-vine', 'socicon-flickr', 'socicon-500px', 'socicon-wordpress', 'socicon-tumblr',
        'socicon-twitch', 'socicon-8tracks', 'socicon-amazon', 'socicon-icq', 'socicon-smugmug', 'socicon-ravelry', 'socicon-weibo', 'socicon-baidu', 'socicon-angellist', 'socicon-ebay', 'socicon-imdb',
        'socicon-stayfriends', 'socicon-residentadvisor', 'socicon-google', 'socicon-yandex', 'socicon-sharethis', 'socicon-bandcamp', 'socicon-itunes', 'socicon-deezer', 'socicon-telegram', 'socicon-openid',
        'socicon-amplement', 'socicon-viber', 'socicon-zomato', 'socicon-draugiem', 'socicon-endomodo', 'socicon-filmweb', 'socicon-stackexchange', 'socicon-wykop', 'socicon-teamspeak', 'socicon-teamviewer', 'socicon-ventrilo',
        'socicon-younow', 'socicon-raidcall', 'socicon-mumble', 'socicon-medium', 'socicon-bebee', 'socicon-hitbox', 'socicon-reverbnation', 'socicon-formulr', 'socicon-instagram', 'socicon-battlenet', 'socicon-chrome', 'socicon-discord',
        'socicon-issuu', 'socicon-macos', 'socicon-firefox', 'socicon-opera', 'socicon-keybase', 'socicon-alliance', 'socicon-livejournal', 'socicon-googlephotos', 'socicon-horde', 'socicon-etsy', 'socicon-zapier', 'socicon-google-scholar',
        'socicon-researchgate', 'socicon-wechat', 'socicon-strava', 'socicon-line', 'socicon-lyft', 'socicon-uber', 'socicon-songkick', 'socicon-viewbug', 'socicon-googlegroups', 'socicon-quora', 'socicon-diablo', 'socicon-blizzard', 'socicon-hearthstone',
        'socicon-heroes', 'socicon-overwatch', 'socicon-warcraft', 'socicon-starcraft', 'socicon-beam', 'socicon-curse', 'socicon-player', 'socicon-streamjar', 'socicon-nintendo', 'socicon-hellocoton', 'socicon-googleplus', 'socicon-pinterest', 'socicon-foursquare',
    ];
    public static COLORS = [
        '#8877a9',
        '#e1e5ec', '#2f353b',
        '#3598dc', '#578ebe', '#2C3E50',
        '#22313F', '#67809F', '#4B77BE', '#4c87b9',
        '#5e738b', '#5C9BD1', '#32c5d2', '#1BBC9B', '#1BA39C',
        '#36D7B7', '#44b6ae', '#26C281', '#3faba4', '#4DB3A2', '#2ab4c0',
        '#E5E5E5', '#e9edef', '#fafafa', '#555555', '#95A5A6', '#BFBFBF', '#ACB5C3',
        '#bfcad1', '#525e64', '#e7505a', '#E08283', '#E26A6A', '#e35b5a', '#D91E18', '#EF4836',
        '#d05454', '#f36a5a', '#e43a45', '#c49f47', '#E87E04', '#f2784b', '#f3c200', '#F7CA18', '#F4D03F',
        '#c8d046', '#c5bf66', '#c5b96b', '#8E44AD', '#8775a7', '#BF55EC', '#8E44AD', '#9B59B6', '#9A12B3', '#8775a7', '#796799'
    ];
    public static LA_ICONS = [
        'la la-500px',
        'la la-adjust', 'la la-adn',
        'la la-align-center', 'la la-align-justify',
        'la la-align-left', 'la la-align-right', 'la la-amazon',
        'la la-ambulance', 'la la-anchor', 'la la-android', 'la la-angellist',
        'la la-angle-double-down', 'la la-angle-double-left', 'la la-angle-double-right',
        'la la-angle-double-up', 'la la-angle-down', 'la la-angle-left', 'la la-angle-right',
        'la la-angle-up', 'la la-apple', 'la la-archive', 'la la-area-chart', 'la la-arrow-circle-down',
        'la la-arrow-circle-left', 'la la-arrow-circle-o-down', 'la la-arrow-circle-o-left', 'la la-arrow-circle-o-right',
        'la la-arrow-circle-o-up', 'la la-arrow-circle-right', 'la la-arrow-circle-up', 'la la-arrow-down', 'la la-arrow-left',
        'la la-arrow-right', 'la la-arrow-up', 'la la-arrows', 'la la-arrows-alt', 'la la-arrows-h', 'la la-arrows-v', 'la la-asterisk',
        'la la-at', 'la la-automobile', 'la la-backward', 'la la-balance-scale', 'la la-ban', 'la la-bank', 'la la-bar-chart', 'la la-bar-chart-o',
        'la la-barcode', 'la la-bars', 'la la-battery-0', 'la la-battery-1', 'la la-battery-2', 'la la-battery-3', 'la la-battery-4', 'la la-battery-empty',
        'la la-battery-full', 'la la-battery-half', 'la la-battery-quarter', 'la la-battery-three-quarters', 'la la-bed', 'la la-beer', 'la la-behance', 'la la-behance-square',
        'la la-bell', 'la la-bell-o', 'la la-bell-slash', 'la la-bell-slash-o', 'la la-bicycle', 'la la-binoculars', 'la la-birthday-cake', 'la la-bitbucket', 'la la-bitbucket-square',
        'la la-bitcoin', 'la la-black-tie', 'la la-bold', 'la la-bolt', 'la la-bomb', 'la la-book', 'la la-bookmark', 'la la-bookmark-o', 'la la-briefcase', 'la la-btc', 'la la-bug', 'la la-building',
        'la la-building-o', 'la la-bullhorn', 'la la-bullseye', 'la la-bus', 'la la-buysellads', 'la la-cab', 'la la-calculator', 'la la-calendar', 'la la-calendar-check-o', 'la la-calendar-minus-o',
        'la la-calendar-o', 'la la-calendar-plus-o', 'la la-calendar-times-o', 'la la-camera', 'la la-camera-retro', 'la la-car', 'la la-caret-down', 'la la-caret-left', 'la la-caret-right', 'la la-caret-square-o-down',
        'la la-toggle-down', 'la la-caret-square-o-left', 'la la-toggle-left', 'la la-caret-square-o-right', 'la la-toggle-right', 'la la-caret-square-o-up', 'la la-toggle-up', 'la la-caret-up', 'la la-cart-arrow-down',
        'la la-cart-plus', 'la la-cc', 'la la-cc-amex', 'la la-cc-diners-club', 'la la-cc-discover', 'la la-cc-jcb', 'la la-cc-mastercard', 'la la-cc-paypal', 'la la-cc-stripe', 'la la-cc-visa', 'la la-certificate', 'la la-chain',
        'la la-chain-broken', 'la la-check', 'la la-check-circle', 'la la-check-circle-o', 'la la-check-square', 'la la-check-square-o', 'la la-chevron-circle-down', 'la la-chevron-circle-left', 'la la-chevron-circle-right', 'la la-chevron-circle-up',
        'la la-chevron-down', 'la la-chevron-left', 'la la-chevron-right', 'la la-chevron-up', 'la la-child', 'la la-chrome', 'la la-circle', 'la la-circle-o', 'la la-circle-o-notch', 'la la-circle-thin', 'la la-clipboard', 'la la-clock-o', 'la la-clone',
        'la la-close', 'la la-cloud', 'la la-cloud-download', 'la la-cloud-upload', 'la la-cny', 'la la-code', 'la la-code-fork', 'la la-codepen', 'la la-coffee', 'la la-cog', 'la la-cogs', 'la la-columns', 'la la-comment', 'la la-comment-o', 'la la-commenting',
        'la la-commenting-o', 'la la-comments', 'la la-comments-o', 'la la-compass', 'la la-compress', 'la la-connectdevelop', 'la la-contao', 'la la-copy', 'la la-copyright', 'la la-creative-commons', 'la la-credit-card', 'la la-crop', 'la la-crosshairs', 'la la-css3',
        'la la-cube', 'la la-cubes', 'la la-cut', 'la la-cutlery', 'la la-dashboard', 'la la-dashcube', 'la la-database', 'la la-dedent', 'la la-delicious', 'la la-desktop', 'la la-deviantart', 'la la-diamond', 'la la-digg', 'la la-dollar', 'la la-dot-circle-o', 'la la-download',
        'la la-dribbble', 'la la-dropbox', 'la la-drupal', 'la la-edit', 'la la-eject', 'la la-ellipsis-h', 'la la-ellipsis-v', 'la la-empire', 'la la-ge', 'la la-envelope', 'la la-envelope-o', 'la la-envelope-square', 'la la-eraser', 'la la-eur', 'la la-euro', 'la la-exchange', 'la la-exclamation',
        'la la-exclamation-circle', 'la la-exclamation-triangle', 'la la-expand', 'la la-expeditedssl', 'la la-external-link', 'la la-external-link-square', 'la la-eye', 'la la-eye-slash', 'la la-eyedropper', 'la la-facebook', 'la la-facebook-f', 'la la-facebook-official', 'la la-facebook-square', 'la la-fast-backward',
        'la la-fast-forward', 'la la-fax', 'la la-female', 'la la-fighter-jet', 'la la-file', 'la la-file-archive-o', 'la la-file-audio-o', 'la la-file-code-o', 'la la-file-excel-o', 'la la-file-image-o', 'la la-file-movie-o', 'la la-file-o', 'la la-file-pdf-o', 'la la-file-photo-o', 'la la-file-picture-o', 'la la-file-powerpoint-o',
        'la la-file-sound-o', 'la la-file-text', 'la la-file-text-o', 'la la-file-video-o', 'la la-file-word-o', 'la la-file-zip-o', 'la la-files-o', 'la la-film', 'la la-filter', 'la la-fire', 'la la-fire-extinguisher', 'la la-firefox', 'la la-flag', 'la la-flag-checkered', 'la la-flag-o', 'la la-flash', 'la la-flask', 'la la-flickr', 'la la-floppy-o',
        'la la-folder', 'la la-folder-o', 'la la-folder-open', 'la la-folder-open-o', 'la la-font', 'la la-fonticons', 'la la-forumbee', 'la la-forward', 'la la-foursquare', 'la la-frown-o', 'la la-futbol-o', 'la la-soccer-ball-o', 'la la-gamepad', 'la la-gavel', 'la la-gbp', 'la la-gear', 'la la-gears', 'la la-genderless', 'la la-get-pocket', 'la la-gg', 'la la-gg-circle',
        'la la-gift', 'la la-git', 'la la-git-square', 'la la-github', 'la la-github-alt', 'la la-github-square', 'la la-glass', 'la la-globe', 'la la-google', 'la la-google-plus', 'la la-google-plus-square', 'la la-google-wallet', 'la la-graduation-cap', 'la la-gratipay', 'la la-gittip', 'la la-group', 'la la-h-square', 'la la-hacker-news', 'la la-hand-grab-o', 'la la-hand-lizard-o',
        'la la-hand-o-down', 'la la-hand-o-left', 'la la-hand-o-right', 'la la-hand-o-up', 'la la-hand-paper-o', 'la la-hand-peace-o', 'la la-hand-pointer-o', 'la la-hand-rock-o', 'la la-hand-scissors-o', 'la la-hand-spock-o', 'la la-hand-stop-o', 'la la-hdd-o', 'la la-header', 'la la-headphones', 'la la-heart', 'la la-heart-o', 'la la-heartbeat', 'la la-history', 'la la-home', 'la la-hospital-o',
        'la la-hotel', 'la la-hourglass', 'la la-hourglass-1', 'la la-hourglass-2', 'la la-hourglass-3', 'la la-hourglass-end', 'la la-hourglass-half', 'la la-hourglass-o', 'la la-hourglass-start', 'la la-houzz', 'la la-html5', 'la la-i-cursor', 'la la-ils', 'la la-image', 'la la-inbox', 'la la-indent', 'la la-industry', 'la la-info', 'la la-info-circle', 'la la-inr', 'la la-instagram', 'la la-institution',
        'la la-internet-explorer', 'la la-ioxhost', 'la la-italic', 'la la-joomla', 'la la-jpy', 'la la-jsfiddle', 'la la-key', 'la la-keyboard-o', 'la la-krw', 'la la-language', 'la la-laptop', 'la la-lastfm', 'la la-lastfm-square', 'la la-leaf', 'la la-leanpub', 'la la-legal', 'la la-lemon-o', 'la la-level-down', 'la la-level-up', 'la la-life-bouy', 'la la-life-buoy', 'la la-life-ring', 'la la-support', 'la la-life-saver',
        'la la-lightbulb-o', 'la la-line-chart', 'la la-link', 'la la-linkedin', 'la la-linkedin-square', 'la la-linux', 'la la-list', 'la la-list-alt', 'la la-list-ol', 'la la-list-ul', 'la la-location-arrow', 'la la-lock', 'la la-long-arrow-down', 'la la-long-arrow-left', 'la la-long-arrow-right', 'la la-long-arrow-up', 'la la-magic', 'la la-magnet', 'la la-mail-forward', 'la la-mail-reply', 'la la-mail-reply-all', 'la la-male',
        'la la-map', 'la la-map-marker', 'la la-map-o', 'la la-map-pin', 'la la-map-signs', 'la la-mars', 'la la-mars-double', 'la la-mars-stroke', 'la la-mars-stroke-h', 'la la-mars-stroke-v', 'la la-maxcdn', 'la la-meanpath', 'la la-medium', 'la la-medkit', 'la la-meh-o', 'la la-mercury', 'la la-microphone', 'la la-microphone-slash', 'la la-minus', 'la la-minus-circle', 'la la-minus-square', 'la la-minus-square-o', 'la la-mobile', 'la la-mobile-phone',
        'la la-money', 'la la-moon-o', 'la la-mortar-board', 'la la-motorcycle', 'la la-mouse-pointer', 'la la-music', 'la la-navicon', 'la la-neuter', 'la la-newspaper-o', 'la la-object-group', 'la la-object-ungroup', 'la la-odnoklassniki', 'la la-odnoklassniki-square', 'la la-opencart', 'la la-openid', 'la la-opera', 'la la-optin-monster', 'la la-outdent', 'la la-pagelines', 'la la-paint-brush', 'la la-paper-plane', 'la la-send', 'la la-paper-plane-o', 'la la-send-o',
        'la la-paperclip', 'la la-paragraph', 'la la-paste', 'la la-pause', 'la la-paw', 'la la-paypal', 'la la-pencil', 'la la-pencil-square', 'la la-pencil-square-o', 'la la-phone', 'la la-phone-square', 'la la-photo', 'la la-picture-o', 'la la-pie-chart', 'la la-pied-piper', 'la la-pied-piper-alt', 'la la-pinterest', 'la la-pinterest-p', 'la la-pinterest-square', 'la la-plane', 'la la-play', 'la la-play-circle', 'la la-play-circle-o', 'la la-plug', 'la la-plus', 'la la-plus-circle',
        'la la-plus-square', 'la la-plus-square-o', 'la la-power-off', 'la la-print', 'la la-puzzle-piece', 'la la-qq', 'la la-qrcode', 'la la-question', 'la la-question-circle', 'la la-quote-left', 'la la-quote-right', 'la la-ra', 'la la-random', 'la la-rebel', 'la la-recycle', 'la la-reddit', 'la la-reddit-square', 'la la-refresh', 'la la-registered', 'la la-renren', 'la la-reorder', 'la la-repeat', 'la la-reply', 'la la-reply-all', 'la la-retweet', 'la la-rmb', 'la la-road', 'la la-rocket',
        'la la-rotate-left', 'la la-rotate-right', 'la la-rouble', 'la la-rss', 'la la-feed', 'la la-rss-square', 'la la-rub', 'la la-ruble', 'la la-rupee', 'la la-safari', 'la la-save', 'la la-scissors', 'la la-search', 'la la-search-minus', 'la la-search-plus', 'la la-sellsy', 'la la-server', 'la la-share', 'la la-share-alt', 'la la-share-alt-square', 'la la-share-square', 'la la-share-square-o', 'la la-shekel', 'la la-sheqel', 'la la-shield', 'la la-ship', 'la la-shirtsinbulk', 'la la-shopping-cart',
        'la la-sign-in', 'la la-sign-out', 'la la-signal', 'la la-simplybuilt', 'la la-sitemap', 'la la-skyatlas', 'la la-skype', 'la la-slack', 'la la-sliders', 'la la-slideshare', 'la la-smile-o', 'la la-sort', 'la la-unsorted', 'la la-sort-alpha-asc', 'la la-sort-alpha-desc', 'la la-sort-amount-asc', 'la la-sort-amount-desc', 'la la-sort-asc', 'la la-sort-up', 'la la-sort-desc', 'la la-sort-down', 'la la-sort-numeric-asc', 'la la-sort-numeric-desc', 'la la-soundcloud', 'la la-space-shuttle', 'la la-spinner',
        'la la-spoon', 'la la-spotify', 'la la-square', 'la la-square-o', 'la la-stack-exchange', 'la la-stack-overflow', 'la la-star', 'la la-star-half', 'la la-star-half-o', 'la la-star-half-full', 'la la-star-half-empty', 'la la-star-o', 'la la-steam', 'la la-steam-square', 'la la-step-backward', 'la la-step-forward', 'la la-stethoscope', 'la la-sticky-note', 'la la-sticky-note-o', 'la la-stop', 'la la-street-view', 'la la-strikethrough', 'la la-stumbleupon', 'la la-stumbleupon-circle', 'la la-subscript', 'la la-subway',
        'la la-suitcase', 'la la-sun-o', 'la la-superscript', 'la la-table', 'la la-tablet', 'la la-tachometer', 'la la-tag', 'la la-tags', 'la la-tasks', 'la la-taxi', 'la la-television', 'la la-tv', 'la la-tencent-weibo', 'la la-terminal', 'la la-text-height', 'la la-text-width', 'la la-th', 'la la-th-large', 'la la-th-list', 'la la-thumb-tack', 'la la-thumbs-down', 'la la-thumbs-o-down', 'la la-thumbs-o-up', 'la la-thumbs-up', 'la la-ticket', 'la la-times', 'la la-remove', 'la la-times-circle', 'la la-times-circle-o', 'la la-tint',
        'la la-toggle-off', 'la la-toggle-on', 'la la-trademark', 'la la-train', 'la la-transgender', 'la la-intersex', 'la la-transgender-alt', 'la la-trash', 'la la-trash-o', 'la la-tree', 'la la-trello', 'la la-tripadvisor', 'la la-trophy', 'la la-truck', 'la la-try', 'la la-tty', 'la la-tumblr', 'la la-tumblr-square', 'la la-turkish-lira', 'la la-twitch', 'la la-twitter', 'la la-twitter-square', 'la la-umbrella', 'la la-underline', 'la la-undo', 'la la-university', 'la la-unlink', 'la la-unlock', 'la la-unlock-alt', 'la la-upload', 'la la-usd',
        'la la-user', 'la la-user-md', 'la la-user-plus', 'la la-user-secret', 'la la-user-times', 'la la-users', 'la la-venus', 'la la-venus-double', 'la la-venus-mars', 'la la-viacoin', 'la la-video-camera', 'la la-vimeo', 'la la-vimeo-square', 'la la-vine', 'la la-vk', 'la la-volume-down', 'la la-volume-off', 'la la-volume-up', 'la la-warning', 'la la-wechat', 'la la-weibo', 'la la-weixin', 'la la-whatsapp', 'la la-wheelchair', 'la la-wifi', 'la la-wikipedia-w', 'la la-windows', 'la la-won', 'la la-wordpress', 'la la-wrench', 'la la-xing', 'la la-xing-square',
        'la la-y-combinator', 'la la-y-combinator-square', 'la la-yahoo', 'la la-yc', 'la la-yc-square', 'la la-yelp', 'la la-yen', 'la la-youtube', 'la la-youtube-play', 'la la-youtube-square'
    ];
    public static LINKS: OptionItem[] = [
        { label: '/', value: '/', group: 'Meey Admin' },
        { label: '/admin/bank', value: '/admin/bank', group: 'Meey Admin' },
        { label: '/admin/role', value: '/admin/role', group: 'Meey Admin' },
        { label: '/admin/team', value: '/admin/team', group: 'Meey Admin' },
        { label: '/admin/city', value: '/admin/city', group: 'Meey Admin' },
        { label: '/admin/user', value: '/admin/user', group: 'Meey Admin' },
        { label: '/admin/domain', value: '/admin/domain', group: 'Meey Admin' },
        { label: '/admin/street', value: '/admin/street', group: 'Meey Admin' },
        { label: '/admin/product', value: '/admin/product', group: 'Meey Admin' },
        { label: '/admin/country', value: '/admin/country', group: 'Meey Admin' },
        { label: '/admin/district', value: '/admin/district', group: 'Meey Admin' },
        { label: '/admin/facility', value: '/admin/facility', group: 'Meey Admin' },
        { label: '/admin/position', value: '/admin/position', group: 'Meey Admin' },
        { label: '/admin/endpoint', value: '/admin/endpoint', group: 'Meey Admin' },
        { label: '/admin/department', value: '/admin/department', group: 'Meey Admin' },
        { label: '/admin/permission', value: '/admin/permission', group: 'Meey Admin' },
        { label: '/admin/smstemplate', value: '/admin/smstemplate', group: 'Meey Admin' },
        { label: '/admin/smtpaccount', value: '/admin/smtpaccount', group: 'Meey Admin' },
        { label: '/admin/logactivity', value: '/admin/logactivity', group: 'Meey Admin' },
        { label: '/admin/logexception', value: '/admin/logexception', group: 'Meey Admin' },
        { label: '/admin/prefixnumber', value: '/admin/prefixnumber', group: 'Meey Admin' },
        { label: '/admin/configuration', value: '/admin/configuration', group: 'Meey Admin' },
        { label: '/admin/emailtemplate', value: '/admin/emailtemplate', group: 'Meey Admin' },
        { label: '/admin/priceproperty', value: '/admin/priceproperty', group: 'Meey Admin' },
        { label: '/admin/linkpermission', value: '/admin/linkpermission', group: 'Meey Admin' },
        { label: '/admin/ticketcategory', value: '/admin/ticketcategory', group: 'Meey Admin' },
        { label: '/admin/metaseotemplate', value: '/admin/metaseotemplate', group: 'Meey Admin' },
        { label: '/admin/extensionmapping', value: '/admin/extensionmapping', group: 'Meey Admin' },
        { label: '/admin/mlredirect', value: '/admin/mlredirect', group: 'Meey Land' },
        { label: '/admin/mluser', value: '/admin/mluser', group: 'Meey Land' },
        { label: '/admin/mluser/statistical', value: '/admin/mluser/statistical', group: 'Meey Land' },
        { label: '/admin/mlpartner', value: '/admin/mlpartner', group: 'Meey Land' },
        { label: '/admin/mlarticle', value: '/admin/mlarticle', group: 'Meey Land' },
        { label: '/admin/mlcompany', value: '/admin/mlcompany', group: 'Meey Land' },
        { label: '/admin/mlschedule', value: '/admin/mlschedule', group: 'Meey Land' },
        { label: '/admin/meeylandv2', value: '/admin/meeylandv2', group: 'Meey Land' },
        { label: '/admin/mlcouponhmc', value: '/admin/mlcouponhmc', group: 'Meey Land' },
        { label: '/admin/mpoproject/land', value: '/admin/mpoproject/land', group: 'Meey Land' },
        { label: '/admin/mlarticlecrawl', value: '/admin/mlarticlecrawl', group: 'Meey Land' },
        { label: '/admin/mlarticle/report', value: '/admin/mlarticle/report', group: 'Meey Land' },
        { label: '/admin/mmrequest', value: '/admin/mmrequest', group: 'Meey Map' },
        { label: '/admin/mmarticle', value: '/admin/mmarticle', group: 'Meey Map' },
        { label: '/admin/mmarticlecrawl', value: '/admin/mmarticlecrawl', group: 'Meey Map' },
        { label: '/admin/mmarticle/report', value: '/admin/mmarticle/report', group: 'Meey Map' },
        { label: '/admin/mpoproject/map', value: '/admin/mpoproject/map', group: 'Meey Map' },
        { label: '/admin/mmlookuphistory', value: '/admin/mmlookuphistory', group: 'Meey Map' },
        { label: '/admin/mmlookuphistory/view', value: '/admin/mmlookuphistory/view', group: 'Meey Map' },
        { label: '/admin/mmlookuphistory/question', value: '/admin/mmlookuphistory/question', group: 'Meey Map' },
        { label: '/admin/mprevenue', value: '/admin/mprevenue', group: 'Meey Pay' },
        { label: '/admin/mptransactions', value: '/admin/mptransactions', group: 'Meey Pay' },
        { label: '/admin/moorders ', value: '/admin/moorders', group: 'Meey Order' },
        { label: '/admin/motransaction ', value: '/admin/motransaction', group: 'Meey Order' },
        { label: '/admin/motransactionreward', value: '/admin/motransactionreward', group: 'Meey Order' },
        { label: '/admin/moservices ', value: '/admin/moservices', group: 'Meey Order' },
        { label: '/admin/moservicehistory ', value: '/admin/moservicehistory', group: 'Meey Order' },
        { label: '/admin/meeybank/news', value: '/admin/meeybank/news', group: 'Meey Bank' },
        { label: '/admin/meeybank/category', value: '/admin/meeybank/category', group: 'Meey Bank' },
        { label: '/admin/meeybank/categoryannounced', value: '/admin/meeybank/categoryannounced', group: 'Meey Bank' },
        { label: '/admin/meeybank/recruitment', value: '/admin/meeybank/recruitment', group: 'Meey Bank' },
        { label: '/admin/meeybank/profile', value: '/admin/meeybank/profile', group: 'Meey Bank' },
        { label: '/admin/meeygroup/page', value: '/admin/meeygroup/page', group: 'Meey Group' },
        { label: '/admin/meeygroup/news', value: '/admin/meeygroup/news', group: 'Meey Group' },
        { label: '/admin/meeygroup/banner', value: '/admin/meeygroup/banner', group: 'Meey Group' },
        { label: '/admin/meeygroup/leader', value: '/admin/meeygroup/leader', group: 'Meey Group' },
        { label: '/admin/meeygroup/qrleader', value: '/admin/meeygroup/qrleader', group: 'Meey Group' },
        { label: '/admin/meeygroup/office', value: '/admin/meeygroup/office', group: 'Meey Group' },
        { label: '/admin/meeygroup/product', value: '/admin/meeygroup/product', group: 'Meey Group' },
        { label: '/admin/meeygroup/section', value: '/admin/meeygroup/section', group: 'Meey Group' },
        { label: '/admin/meeygroup/message', value: '/admin/meeygroup/message', group: 'Meey Group' },
        { label: '/admin/meeygroup/partner', value: '/admin/meeygroup/partner', group: 'Meey Group' },
        { label: '/admin/meeygroup/category', value: '/admin/meeygroup/category', group: 'Meey Group' },
        { label: '/admin/meeygroup/employee', value: '/admin/meeygroup/employee', group: 'Meey Group' },
        { label: '/admin/meeygroup/announced', value: '/admin/meeygroup/announced', group: 'Meey Group' },
        { label: '/admin/meeygroupv2/profile', value: '/admin/meeygroupv2/profile', group: 'Meey Group' },
        { label: '/admin/meeygroup/pagesection', value: '/admin/meeygroup/pagesection', group: 'Meey Group' },
        { label: '/admin/meeygroupv2/recruitment', value: '/admin/meeygroupv2/recruitment', group: 'Meey Group' },
        { label: '/admin/meeygroup/categoryleader', value: '/admin/meeygroup/categoryleader', group: 'Meey Group' },
        { label: '/admin/meeygroup/categoryannounced', value: '/admin/meeygroup/categoryannounced', group: 'Meey Group' },
        { label: '/admin/meeycrm/company', value: '/admin/meeycrm/company', group: 'Meey CRM' },
        { label: '/admin/meeycrm/customer', value: '/admin/meeycrm/customer', group: 'Meey CRM' },
        { label: '/admin/meeycrm/customerlead', value: '/admin/meeycrm/customerlead', group: 'Meey CRM' },
        { label: '/admin/meeycrm/calllogstaff', value: '/admin/meeycrm/calllogstaff', group: 'Meey CRM' },
        { label: '/admin/meeycrm/customergroup', value: '/admin/meeycrm/customergroup', group: 'Meey CRM' },
        { label: '/admin/meeycrm/emailtemplate', value: '/admin/meeycrm/emailtemplate', group: 'Meey CRM' },
        { label: '/admin/meeycrm/iframecontract', value: '/admin/meeycrm/iframecontract', group: 'Meey CRM' },
        { label: '/admin/meeycrm/customerrequest', value: '/admin/meeycrm/customerrequest', group: 'Meey CRM' },
        { label: '/admin/meeycrm/calllogcustomer', value: '/admin/meeycrm/calllogcustomer', group: 'Meey CRM' },
        { label: '/admin/meeycrm/assignsaleconfig', value: '/admin/meeycrm/assignsaleconfig', group: 'Meey CRM' },
        { label: '/admin/meeycrm/customerlead', value: '/admin/meeycrm/customerlead', group: 'Meey CRM' },
        { label: '/admin/mccoupon', value: '/admin/mccoupon', group: 'Meey Coupon' },
        { label: '/admin/mafpolicy', value: '/admin/mafpolicy', group: 'Meey Affiliate' },
        { label: '/admin/mafrankcumulative', value: '/admin/mafrankcumulative', group: 'Meey Affiliate' },
        { label: '/admin/mafcontract', value: '/admin/mafcontract', group: 'Meey Affiliate' },
        { label: '/admin/mafaffiliate', value: '/admin/mafaffiliate', group: 'Meey Affiliate' },
        { label: '/admin/mafsynthetic', value: '/admin/mafsynthetic', group: 'Meey Affiliate' },
        { label: '/admin/mafaffiliate/nodev1', value: '/admin/mafaffiliate/nodev1', group: 'Meey Affiliate' },
        { label: '/admin/mafaffiliate/request', value: '/admin/mafaffiliate/request', group: 'Meey Affiliate' },
        { label: '/admin/mpoproject', value: '/admin/mpoproject', group: 'Meey Project' },
        { label: '/admin/mpoproject/video', value: '/admin/mpoproject/video', group: 'Meey Project' },
        { label: '/admin/mpoproject/slide', value: '/admin/mpoproject/slide', group: 'Meey Project' },
        { label: '/admin/mpoproject/statistic', value: '/admin/mpoproject/statistic', group: 'Meey Project' },
        { label: '/admin/mpoproject/hashtags', value: '/admin/mpoproject/hashtags', group: 'Meey Project' },
        { label: '/admin/mpoproject/customer', value: '/admin/mpoproject/customer', group: 'Meey Project' },
        { label: '/admin/mpoproject/projecttype', value: '/admin/mpoproject/projecttype', group: 'Meey Project' },
        { label: '/admin/mpoproject/contributes', value: '/admin/mpoproject/contributes', group: 'Meey Project' },
        { label: '/admin/mpoproject/violationtype', value: '/admin/mpoproject/violationtype', group: 'Meey Project' },
        { label: '/admin/mpoproject/verifydocument', value: '/admin/mpoproject/verifydocument', group: 'Meey Project' },
        { label: '/admin/mpoproject/projectinvestor', value: '/admin/mpoproject/projectinvestor', group: 'Meey Project' },
        { label: '/admin/mpoproject/projectcategory', value: '/admin/mpoproject/projectcategory', group: 'Meey Project' },
        { label: '/admin/mpoproject/review-contribute', value: '/admin/mpoproject/review-contribute', group: 'Meey Project' },
        { label: '/admin/mpoproject/investor-type-unit', value: '/admin/mpoproject/investor-type-unit', group: 'Meey Project' },
        { label: '/admin/mpoproject/investor-unit', value: '/admin/mpoproject/investor-unit', group: 'Meey Project' },
        { label: '/admin/mbbanner', value: '/admin/mbbanner', group: 'Meey Banner' },
        { label: '/admin/mbbannerv2', value: '/admin/mbbannerv2', group: 'Meey Banner' },
        { label: '/admin/msseo', value: '/admin/msseo', group: 'Meey Seo' },
        { label: '/admin/msseo/files', value: '/admin/msseo/files', group: 'Meey Seo' },
        { label: '/admin/msseo/metaseo', value: '/admin/msseo/metaseo', group: 'Meey Seo' },
        { label: '/admin/msseo/metaseov2', value: '/admin/msseo/metaseov2', group: 'Meey Seo' },
        { label: '/admin/msseo/filetags', value: '/admin/msseo/filetags', group: 'Meey Seo' },
        { label: '/admin/msseo/shortcode', value: '/admin/msseo/shortcode', group: 'Meey Seo' },
        { label: '/admin/msseo/boxtextlink', value: '/admin/msseo/boxtextlink', group: 'Meey Seo' },
        { label: '/admin/msseo/textlinkauto', value: '/admin/msseo/textlinkauto', group: 'Meey Seo' },
        { label: '/admin/msseo/textlinkmanual', value: '/admin/msseo/textlinkmanual', group: 'Meey Seo' },
        { label: '/admin/redt', value: '/admin/redt', group: 'Meey Redt' },
        { label: '/admin/redt/news', value: '/admin/redt/news', group: 'Meey Redt' },
        { label: '/admin/redt/menu', value: '/admin/redt/menu', group: 'Meey Redt' },
        { label: '/admin/redt/leader', value: '/admin/redt/leader', group: 'Meey Redt' },
        { label: '/admin/redt/office', value: '/admin/redt/office', group: 'Meey Redt' },
        { label: '/admin/redt/category', value: '/admin/redt/category', group: 'Meey Redt' },
        { label: '/admin/redt/corevalue', value: '/admin/redt/corevalue', group: 'Meey Redt' },
        { label: '/admin/redt/question', value: '/admin/redt/question', group: 'Meey Redt' },
        { label: '/admin/redt/question', value: '/admin/redt/question', group: 'Meey Redt' },
        { label: '/admin/meey3d', value: '/admin/meey3d', group: 'Meey 3D' },
        { label: '/admin/meey3d/tour', value: '/admin/meey3d/tour', group: 'Meey 3D' },
        { label: '/admin/meey3d/contactinfo', value: '/admin/meey3d/contactinfo', group: 'Meey 3D' },
        { label: '/admin/meey3d/dashboard', value: '/admin/meey3d/dashboard', group: 'Meey 3D' },
        { label: '/admin/mcrminvestor', value: '/admin/mcrminvestor', group: 'CRM Investor' },
        { label: '/admin/meeyshare/news', value: '/admin/meeyshare/news', group: 'Meey Share' },
        { label: '/admin/meeyshare/report', value: '/admin/meeyshare/report', group: 'Meey Share' },
        { label: '/admin/meeyshare/comment', value: '/admin/meeyshare/comment', group: 'Meey Share' },
        { label: '/admin/meeyreview', value: '/admin/meeyreview', group: 'Meey Review' },
        { label: '/admin/meeyreview/user', value: '/admin/meeyreview/user', group: 'Meey Review' },
        { label: '/admin/meeyreview/project', value: '/admin/meeyreview/project', group: 'Meey Review' },
        { label: '/admin/badwordapi', value: '/admin/badwordapi', group: 'BadwordApi' },
        { label: '/admin/meeyreview/reportviolate', value: '/admin/meeyreview/reportviolate', group: 'Meey Review' },
    ];
    public static EMAILTEMPLATE_TYPES: OptionItem[] = [
        { label: 'Đăng ký tài khoản', value: EmailTemplateType.MARegister, group: 'Meey Admin' },
        { label: 'Người dùng thay đổi mật khẩu', value: EmailTemplateType.MAUserResetPassword, group: 'Meey Admin' },
        { label: 'Admin thay đổi mật khẩu', value: EmailTemplateType.MAAdminResetPassword, group: 'Meey Admin' },
        { label: 'Đăng ký tài khoản', value: EmailTemplateType.MLRegister, group: 'Meey Id' },
        { label: 'Thay đổi mật khẩu', value: EmailTemplateType.MLResetPassword, group: 'Meey Id' },
        { label: 'Khóa tài khoản', value: EmailTemplateType.MLLock, group: 'Meey Id' },
        { label: 'Mở khóa tài khoản', value: EmailTemplateType.MLUnlock, group: 'Meey Id' },
        { label: 'Xác nhận Email', value: EmailTemplateType.MLVerifyEmail, group: 'Meey Id' },
        { label: 'Xác thực OTP', value: EmailTemplateType.MLVerifyOtp, group: 'Meey Id' },
        { label: 'MLCompany03', value: EmailTemplateType.MLCompany03, group: 'Meey Company' },
        { label: 'MLCompany04', value: EmailTemplateType.MLCompany04, group: 'Meey Company' },
        { label: 'MLCompany05', value: EmailTemplateType.MLCompany05, group: 'Meey Company' },
        { label: 'MLCompany06', value: EmailTemplateType.MLCompany06, group: 'Meey Company' },
        { label: 'MLCompany07', value: EmailTemplateType.MLCompany07, group: 'Meey Company' },
        { label: 'MLCompany08', value: EmailTemplateType.MLCompany08, group: 'Meey Company' },
        { label: 'MLCompany09', value: EmailTemplateType.MLCompany09, group: 'Meey Company' },
        { label: 'MLCompany10', value: EmailTemplateType.MLCompany10, group: 'Meey Company' },
        { label: 'MLCompany11', value: EmailTemplateType.MLCompany11, group: 'Meey Company' },
        { label: 'MLCompany12', value: EmailTemplateType.MLCompany12, group: 'Meey Company' },
        { label: 'MLCompany13', value: EmailTemplateType.MLCompany13, group: 'Meey Company' },
        { label: 'MLCompany14', value: EmailTemplateType.MLCompany14, group: 'Meey Company' },
        { label: 'MLCompany15', value: EmailTemplateType.MLCompany15, group: 'Meey Company' },
        { label: 'MLCompany16', value: EmailTemplateType.MLCompany16, group: 'Meey Company' },
        { label: 'MLCompany17', value: EmailTemplateType.MLCompany17, group: 'Meey Company' },
        { label: 'MLCompany18', value: EmailTemplateType.MLCompany18, group: 'Meey Company' },
        { label: 'MLCompanySendOtp', value: EmailTemplateType.MLCompanySendOtp, group: 'Meey Company' },
        { label: 'MLAppointment05', value: EmailTemplateType.MLAppointment05, group: 'Meey Appointment' },
        { label: 'MLAppointment06', value: EmailTemplateType.MLAppointment06, group: 'Meey Appointment' },
        { label: 'MLAppointment07', value: EmailTemplateType.MLAppointment07, group: 'Meey Appointment' },
        { label: 'MLAppointment08', value: EmailTemplateType.MLAppointment08, group: 'Meey Appointment' },
        { label: 'MLAppointment09', value: EmailTemplateType.MLAppointment09, group: 'Meey Appointment' },
        { label: 'MLAppointment10', value: EmailTemplateType.MLAppointment10, group: 'Meey Appointment' },
        { label: 'MLAppointment11', value: EmailTemplateType.MLAppointment11, group: 'Meey Appointment' },
        { label: 'MLAppointment12', value: EmailTemplateType.MLAppointment12, group: 'Meey Appointment' },
        { label: 'MLAppointment13', value: EmailTemplateType.MLAppointment13, group: 'Meey Appointment' },
        { label: 'MLAppointment14', value: EmailTemplateType.MLAppointment14, group: 'Meey Appointment' },
        { label: 'MLAppointment15', value: EmailTemplateType.MLAppointment15, group: 'Meey Appointment' },
        { label: 'KHCN - Đăng ký thông tin', value: EmailTemplateType.MAF01, group: 'Meey Affiliate' },
        { label: 'Admin - Xác nhận hợp đồng Tiếp thị liên kết', value: EmailTemplateType.MAF02, group: 'Meey Affiliate' },
        { label: 'Admin - Từ chối hợp đồng Tiếp thị liên kết', value: EmailTemplateType.MAF03, group: 'Meey Affiliate' },
        { label: 'KHDN - Chưa được duyệt hợp đồng, chưa nộp hóa đơn', value: EmailTemplateType.MAF04, group: 'Meey Affiliate' },
        { label: 'KHDN - Chưa nộp hóa đơn', value: EmailTemplateType.MAF05, group: 'Meey Affiliate' },
        { label: 'KHCN - Chưa hoàn thiện hợp đồng', value: EmailTemplateType.MAF06, group: 'Meey Affiliate' },
        { label: 'KHCN - Chưa khai báo thông tin', value: EmailTemplateType.MAF07, group: 'Meey Affiliate' },
        { label: 'Admin - Thông báo tạm tính hoa hồng hàng tháng', value: EmailTemplateType.MAF08, group: 'Meey Affiliate' },
        { label: 'Admin - Thông báo thanh toán hoa hồng hàng tháng', value: EmailTemplateType.MAF09, group: 'Meey Affiliate' },
        { label: 'KHDN - Thông báo hóa đơn cho phòng kế toán', value: EmailTemplateType.MAF10, group: 'Meey Affiliate' },
        { label: 'Admin - Thông báo khách hàng cần duyệt cấp bậc', value: EmailTemplateType.MAF11, group: 'Meey Affiliate' },
        { label: 'KHCN - Thông báo duyệt cấp bậc cho khách hàng thành công', value: EmailTemplateType.MAF12, group: 'Meey Affiliate' },
        { label: 'Đăng tin thành công', value: EmailTemplateType.MLArticle1, group: 'Meey Article' },
        { label: 'Hạ tin', value: EmailTemplateType.MLArticle2, group: 'Meey Article' },
        { label: 'Hạ nhiều tin', value: EmailTemplateType.MLArticle3, group: 'Meey Article' },
        { label: 'Đăng tin thành công [Có tiền]', value: EmailTemplateType.MLArticle4, group: 'Meey Article' },
        { label: 'Duyệt tin thành công', value: EmailTemplateType.MLArticle5, group: 'Meey Article' },
        { label: 'Từ chối duyệt tin đăng', value: EmailTemplateType.MLArticle6, group: 'Meey Article' },
        { label: 'Chuyển đổi coin', value: EmailTemplateType.MCTransferMoney, group: 'Meey Coin' },
        { label: 'Thanh toán hoa hồng (Hệ thống cũ)', value: EmailTemplateType.MPPaymentOldSystem, group: 'Meey Pay' },
        { label: 'Chuyển lượt tra quy hoạch', value: EmailTemplateType.MMap1, group: 'Meey Map' },
        { label: 'Thu hồi lượt tra quy hoạch', value: EmailTemplateType.MMap2, group: 'Meey Map' },
        { label: 'Yêu cầu hỗ trợ khách hàng', value: EmailTemplateType.MMap3, group: 'Meey Map' },
    ];
    public static DOMAINS: OptionItem[] = [
        { label: '[Dev] v3-api.meey.dev', value: 'https://v3-api.meey.dev', group: 'Meey Land' },
        { label: '[Stag] v3-api-stag.meey.dev', value: 'https://v3-api-stag.meey.dev', group: 'Meey Land' },
        { label: '[Prod] api-v3.meeyland.com', value: 'https://api-v3.meeyland.com', group: 'Meey Land' },
        { label: '[Dev] mlv41-api-test.meey.dev', value: 'https://mlv41-api-test.meey.dev', group: 'Meey Land V4' },
        { label: '[Stag] mlv41-api-stg.meey.dev', value: 'https://mlv41-api-stg.meey.dev', group: 'Meey Land V4' },
        { label: '[Prod] mlv41-api.meeyland.com', value: 'https://mlv41-api.meeyland.com', group: 'Meey Land V4' },
        { label: '[Dev] map-api-test.meey.dev', value: 'https://map-api-test.meey.dev', group: 'Meey Map' },
        { label: '[Stag] api-stg.meeymap.com', value: 'https://api-stg.meeymap.com', group: 'Meey Map' },
        { label: '[Prod] api.meeymap.com', value: 'https://api.meeymap.com', group: 'Meey Map' },
        { label: '[Dev] meeyid-api.meey.dev', value: 'https://meeyid-api.meey.dev', group: 'Meey Id' },
        { label: '[Stag] meeyid-api-stag.meey.dev', value: 'https://meeyid-api-stag.meey.dev', group: 'Meey Id' },
        { label: '[Prod] v3.meeyid.com', value: 'https://v3.meeyid.com', group: 'Meey Id' },
        { label: '[Dev] api-dev-meeypay.meey.dev', value: 'http://api-dev-meeypay.meey.dev', group: 'Meey Pay' },
        { label: '[Dev] transaction-dev.meeypay.com', value: 'http://transaction-dev.meeypay.com', group: 'Meey Pay' },
        { label: '[Stag] api-staging-meeypay.meey.dev', value: 'http://api-staging-meeypay.meey.dev', group: 'Meey Pay' },
        { label: '[Prod] pay-k8s.meeyland.com', value: 'http://pay-k8s.meeyland.com', group: 'Meey Pay' },
        { label: '[Bank] tranx.meeycdn.com', value: 'https://tranx.meeycdn.com', group: 'Meey Pay' },
        { label: '[Dev] meeyorder-test.meey.dev', value: 'https://meeyorder-test.meey.dev', group: 'Meey Order' },
        { label: '[Stag] meeyorder-api-stag.meey.dev', value: 'https://meeyorder-api-stag.meey.dev', group: 'Meey Order' },
        { label: '[Prod] order.meeyland.com', value: 'https://order.meeyland.com', group: 'Meey Order' },
        { label: '[Dev] affiliate-dev.meey.dev', value: 'https://affiliate-dev.meey.dev', group: 'Meey Affiliate' },
        { label: '[Stag] affiliate-stag.meey.dev', value: 'https://affiliate-stag.meey.dev', group: 'Meey Affiliate' },
        { label: '[Prod] affiliate.meeyland.com', value: 'https://affiliate.meeyland.com', group: 'Meey Affiliate' },
        { label: '[Dev] meeyproject-api-test.meey.dev', value: 'https://test-api.meeyproject.com', group: 'Meey Project' },
        { label: '[Stag] staging-api.meeyproject.com', value: 'https://staging-api.meeyproject.com', group: 'Meey Project' },
        { label: '[Beta] beta-api.meeyproject.com', value: 'https://beta-api.meeyproject.com', group: 'Meey Project' },
        { label: '[Prod] api.meeyproject.com', value: 'https://api.meeyproject.com', group: 'Meey Project' },
        { label: '[Dev] mlv41-api-test.meey.dev', value: 'https://mlv41-api-test.meey.dev', group: 'Meey SEO' },
        { label: '[Stag] mlv41-api-stg.meey.dev', value: 'https://mlv41-api-stg.meey.dev', group: 'Meey SEO' },
        { label: '[Prod] mlv41-api.meeyland.com', value: 'https://mlv41-api.meeyland.com', group: 'Meey SEO' },
        { label: '[Prod-AI] postextract.meeyland.com', value: 'https://postextract.meeyland.com', group: 'Meey SEO' },
        { label: '[Dev] meeycoupon-api-dev.meey.dev', value: 'https://meeycoupon-api-dev.meey.dev', group: 'Meey Coupon' },
        { label: '[Stag] meeycoupon-api-stag.meey.dev', value: 'https://meeycoupon-api-stag.meey.dev', group: 'Meey Coupon' },
        { label: '[Prod] api.meeycoupon.com', value: 'https://api.meeycoupon.com', group: 'Meey Coupon' },
        { label: '[Prod] meeyland.vfone.vn', value: 'https://meeyland.vfone.vn:65483', group: 'Meey CRM' },
        { label: '[Prod] pbx.onconnect.vn', value: 'https://pbx.onconnect.vn', group: 'Meey CRM' },
        { label: '[Dev] banner-api.meey.dev', value: 'https://banner-api.meey.dev', group: 'Meey Banner' },
        { label: '[Stag] banner-api-stg.meey.dev', value: 'https://banner-api-stg.meey.dev', group: 'Meey Banner' },
        { label: '[Prod] banner.meeyland.com', value: 'https://banner.meeyland.com', group: 'Meey Banner' },
        { label: '[Dev] api-redt.meey.dev', value: 'https://api-redt.meey.dev', group: 'Meey Redt' },
        { label: '[Stag] api-staging.redt.vn', value: 'https://api-staging.redt.vn', group: 'Meey Redt' },
        { label: '[Prod] api.redt.vn', value: 'https://api.redt.vn', group: 'Redt' },
        { label: '[Dev] api-meeyshare.meey.dev', value: 'https://api-meeyshare.meey.dev', group: 'Meey Share' },
        { label: '[Prod] api.meeyshare.com', value: 'https://api.meeyshare.com', group: 'Meey Share' },
        { label: '[Dev] api-3d.meey.dev', value: 'https://meey3d-api-test.meey.dev/graphql', group: 'Meey 3D' },
        { label: '[Stag] api-staging.meey3d.com', value: 'https://api-staging.meey3d.com/graphql', group: 'Meey 3D' },
        { label: '[Prod] api.meey3d.com', value: 'https://api.meey3d.com/graphql', group: 'Meey 3D' },
        { label: '[Dev] api-meeyshare.meey.dev', value: 'https://api-meeyshare.meey.dev', group: 'Meey Share' },
        { label: '[Prod] api.meeyshare.com', value: 'https://api.meeyshare.com', group: 'Meey Share' },
        { label: '[Dev] api-review.meey.dev', value: 'https://api-review.meey.dev', group: 'Meey Review' },

    ];
    public static MG_LINKS: OptionItem[] = [
        { label: '/', value: '/trang-chu' },
        { label: '/tin-tuc', value: '/tin-tuc' },
        { label: '/tim-kiem', value: '/tim-kiem' },
        { label: '/tuyen-dung', value: '/tuyen-dung' },
        { label: '/tin-chi-tiet', value: '/tin-chi-tiet' },
        { label: '/he-sinh-thai', value: '/he-sinh-thai' },
        { label: '/xem-tai-lieu', value: '/xem-tai-lieu' },
        { label: '/ve-meey-group', value: '/ve-meey-group' },
        { label: '/qhcd-chi-tiet', value: '/qhcd-chi-tiet' },
        { label: '/quan-he-co-dong', value: '/quan-he-co-dong' },
        { label: '/hop-tac-kinh-doanh', value: '/hop-tac-kinh-doanh' },
    ];
    public static DEPARTMENT_TYPES: OptionItem[] = [
        { label: 'Sale', value: DepartmentType.Sale },
        { label: 'Chăm sóc khách hàng', value: DepartmentType.Support },
    ];
    public static MG_ANNOUNCED_STATUS_TYPES: OptionItem[] = [
        { label: 'Chờ duyệt', value: MGAnnouncedStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Thành Công', value: MGAnnouncedStatusType.Success, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Từ chối', value: MGAnnouncedStatusType.Reject, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MG_BANNER_STATUS_TYPES: OptionItem[] = [
        { label: 'Lưu tạm', value: MGBannerStatusType.Draft, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đã dừng', value: MGBannerStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Chưa chạy', value: MGBannerStatusType.NotUse, color: 'kt-badge kt-badge--inline kt-badge--info' },
        { label: 'Đang chạy', value: MGBannerStatusType.Active, color: 'kt-badge kt-badge--inline kt-badge--success' },
    ];
    public static MG_BANNER_DEVICE: OptionItem[] = [
        { label: 'PC', value: MGBannerDevice.PC },
        { label: 'Mobile', value: MGBannerDevice.Mobile },
        { label: 'Tablet', value: MGBannerDevice.Tablet },
    ];
    public static MG_SECTION_TYPES: OptionItem[] = [
        { label: 'Menu', value: MGSectionType.Menu },
        { label: 'Ảnh', value: MGSectionType.Image },
        { label: 'Tiêu đề', value: MGSectionType.Title },
        { label: 'Đường dẫn', value: MGSectionType.Link },
        { label: 'Tin tức 1', value: MGSectionType.News1 },
        { label: 'Tin tức 2', value: MGSectionType.News2 },
        { label: 'Tìm kiếm', value: MGSectionType.Search },
        { label: 'Địa chỉ', value: MGSectionType.Address },
        { label: 'Lãnh đạo', value: MGSectionType.Leader },
        { label: 'Liên hệ', value: MGSectionType.Contact },
        { label: 'Banner 1', value: MGSectionType.Banner1 },
        { label: 'Banner 2', value: MGSectionType.Banner2 },
        { label: 'Nội dung', value: MGSectionType.Section },
        { label: 'Sản phẩm', value: MGSectionType.Product },
        { label: 'Câu hỏi', value: MGSectionType.Question },
        { label: 'Chân trang', value: MGSectionType.Footer },
        { label: 'Nhân viên', value: MGSectionType.Employee },
        { label: 'Thông báo', value: MGSectionType.Announced },
        { label: 'Bản quyền', value: MGSectionType.CopyRight },
        { label: 'Những con số', value: MGSectionType.Number },
        { label: 'Về chúng tôi', value: MGSectionType.AboutUs },
        { label: 'Tin tức khác', value: MGSectionType.OtherNews },
        { label: 'Hệ sinh thái', value: MGSectionType.Ecosystem },
        { label: 'Tin tức đầy đủ', value: MGSectionType.FullNews },
        { label: 'Tin chi tiết', value: MGSectionType.NewsDetail },
        { label: 'Hiệp hội/Đối tác', value: MGSectionType.Partner },
        { label: 'Giá trị cốt lõi', value: MGSectionType.CoreValue },
        { label: 'Tuyển dụng 1', value: MGSectionType.Recruitment1 },
        { label: 'Tuyển dụng 2', value: MGSectionType.Recruitment2 },
        { label: 'Sản phẩm khác', value: MGSectionType.OtherProduct },
        { label: 'Dành cho báo chí', value: MGSectionType.Newspapers },
        { label: 'Văn phòng/Chi nhánh 1', value: MGSectionType.Office1 },
        { label: 'Văn phòng/Chi nhánh 2', value: MGSectionType.Office2 },
        { label: 'Thông báo chi tiết', value: MGSectionType.AnnouncedDetail },
    ];
    public static MG_PAGE_TYPES: OptionItem[] = [
        { label: 'Trang chủ', value: MGPageType.HomePage },
        { label: 'Trang hệ sinh thái', value: MGPageType.Product },
    ];
    public static MG_SECTION_PAGE_TYPES: OptionItem[] = [
        { label: 'Trang chủ', value: MGSectionPageType.HomePage },
    ];
    public static MG_OFFICE_TYPES: OptionItem[] = [
        { label: 'Trụ sở chính', value: MGOfficeType.Primary },
        { label: 'Chi nhánh', value: MGOfficeType.Branch },
        { label: 'Văn phòng đại diện', value: MGOfficeType.Office },
    ];
    public static MG_OFFICE_STRATEGY_TYPES: OptionItem[] = [
        { label: 'Không xác định', value: MGOfficeStrategyType.Nothing },
        { label: 'Ban chiến lược thị trường', value: MGOfficeStrategyType.InSide },
        { label: 'Ban chiến lược thị trường quốc tế', value: MGOfficeStrategyType.OutSide },
    ];
    public static MG_CATEGORY_ANNOUNCED_TYPES: OptionItem[] = [
        { label: 'Ảnh', value: MGCategoryAnnouncedType.Image },
        { label: 'Danh sách', value: MGCategoryAnnouncedType.List },
        { label: 'Danh sách - Nhóm', value: MGCategoryAnnouncedType.ListGroup },
    ];
    public static MG_CATEGORY_LEADER_TYPES: OptionItem[] = [
        { label: 'Chủ tịch', value: MGCategoryLeaderType.Primary },
        { label: 'Nhóm thực thi', value: MGCategoryLeaderType.Implementation },
        { label: 'Nhóm công nghệ', value: MGCategoryLeaderType.Technology },
    ];
    public static MG_PARTNER_TYPES: OptionItem[] = [
        { label: 'Hiệp hội', value: MGPartnerType.Association },
        { label: 'Đối tác (MeeyGroup)', value: MGPartnerType.Partner },
        { label: 'Đối tác (MeeyLand)', value: MGPartnerType.MLPartner },
    ];
    public static MG_RECRUITMENT_TYPES: OptionItem[] = [
        { label: 'Tin thường', value: MgRecruitmentType.Normal },
        { label: 'Tin nổi bật', value: MgRecruitmentType.Hot, color: 'kt-badge kt-badge--inline kt-badge--primary' },
    ];
    public static MBANK_RECRUITMENT_TYPES: OptionItem[] = [
        { label: 'Tin thường', value: MBankRecruitmentType.Normal },
        { label: 'Tin nổi bật', value: MBankRecruitmentType.Hot, color: 'kt-badge kt-badge--inline kt-badge--primary' },
    ];
    public static MG_RECRUITMENT_STATUS_TYPES: OptionItem[] = [
        { label: 'Đang đăng', value: MgRecruitmentStatusType.Active, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Chờ đăng', value: MgRecruitmentStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Tạm dừng', value: MgRecruitmentStatusType.Pause, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Hết hạn', value: MgRecruitmentStatusType.Expire, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MBANK_RECRUITMENT_STATUS_TYPES: OptionItem[] = [
        { label: 'Đang đăng', value: MBankRecruitmentStatusType.Active, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Chờ đăng', value: MBankRecruitmentStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Tạm dừng', value: MBankRecruitmentStatusType.Pause, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Hết hạn', value: MBankRecruitmentStatusType.Expire, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];

    public static MG_PROFILE_STATUS_TYPES: OptionItem[] = [
        { label: 'Mới ứng tuyển', value: MGProfileStatusType.New, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Chưa quyết định', value: MGProfileStatusType.Waiting, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Kiểm tra', value: MGProfileStatusType.Check, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Phỏng vấn', value: MGProfileStatusType.Process, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đề nghị tuyển dụng', value: MGProfileStatusType.Suggestion, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Nhận việc', value: MGProfileStatusType.Success, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Không phù hợp', value: MGProfileStatusType.Inconsonant, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Từ chối', value: MGProfileStatusType.Reject, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];

    public static MG_RECRUITMENT_SALARY_UNIT_TYPES: OptionItem[] = [
        { label: 'VNĐ', value: MgRecruitmentSalaryUnitType.VND },
        { label: 'USD', value: MgRecruitmentSalaryUnitType.USD },
    ];
    public static MBANK_RECRUITMENT_SALARY_UNIT_TYPES: OptionItem[] = [
        { label: 'VNĐ', value: MBankRecruitmentSalaryUnitType.VND },
        { label: 'USD', value: MBankRecruitmentSalaryUnitType.USD },
    ];

    public static MG_RECRUITMENT_EXPERIENCE_VN_TYPES: OptionItem[] = [
        { label: 'Không yêu cầu kinh nghiệm', value: MgRecruitmentExperienceType.NOT_REQUIRE },
        { label: 'Chưa có kinh nghiệm', value: MgRecruitmentExperienceType.No },
        { label: 'Có kinh nghiệm', value: MgRecruitmentExperienceType.Yes },
    ];
    public static MBANK_RECRUITMENT_EXPERIENCE_VN_TYPES: OptionItem[] = [
        { label: 'Không yêu cầu kinh nghiệm', value: MBankRecruitmentExperienceType.NOT_REQUIRE },
        { label: 'Chưa có kinh nghiệm', value: MBankRecruitmentExperienceType.No },
        { label: 'Có kinh nghiệm', value: MBankRecruitmentExperienceType.Yes },
    ];
    //MeeyBank
    public static MBANK_CATEGORY_LEADER_TYPES: OptionItem[] = [
        { label: 'Chủ tịch', value: MGCategoryLeaderType.Primary },
        { label: 'Nhóm thực thi', value: MGCategoryLeaderType.Implementation },
        { label: 'Nhóm công nghệ', value: MGCategoryLeaderType.Technology },
    ];
    public static MBANK_CATEGORY_ANNOUNCED_TYPES: OptionItem[] = [
        { label: 'Ảnh', value: MGCategoryAnnouncedType.Image },
        { label: 'Danh sách', value: MGCategoryAnnouncedType.List },
        { label: 'Danh sách - Nhóm', value: MGCategoryAnnouncedType.ListGroup },
    ];
    public static MBANK_PROFILE_STATUS_TYPES: OptionItem[] = [
        { label: 'Mới ứng tuyển', value: MGProfileStatusType.New, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Chưa quyết định', value: MGProfileStatusType.Waiting, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Kiểm tra', value: MGProfileStatusType.Check, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Phỏng vấn', value: MGProfileStatusType.Process, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đề nghị tuyển dụng', value: MGProfileStatusType.Suggestion, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Nhận việc', value: MGProfileStatusType.Success, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Không phù hợp', value: MGProfileStatusType.Inconsonant, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Từ chối', value: MGProfileStatusType.Reject, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];

    public static PERMISSION_TYPES = [
        { label: 'Tất cả', value: PermissionType.All },
        { label: 'Bản thân', value: PermissionType.Owner },
        { label: 'Nhóm', value: PermissionType.Team },
        { label: 'Phòng', value: PermissionType.Department },
    ];
    public static ML_WALLET_HISTORY_TYPES = [
        { label: 'Cộng tiền', value: MPWalletHistoryType.Plus },
        { label: 'Trừ tiền', value: MPWalletHistoryType.Minus },
    ];
    public static ML_COMPANY_STATUS_TYPES = [
        { label: 'Chờ duyệt', value: MLCompanyStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Hoạt động', value: MLCompanyStatusType.Active, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Từ chối', value: MLCompanyStatusType.Reject, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static ML_EMPLOYEE_STATUS_TYPES = [
        { label: 'Chờ xác nhận', value: MLEmployeeStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đang hoạt động', value: MLEmployeeStatusType.Active, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Hủy lời mời', value: MLEmployeeStatusType.Cancel, color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Từ chối', value: MLEmployeeStatusType.Rejected, color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Đã khóa', value: MLEmployeeStatusType.Locked, color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Đã xóa', value: MLEmployeeStatusType.Deleted, color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static ML_EMPLOYEE_IMPORT_SALE_STATUS_TYPES = [
        { value: MLEmployeeImportStatusType.Success, label: 'Hợp lệ', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MLEmployeeImportStatusType.Error, label: 'Không hợp lệ', color: 'kt-badge kt-badge--inline kt-badge--danger' }
    ];
    public static MP_TRANSACTION_TYPES = [
        { label: 'Nạp tiền', value: MPTransactionType.Topup },
        { label: 'Thưởng', value: MPTransactionType.Reward },
        { label: 'Khuyến mại', value: MPTransactionType.Promotion },
        { label: 'Chuyển tiền', value: MPTransactionType.Transfer },
        { label: 'Thu hồi', value: MPTransactionType.Recovery },
        { label: 'Tặng TKKM 2', value: MPTransactionType.Donate },
        { label: 'Thanh toán dịch vụ', value: MPTransactionType.Payment },
    ];
    public static MP_PAYMENT_METHOD_TYPES = [
        { label: 'Online ATM', value: MPPaymentMethodType.OnlineATM },
        { label: 'Thẻ quốc tế', value: MPPaymentMethodType.Card },
        { label: 'Chuyển khoản ngân hàng', value: MPPaymentMethodType.Transfer },
        { label: 'Văn phòng', value: MPPaymentMethodType.Office },
        { label: 'Chuyển khoản', value: MPPaymentMethodType.BankTransfer },
        { label: 'Tài khoản Meey Pay', value: MPPaymentMethodType.MeeyPayAccount },
        { label: 'Coupon', value: MPPaymentMethodType.Coupon },
        { label: 'Tài khoản ưu đãi', value: MPPaymentMethodType.TransactionReward },
    ];
    public static MP_PAYMENT_METHOD_TYPES_CUSTOM = [
        { label: 'Tài khoản Meey Pay', value: MPPaymentMethodType.MeeyPayAccount },
        { label: 'Tài khoản ưu đãi', value: MPPaymentMethodType.TransactionReward },
    ];
    public static MP_REVENUE_STATUS_TYPES = [
        { label: 'Chưa khớp', value: MPRevenueStatusType.Init, color: 'kt-badge kt-badge--inline kt-badge--info' },
        { label: 'Chờ duyệt', value: MPRevenueStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đã khớp', value: MPRevenueStatusType.Matched, color: 'kt-badge kt-badge--inline kt-badge--success' },
    ];
    public static MP_TRANSACTION_STATUS_TYPES = [
        { label: 'Tạo mới', value: MPTransactionStatusType.New, color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Thành công', value: MPTransactionStatusType.Success, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Đang xử lý', value: MPTransactionStatusType.Process, color: 'kt-badge kt-badge--inline kt-badge--waiting' },
        { label: 'Chờ xác nhận', value: MPTransactionStatusType.Waiting, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Thất bại', value: MPTransactionStatusType.Fail, color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Hủy', value: MPTransactionStatusType.Cancel, color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static MO_TRANSACTION_REWARD_STATUS_TYPES = [
        { label: 'Tạo mới', value: 'new', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { label: 'Thành công', value: 'completed', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Thất bại', value: 'failure', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { label: 'Hủy', value: 'canceled', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static MO_TRANSACTION_REWARD_STATUS_PAYMENTMETHOD_TYPES = [
        { label: 'Nạp tiền', value: 'charge'},
        { label: 'Thanh toán', value: 'payment'},
        { label: 'Chuyển tiền', value: 'transfer'},
    ];
    public static MO_TRANSACTION_REWARD_PaymentMethod_TYPES = [
        { label: 'Tài khoản ưu đãi', value: 'Ưu đãi'},
    ];
    public static MP_TRANSACTION_CONTENT_DISPLAY_TYPES = [
        { label: "Meey Land tặng thưởng cho khách hàng VIP", value: "Meey Land tặng thưởng cho khách hàng VIP" }
    ];
    public static MP_TRANSACTION_FUNDS_TYPES = [
        { label: "Chuyển khoản ngân hàng", value: MPTransactionFundsType.BANK },
        { label: "Nạp tiền mặt tại quầy", value: MPTransactionFundsType.COUNTER }
    ];
    public static MP_TRANSACTION_TRANSACTION_CONTENT_TYPES = [
        // { label: "Nộp tiền mặt vào tài khoản", value: "OFFLINE" },
        // { label: "Hoàn tiền cho khách hàng", value: "WD_BANKTRANFER" },
        // { label: "Khuyến mãi sinh nhật KH", value: "COUPON_KH" },
        // { label: "Khuyến mãi sinh nhật công ty", value: "COUPON_COMPANY" },
        // { label: "Khác", value: "OTHER" }
        { label: "Nộp tiền mặt vào tài khoản", value: "Nộp tiền mặt vào tài khoản" },
        { label: "Hoàn tiền cho khách hàng", value: "Hoàn tiền cho khách hàng" },
        { label: "Khuyến mãi sinh nhật khách hàng", value: "Khuyến mãi sinh nhật khách hàng" },
        { label: "Khuyến mãi sinh nhật công ty", value: "Khuyến mãi sinh nhật công ty" },
        { label: "Khác", value: "Khác" }
    ];
    public static MP_TRANSACTION_STATUS_WALLET_TYPES = [
        { label: "Ngừng hoạt động", value: 0 },
        { label: "Hoạt động", value: 1 }
    ];
    public static MP_TRANSACTION_STATUS_BANK_TYPES = [
        { label: "Chưa xác thực", value: "0" },
        { label: "Đã xác thực", value: "1" }
    ];
    public static MP_TRANSACTION_AUTHOR_TYPES = [
        { value: MPTransactionAuthorType.ADMIN, label: 'Admin' },
        { value: MPTransactionAuthorType.ADMIN_MEEYLAND, label: 'Admin' },
        { value: MPTransactionAuthorType.USER, label: 'Khách hàng' },
        { value: MPTransactionAuthorType.SYSTEM, label: 'Hệ thống' }
    ];
    public static MP_TRANSACTION_WITHDRAWAL_TYPE = [
        { label: "Giao dịch của bạn bị từ chối vì sai thông tin số tài khoản nhận tiền / Đơn vị thụ hưởng không hợp lệ.", value: "406" },
        { label: "Giao dịch của bạn không thành công do lỗi hệ thống.", value: "407" },
        { label: "Giao dịch không thành công do ngân hàng phát hiện giao dịch bất thường.", value: "408" },
        { label: "Giao dịch không thành công do tài khoản ngân hàng của bạn đã hết hạn sử dụng.", value: "409" },
        { label: "Giao dịch không thành công do tài khoản ngân hàng của bạn đã bị khóa/không hoạt động", value: "410" },
        { label: "Lý do khác", value: "405" }
    ];
    public static ML_SCHEDULE_TYPES = [
        { value: MLScheduleType.Offline, label: 'Xem trực tiếp' },
        { value: MLScheduleType.Online, label: 'Xem live video' },
    ];
    public static ML_SCHEDULE_DATE_TYPES = [
        { value: MLScheduleDateType.All, label: 'Tất cả các ngày' },
        { value: MLScheduleDateType.Custom, label: 'Chọn ngày' },
    ];
    public static ML_SCHEDULE_STATUS_TYPES = [
        { value: MLScheduleStatusType.Cancel, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MLScheduleStatusType.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MLScheduleStatusType.Accept, label: 'Đã xác nhận', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MLScheduleStatusType.Complete, label: 'Hoàn thành', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MLScheduleStatusType.Request, label: 'Chờ xác nhận', color: 'kt-badge kt-badge--inline kt-badge--warning' },
    ];
    public static ML_ARTICLE_TYPES = [
        { value: MLArticleType.Crawl, label: 'Tin crawl' },
        { value: MLArticleType.Self, label: 'Tin tự xuất bản' },
    ];
    public static ML_ARTILCE_SYNC_TYPES = [
        { value: MLArtilceSyncType.No, label: 'Chưa đồng bộ' },
        { value: MLArtilceSyncType.Yes, label: 'Đã đồng bộ' },
    ];
    public static ML_ARTICLE_VIEW_TYPES = [
        { value: MLArticleViewType.NotYet, label: 'Chưa tác động' },
        { value: MLArticleViewType.Viewed, label: 'Đã xem' },
        { value: MLArticleViewType.Edited, label: 'Đã sửa' },
    ];
    public static ML_ARTILCE_MEDIATE_TYPES = [
        { value: MLArtilceMediateType.No, label: 'Miễn trung gian' },
        { value: MLArtilceMediateType.Yes, label: 'Đồng ý trung gian' },
    ];
    public static ML_ARTILCE_SCHEDULE_TYPES = [
        { value: MLArticlePostType.Repeat, label: 'Lặp lại vào các ngày trong tuần' },
        { value: MLArticlePostType.Custom, label: 'Theo từng ngày cụ thể' },
    ];
    public static ML_ARTICLE_ACCESS_TYPES = [
        { value: MLArticleAccessType.Draft, label: 'Tin nháp' },
        { value: MLArticleAccessType.Deleted, label: 'Tin đã xóa' },
        { value: MLArticleAccessType.UnPublish, label: 'Tin bị hạ' },
        { value: MLArticleAccessType.Publish, label: 'Tin đang đăng' },
        { value: MLArticleAccessType.Rejected, label: 'Tin chối duyệt' },
        { value: MLArticleAccessType.WaitPublish, label: 'Tin chờ đăng' },
        { value: MLArticleAccessType.WaitPayment, label: 'Tin chờ thanh toán' },
        { value: MLArticleAccessType.AdminUnPublish, label: 'Tin bị hạ bởi Admin' },
    ];
    public static ML_ARTICLE_STATUS_TYPES = [
        { value: MLArticleStatusType.Draft, label: 'Tin nháp' },
        { value: MLArticleStatusType.Down, label: 'Tin bị hạ' },
        { value: MLArticleStatusType.Deleted, label: 'Tin đã xóa' },
        { value: MLArticleStatusType.Expire, label: 'Tin hết hạn' },
        { value: MLArticleStatusType.Publish, label: 'Tin đang đăng' },
        { value: MLArticleStatusType.WaitPublish, label: 'Tin chờ đăng' },
        { value: MLArticleStatusType.WaitApprove, label: 'Tin chờ duyệt' },
        { value: MLArticleStatusType.Rejected, label: 'Tin từ chối đăng' },
        { value: MLArticleStatusType.WaitPayment, label: 'Tin chờ thanh toán' },
    ];
    public static ML_ARTICLE_REPORT_STATUS_TYPES = [
        { value: MLArticleReportStatusType.NotYet, label: 'Chưa xử lý' },
        { value: MLArticleReportStatusType.Processed, label: 'Đã xử lý' },
    ];
    public static ML_ARTICLE_APPROVE_CONTENT_TYPES = [
        { value: MLArticleApproveContentType.Waiting, label: 'Chờ duyệt' },
        { value: MLArticleApproveContentType.Approve, label: 'Đã Duyệt' },
        { value: MLArticleApproveContentType.Reject, label: 'Từ chối' },
    ];

    public static ML_ARTICLE_SOURCE_CRAWL = [
        { value: "0", label: 'Tất cả' },
        { value: "4", label: 'Facebook' }
    ];

    public static ML_USER_TYPES = [
        { value: MLUserType.UnKnow, label: 'Khách' },
        { value: MLUserType.Owner, label: 'Chính chủ' },
        { value: MLUserType.BrokerIndividual, label: 'Môi giới cá nhân' },
        { value: MLUserType.Brokers, label: 'Môi giới doanh nghiệp' },
        { value: MLUserType.Investor, label: 'Nhà đầu tư' },
        { value: MLUserType.Company, label: 'Chủ đầu tư' },
        { value: MLUserType.Exchanges, label: 'Sàn bất động sản' },
        { value: MLUserType.Bank, label: 'Ngân hàng' },
        { value: MLUserType.Advertiser, label: 'Quảng cáo' },
    ];
    public static ML_USER_WALLET_LINKED = [
        { value: MLUserWalletLinked.Yes, label: 'Đã liên kết' },
        { value: MLUserWalletLinked.No, label: 'Chưa liên kết' },
    ];
    public static ML_USER_INTERESTED_PRODUCT_TYPES = [
        { value: MLUSerInterestedProductType.MeeyLand, label: 'Meey Land' },
        { value: MLUSerInterestedProductType.MeeyMap, label: 'Meey Map' },
        { value: MLUSerInterestedProductType.MeeyCrm, label: 'Meey CRM' },
        { value: MLUSerInterestedProductType.MeeyProject, label: 'Meey Project' },
        { value: MLUSerInterestedProductType.MeeyId, label: 'Meey Id' },
        { value: MLUSerInterestedProductType.MeeyAdmin, label: 'Meey Admin' },
        { value: MLUSerInterestedProductType.NeeyAds, label: 'Meey Ads' },
        { value: MLUSerInterestedProductType.Meey3D, label: 'Meey 3D' },
        { value: MLUSerInterestedProductType.MeeyShare, label: 'Meey Share' },
        { value: MLUSerInterestedProductType.MeeyPage, label: 'Meey Page' },
    ];
    public static ML_USER_STATUS_TYPES = [
        { value: MLUserStatusType.Active, label: 'Hoạt động', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MLUserStatusType.DeActive, label: 'Chưa kích hoạt', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MLUserStatusType.Locked, label: 'Khóa', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MLUserStatusType.Deleted, label: 'Đã xóa', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static ML_USER_REASON_LOCK_TYPES = [
        { value: MLUserReasonLockType.BadContent, label: 'Đăng nội dung về bất động sản không đúng sự thật' },
        { value: MLUserReasonLockType.Duplicate, label: 'Đăng nhiều tin trùng, tin giống nhau' },
        { value: MLUserReasonLockType.Sex, label: 'Đăng tin có chứa từ ngữ (hình ảnh) dung tục, nhạy cảm không phù hợp với thuần phong mỹ tục' },
        { value: MLUserReasonLockType.Politic, label: 'Tin đăng có nội dung đề cập đến các chính trị gia, người nổi tiếng' },
        { value: MLUserReasonLockType.MultipleUser, label: 'Sử dụng nhiều tài khoản' },
        { value: MLUserReasonLockType.UserRequest, label: 'Khách hàng yêu cầu' },
    ];
    public static ML_EMPLOYEE_HISTORY_ACTION_TYPES = [
        { label: 'Từ chối', value: MLEmployeeHistoryActionType.Reject },
        { label: 'Mở khóa', value: MLEmployeeHistoryActionType.UnLock },
        { label: 'Xác nhận', value: MLEmployeeHistoryActionType.Confirm },
        { label: 'Hủy lời mời', value: MLEmployeeHistoryActionType.Cancel },
        { label: 'Thêm nhân viên', value: MLEmployeeHistoryActionType.Add },
        { label: 'Khóa tài khoản', value: MLEmployeeHistoryActionType.Lock },
        { label: 'Không xác định', value: MLEmployeeHistoryActionType.UnKnow },
        { label: 'Xóa khỏi tài khoản công ty', value: MLEmployeeHistoryActionType.Remove },
    ];
    public static ML_COUPON_HMC_STATUS_TYPES = [
        { label: 'Chưa sử dụng', value: MLCouponHMCStatusType.Pending, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đã sử dụng', value: MLCouponHMCStatusType.Used, color: 'kt-badge kt-badge--inline kt-badge--success' },
        { label: 'Đang xử lý', value: MLCouponHMCStatusType.Processing, color: 'kt-badge kt-badge--inline kt-badge--primary' },
    ];
    public static ML_COUPON_HMC_OBJECT_STATUS_TYPES = [
        { label: 'Người tặng', value: MLCouponHMCObjectStatusType.Owner, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Người sử dụng', value: MLCouponHMCObjectStatusType.Creator, color: 'kt-badge kt-badge--inline kt-badge--success' },
    ];
    public static MM_LOOKUP_HISTORY_STATUS_TYPES = [
        { label: 'Chưa chăm sóc', value: MMLookupHistoryStatusType.Init, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { label: 'Đã chăm sóc', value: MMLookupHistoryStatusType.Supported, color: 'kt-badge kt-badge--inline kt-badge--success' },
    ];
    public static MM_REQUEST_STATUS_TYPES = [
        { label: 'Chưa chăm sóc', value: MMRequestStatusType.Waiting, color: '' },
        { label: 'Đang chăm sóc', value: MMRequestStatusType.Process, color: 'color: #FFB800' },
        { label: 'Đã chăm sóc', value: MMRequestStatusType.Success, color: 'color: #00D623' },
    ];
    public static MM_REQUEST_ACTION_TYPES = [
        { label: 'Đăng ký', value: MMRequestActionType.Registration },
        { label: 'Mua ngay', value: MMRequestActionType.Buy },
        { label: 'Liên hệ ngay', value: MMRequestActionType.Contact },
    ];
    public static MM_REQUEST_TYPES = [
        { label: 'TK cá nhân', value: MMRequestType.Personal },
        { label: 'Không đăng nhập', value: MMRequestType.Anonymous },
    ];
    public static MO_PRICE_CONFIG_DISCOUNT_TYPES = [
        { label: 'Giảm giá theo %', value: PriceConfigDiscountType.Percent },
        { label: 'Giảm giá theo số tiền', value: PriceConfigDiscountType.Money },
    ];
    public static MO_UNIT_DURATION_TYPES = [
        { label: 'Phút', value: UnitDurationType.Minutes },
        { label: 'Ngày', value: UnitDurationType.Day },
        { label: 'Tháng', value: UnitDurationType.Month },
        { label: 'Năm', value: UnitDurationType.Year },
    ];
    public static MO_PRICE_CONFIG_STATUS_TYPES = [
        { value: PriceConfigStatusType.ACTIVE, label: 'Hiệu lực', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: PriceConfigStatusType.PENDING, label: 'Chờ áp dụng', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: PriceConfigStatusType.EXPIRES, label: 'Hết hạn', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: PriceConfigStatusType.CANCEL, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static MO_ORDER_STATUS_TYPES = [
        { value: MOOrderStatusType.PENDING, label: 'Chờ thanh toán', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MOOrderStatusType.PAID, label: 'Đã thanh toán', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MOOrderStatusType.USING, label: 'Đang sử dụng', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MOOrderStatusType.WAIT_CONFIRM, label: 'Chờ duyệt', color: 'kt-badge kt-badge--inline kt-badge--waiting' },
        { value: MOOrderStatusType.COMPLETED, label: 'Đã hoàn tất', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MOOrderStatusType.CANCEL, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static MO_ORDER_STATUS_PAYMENT_TYPES = [
        { value: MOOrderStatusPaymentType.NEW, label: 'Tạo mới', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MOOrderStatusPaymentType.WAITTOCONFIRM, label: 'Chờ xác nhận', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MOOrderStatusPaymentType.SUCCESS, label: 'Thành công', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MOOrderStatusPaymentType.INPROCESSING, label: 'Đang xử lý', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MOOrderStatusPaymentType.CANCELED, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--dark' },
        { value: MOOrderStatusPaymentType.FAIL, label: 'Thất bại', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MO_ORDER_ACTION_STATUS_TYPES = [
        { value: MOOderActionStatusType.CREATE, label: 'Tạo đơn hàng' },
        { value: MOOderActionStatusType.PAYMENT_DIRECT, label: 'Thanh toán' },
        { value: MOOderActionStatusType.PAYMENT_RETRY, label: 'Thanh toán lại' },
        { value: MOOderActionStatusType.CANCEL, label: 'Hủy đơn hàng' },
        { value: MOOderActionStatusType.APPROVE_ORDER, label: 'Duyệt đơn hàng' },
        { value: MOOderActionStatusType.REJECT, label: 'Từ chối đơn hàng' },
    ];
    public static MO_ORDER_PROCESSING_STATUS_TYPES = [
        { value: MOOderProcessingStatusType.AVAILABLE, label: 'Chưa sử dụng', color: 'kt-badge kt-badge--inline kt-badge--dark' },
        { value: MOOderProcessingStatusType.USING, label: 'Đang sử dụng', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MOOderProcessingStatusType.APPLYING, label: 'Đang sử dụng', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MOOderProcessingStatusType.USED, label: 'Đã sử dụng', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MOOderProcessingStatusType.EXPIRED, label: 'Đã hết hạn', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MO_ORDER_AUTHOR_STATUS_TYPES = [
        { value: MOOderAuthorStatusType.ADMIN, label: 'Admin' },
        { value: MOOderAuthorStatusType.USER, label: 'Khách hàng' },
        { value: MOOderAuthorStatusType.SYSTEM, label: 'SYSTEM' },
    ]
    public static MO_REQUEST_TRANSFER_TYPES = [
        { value: RequestTransferType.CHARGE, label: 'Doanh nghiệp chuyển' },
        { value: RequestTransferType.REFUND, label: 'Doanh nghiệp thu hồi' },
    ];
    public static MO_TRANSFER_STATUS_TYPES = [
        { value: TransferStatusType.AVAILABLE, label: 'chưa sử dụng' },
        { value: TransferStatusType.USING, label: 'đang sử dụng' },
        { value: TransferStatusType.USED, label: 'đã sử dụng' },
        { value: TransferStatusType.EXPIRED, label: 'hết hạn' },
        { value: TransferStatusType.APPLYING, label: 'đang áp dụng' },
        { value: TransferStatusType.FREEZE, label: 'đóng băng' },
    ];
    public static ML_ARTICLE_REASON_TYPES = [
        { value: MLArticleReasonType.BadContent, label: 'Tin đăng có chứa các từ ngữ dung tục, nhạy cảm' },
        { value: MLArticleReasonType.BadImage, label: 'Hình ảnh trong tin đăng dung tục, nhạy cảm' },
        { value: MLArticleReasonType.ImageContainLogo, label: 'Hình ảnh trong tin đăng có chưa logo/tên miền website khác' },
        { value: MLArticleReasonType.Duplicate, label: 'Tin đăng trùng lặp, giống nhau (ảnh hưởng đến chất lượng tin)' },
        { value: MLArticleReasonType.ImageContainPhone, label: 'Hình ảnh trong tin đăng chèn chữ, số điện thoại' },
        { value: MLArticleReasonType.InvalidContent, label: 'Tin đăng không liên quan đến việc mua bán, cho thuê, sang nhượng bất động sản' },
        { value: MLArticleReasonType.InvalidCategory, label: 'Tin đăng không đúng phân mục, phân loại và địa chỉ BĐS mua bán/ cho thuê/ sang nhượng' },
        { value: MLArticleReasonType.Other, label: 'Lý do khác' },
    ];
    public static ML_ARTICLE_REASON_REPORT_TYPES = [
        { value: MLArticleReasonReportType.BadAddress, label: 'Địa chỉ của BĐS chưa đúng' },
        { value: MLArticleReasonReportType.BadContent, label: 'Các thông tin về đặc điểm, giá, diện tích, mô tả, ảnh, video... chưa chính xác' },
        { value: MLArticleReasonReportType.BadValuation, label: 'Định giá chưa đúng với thực tế' },
        { value: MLArticleReasonReportType.UnConnected, label: 'Không liên lạc được với người đăng tin' },
        { value: MLArticleReasonReportType.Transacted, label: 'Bất động sản đã bán/ đã thuê/ đã sang nhượng' },
        { value: MLArticleReasonReportType.Duplicate, label: 'Trùng với tin rao khác' },
        { value: MLArticleReasonReportType.Other, label: 'Lý do khác' },
    ];
    public static ML_ARTICLE_REJECT_OPTION_TYPES = [
        { value: MLArticleRejectOptionType.UnPublish, label: 'Hạ tin' },
        { value: MLArticleRejectOptionType.KeepPublish, label: 'Không hạ tin' },
    ];

    public static ML_CUSTOMER_TYPES = [
        { value: MCRMCustomerType.BrokerIndividual, label: 'Môi giới cá nhân' },
        { value: MCRMCustomerType.Brokers, label: 'Môi giới doanh nghiệp' },
        { value: MCRMCustomerType.Owner, label: 'Chính chủ' },
        { value: MCRMCustomerType.Investor, label: 'Nhà đầu tư' },
        { value: MCRMCustomerType.Company, label: 'Chủ đầu tư' },
        { value: MCRMCustomerType.Exchanges, label: 'Sàn bất động sản' },
        { value: MCRMCustomerType.Bank, label: 'Ngân hàng' },
        { value: MCRMCustomerType.Advertiser, label: 'Nhà quảng cáo' },
        { value: MCRMCustomerType.UnKnow, label: 'Khách vãng lai' },
    ];
    public static MCRM_SALE_TYPES = [
        { value: MCRMIFameSaleType.Sale, label: 'Nhân viên kinh doanh' },
        { value: MCRMIFameSaleType.SalePatner, label: 'Cộng tác viên' },
    ];
    public static ML_CUSTOMER_STATUS_TYPES = [
        { value: MCRMCustomerStatusType.NotSale, label: 'Chưa gán sale', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MCRMCustomerStatusType.NotApproach, label: 'Chưa tiếp cận', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MCRMCustomerStatusType.Consider, label: 'Xem xét', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MCRMCustomerStatusType.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MCRMCustomerStatusType.Success, label: 'Thành công', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MCRMCustomerStatusType.Deleted, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static ML_CUSTOMER_DISTRIBUTION_TYPES = [
        { value: MCRMDistributionType.Individual, label: 'Cá nhân' },
        { value: MCRMDistributionType.Businesses, label: 'Doanh nghiệp' },
    ];
    public static ML_CUSTOMER_REQUEST_STATUS_TYPES = [
        { value: MCRMCustomerRequestStatusType.Init, label: 'Chờ xác nhận', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MCRMCustomerRequestStatusType.Accept, label: 'Đã xác nhận', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MCRMCustomerRequestStatusType.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MCRMCustomerRequestStatusType.Split, label: 'Đã tách', color: 'kt-badge kt-badge--inline kt-badge--dark' },
    ];
    public static ML_CUSTOMER_STATUS_LITLE_TYPES = [
        { value: MCRMCustomerStatusType.NotApproach, label: 'Chưa tiếp cận', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MCRMCustomerStatusType.Consider, label: 'Xem xét', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MCRMCustomerStatusType.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static ML_CUSTOMER_LEAD_STATUS_TYPES = [
        { value: MCRMCustomerLeadStatusType.BeingExploited, label: 'Đang khai thác', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MCRMCustomerLeadStatusType.CreatedMeeId, label: 'Đã tạo MeeyId', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MCRMCustomerLeadStatusType.Cancel, label: 'Đã hủy', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static ML_CUSTOMER_LEAD_STATUS_LITE_TYPES = [
        { value: MCRMCustomerLeadStatusType.Cancel, label: 'Hủy', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static ML_CUSTOMER_POTETIAL_TYPES = [
        { value: MCRMCustomerPotentialType.Potential1, label: 'Mức độ tiềm năng 1' },
        { value: MCRMCustomerPotentialType.Potential2, label: 'Mức độ tiềm năng 2' },
        { value: MCRMCustomerPotentialType.Potential3, label: 'Mức độ tiềm năng 3' },
        { value: MCRMCustomerPotentialType.Potential4, label: 'Mức độ tiềm năng 4' },
    ];
    public static ML_CUSTOMER_EXPIRE_TYPES = [
        { value: MCRMCustomerExpireType.Expire, label: 'KH Quá hạn chăm sóc' },
    ];
    public static ML_CUSTOMER_STORE_TYPES = [
        { value: CustomerStoreType.CenterStore, label: 'Kho trung tâm' },
        { value: CustomerStoreType.CompanyStore, label: 'Kho công ty' },
        { value: CustomerStoreType.IndividualsStore, label: 'Kho cá nhân' },
        { value: CustomerStoreType.Affiliate, label: 'Kho Affiliate' },
    ];
    public static ML_CUSTOMER_ACTIVITY_TYPES = [
        { value: MCRMCustomerActivityType.Individuals, label: 'Cá nhân' },
        { value: MCRMCustomerActivityType.Business, label: 'Doanh nghiệp' },
    ];
    public static MCRM_SALE_ASSIGN_CONFIG_HISTORY_TYPES = [
        { value: MCRMSaleAssignConfigHistoryTypes.Create, label: 'Thêm mới' },
        { value: MCRMSaleAssignConfigHistoryTypes.Update, label: 'Chỉnh sửa' },
    ];
    public static ML_CUSTOMER_NOTE_CALL_TYPES = [
        { value: MCRMCustomerNoteCallType.In, label: 'Cuộc gọi đến' },
        { value: MCRMCustomerNoteCallType.Out, label: 'Cuộc gọi đi' },
    ];
    public static ML_CUSTOMER_NOTE_CALL_STATUS_TYPES = [
        { value: MCRMCustomerNoteCallStatusType.NotAnswer, label: 'KH không nghe máy' },
        { value: MCRMCustomerNoteCallStatusType.Busy, label: 'KH đang bận không tiện nói chuyện, gọi lại sau' },
        { value: MCRMCustomerNoteCallStatusType.Interested, label: 'KH quan tâm dịch vụ' },
        { value: MCRMCustomerNoteCallStatusType.NotNeed, label: 'KH thiện chí nhưng chưa có nhu cầu' },
        { value: MCRMCustomerNoteCallStatusType.Difficult, label: 'KH khó tiếp cận' },
        { value: MCRMCustomerNoteCallStatusType.Supported, label: 'KH đã có nhân viên khác hỗ trợ' },
    ];
    public static ML_CUSTOMER_NOTE_EMAIL_STATUS_TYPES = [
        { value: MCRMCustomerNoteEmailStatusType.Draft, label: 'Thư nháp' },
        { value: MCRMCustomerNoteEmailStatusType.Sent, label: 'Đã gửi' },
        { value: MCRMCustomerNoteEmailStatusType.Opened, label: 'Đã mở' },
    ];
    public static ML_CUSTOMER_ACTION_TYPES = [
        { value: MCRMCustomerActionType.Create, label: 'Nhập khách hàng vảo CRM' },
        { value: MCRMCustomerActionType.Update, label: 'Sửa khách hàng' },
        { value: MCRMCustomerActionType.UpdateStatus, label: 'Thay đổi trạng thái' },
        { value: MCRMCustomerActionType.Group, label: 'Gộp khách hàng' },
        { value: MCRMCustomerActionType.AssignSale, label: 'Phân sale' },
        { value: MCRMCustomerActionType.AssignSupport, label: 'Phân CSKH' },
        { value: MCRMCustomerActionType.SaleReceive, label: 'Tự nhận sale' },
        { value: MCRMCustomerActionType.SupportReceive, label: 'Tự nhận CSKH' },
        { value: MCRMCustomerActionType.AddContact, label: 'Thêm liên hệ' },
        { value: MCRMCustomerActionType.EditContact, label: 'Sửa liên hệ' },
        { value: MCRMCustomerActionType.DeleteContact, label: 'Xóa liên hệ' },
        { value: MCRMCustomerActionType.DeleteGroupCustomer, label: 'Huỷ do gộp KH' },
        { value: MCRMCustomerActionType.TransferSale, label: 'Chuyển sale' },
        { value: MCRMCustomerActionType.UpdateStore, label: 'Xử lý chuyển kho' },
        { value: MCRMCustomerActionType.AutoAssign, label: 'Tự động gán sale' },
        { value: MCRMCustomerActionType.AssignAffiliate, label: 'Điều chuyển khách hàng sang kho Affiliate' },
        { value: MCRMCustomerActionType.AffiliateToSale, label: 'Điều chuyển khách hàng sang kho khách hàng' },
    ];
    public static ML_CUSTOMER_LEAD_ACTION_TYPES = [
        { value: MCRMCustomerActionType.Create, label: 'Tạo khách hàng LeadId' },
        { value: MCRMCustomerActionType.Update, label: 'Sửa khách hàng' },
        { value: MCRMCustomerActionType.UpdateStatus, label: 'Thay đổi trạng thái' },
        { value: MCRMCustomerActionType.AutoAssign, label: 'Tự động gán sale' },
        { value: MCRMCustomerActionType.CreateMeeyId, label: 'Tạo khách hàng MeeyId' },
    ];
    public static ML_CUSTOMER_CALLLOGS_TYPES = [
        { value: MCRMCallLogType.Unknow, label: 'Chưa xác định' },
        { value: MCRMCallLogType.Inbound, label: 'Cuộc gọi đến' },
        { value: MCRMCallLogType.Outbound, label: 'Cuộc gọi đi' },
    ];
    public static ML_CUSTOMER_CALLLOGS_STATUS_TYPES = [
        { value: MCRMCallLogStatusType.Unknow, label: 'Chưa xác định' },
        { value: MCRMCallLogStatusType.Busy, label: 'Máy bận/Không nhấc máy' },
        { value: MCRMCallLogStatusType.Answered, label: 'Đã nhấc máy' },
        { value: MCRMCallLogStatusType.Answering, label: 'Đang thông thoại' },
    ];
    public static ML_CUSTOMER_CALL_MANAGEMENT_TYPES = [
        { value: MCRMCallManagementStatusType.SUCCESSFUL, label: 'Thành công' },
        { value: MCRMCallManagementStatusType.UNSUCCESSFUL, label: 'Không thành công' },
        { value: MCRMCallManagementStatusType.MISSED, label: 'Cuộc gọi nhỡ' },
        { value: MCRMCallManagementStatusType.BUSY, label: 'Máy bận/Không nhấc máy' }
    ];
    public static ML_CUSTOMER_TRANSFER_TYPES = [
        { value: CustomerTransferType.TransferSale, label: 'Điều chuyển khách hàng giữa các sale' },
        { value: CustomerTransferType.TransferAffiliate, label: 'Điều chuyển sang khách hàng Affiliate' },
    ];
    public static MAF_PAYMENT_TYPES = [
        { value: PaymentType.Main, label: 'TK Chính Meey Pay' },
        { value: PaymentType.Promotion1, label: 'TKKM1 Meey Pay' },
        { value: PaymentType.Promotion2, label: 'TKKM2 Meey Pay' },
    ];
    public static MAF_PAYMENT_CYCLE_TYPES = [
        { value: PaymentCycleType.Dayly, label: 'Hàng ngày' },
        { value: PaymentCycleType.Weekly, label: 'Hàng tuần' },
        { value: PaymentCycleType.Monthly, label: 'Mùng 15 hàng tháng (tự động)' },
        { value: PaymentCycleType.Quarterly, label: 'Quarterly' },
        { value: PaymentCycleType.Yearly, label: 'Yearly' },
    ];
    public static MAF_OBJECT_TYPES = [
        { value: MAFContractType.Individual, label: 'Khách hàng cá nhân' },
        { value: MAFContractType.Businesses, label: 'Khách hàng doanh nghiệp' },
    ];
    public static MAF_STATUS_COMMISSION_TYPES = [
        { value: MAFStatusCommissionType.Draft, label: 'Tạm tính', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MAFStatusCommissionType.Paid, label: 'Đã thanh toán', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFStatusCommissionType.Fail, label: 'Thanh toán lỗi', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MAFStatusCommissionType.Pending, label: 'Đang thanh toán', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MAFStatusCommissionType.Collected, label: 'Đã tổng hợp', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MAFStatusCommissionType.Approved, label: 'Đã duyệt', color: 'kt-badge kt-badge--inline kt-badge--primary' },
    ];
    public static MAF_STATUS_PAYMENT_TYPES = [
        { value: MAFStatusPaymentType.Paid, label: 'Đã thanh toán', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFStatusPaymentType.NotYet, label: 'Chưa thanh toán', color: 'kt-badge kt-badge--inline kt-badge--warning' },
    ];
    public static MAF_ACTION_TYPES = [
        { value: MAFActionType.Import, label: 'Nhập từ hệ thống cũ' },
        { value: MAFActionType.Register, label: 'Đăng ký tài khoản' },
        { value: MAFActionType.Introduce, label: 'Vào cây người  giới  thiệu' },
        { value: MAFActionType.MoveTree, label: 'Chuyển cây' },
        { value: MAFActionType.UpLevel, label: 'Thăng cấp bậc' },
        { value: MAFActionType.DownLevel, label: 'Hạ cấp bậc' },
        { value: MAFActionType.MoveBranch, label: 'Chuyển nhánh' },
        { value: MAFActionType.UpdateRank, label: 'Thay đổi Trung tâm' },
        { value: MAFActionType.AddContract, label: 'Thêm hợp đồng' },
        { value: MAFActionType.SignContract, label: 'Ký online' },
        { value: MAFActionType.UpdateContract, label: 'Sửa hợp đồng' },
        { value: MAFActionType.RejectContract, label: 'Từ chối hợp đồng' },
        { value: MAFActionType.ApproveContract, label: 'Duyệt hợp đồng' },
        { value: MAFActionType.ApproveRankCumulative, label: 'Duyệt cấp bậc' },
    ];
    public static MAF_RANK_TYPES = [
        { value: MAFRankType.RANK1, label: 'RANK1', color: 'kt-badge kt-badge--inline kt-badge--info' },
        { value: MAFRankType.RANK2, label: 'RANK2', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFRankType.RANK3, label: 'RANK3', color: 'kt-badge kt-badge--inline kt-badge--waiting' },
    ];

    public static MAF_REQUEST_STATUS_TYPES = [
        { value: MAFRequestStatusType.Init, label: 'Chờ duyệt', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MAFRequestStatusType.Accept, label: 'Đã duyệt', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFRequestStatusType.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MC_COUPON_USE_TYPES = [
        { value: MCCouponUseType.NotLimit, label: 'Không giới hạn' },
        { value: MCCouponUseType.Limit, label: 'Chọn số lượng' },
    ];
    public static MC_COUPON_EXPIRE_DATE_TYPES = [
        { value: MCCouponExpireDateType.DayNumber, label: 'Nhập ngày hiệu lực kể từ ngày nhận' },
        { value: MCCouponExpireDateType.DayCalendar, label: 'Chọn ngày hết hạn' },
    ];

    public static MC_COUPON_STATUS_TYPES = [
        { value: MCCouponStatusType.Created, label: 'Chưa bắt đầu', confirm: 'chưa bắt đầu', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MCCouponStatusType.Running, label: 'Đang chạy', confirm: 'chạy tiếp', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MCCouponStatusType.Pause, label: 'Tạm dừng', confirm: 'tạm dừng', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MCCouponStatusType.OutOfMove, label: 'Hết lượt', confirm: 'hết lượt', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MCCouponStatusType.Expired, label: 'Hết hạn', confirm: 'hết hạn', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MCCouponStatusType.LockUp, label: 'Khóa', confirm: 'khóa', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];
    public static MC_COUPON_UPDATE_STATUS_TYPES = [
        { value: MCCouponUpdateStatusType.Lock, label: 'Khóa', confirm: 'khóa' },
        { value: MCCouponUpdateStatusType.Unlock, label: 'Mở khóa', confirm: 'mở khóa' },
        { value: MCCouponUpdateStatusType.Pause, label: 'Tạm dừng', confirm: 'tạm dừng' },
        { value: MCCouponUpdateStatusType.Unpause, label: 'Tiếp tục chạy', confirm: 'tiếp tục chạy' },
    ];

    public static MB_BANNER_STATUS_TYPES = [
        { value: MBStatusType.Pending, label: 'Chờ phê duyệt', confirm: 'chờ phê duyệt', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MBStatusType.Approve, label: 'Đã duyệt', confirm: 'phê duyệt', color: 'kt-badge kt-badge--inline kt-badge--primary' },
        { value: MBStatusType.Reject, label: 'Từ chối', confirm: 'từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MBStatusType.Running, label: 'Đang chạy', confirm: 'chạy', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MBStatusType.Stop, label: 'Dừng chạy', confirm: 'dừng chạy', color: 'kt-badge kt-badge--inline kt-badge--danger' },
        { value: MBStatusType.Pause, label: 'Tạm dừng', confirm: 'tạm dừng', color: 'kt-badge kt-badge--inline kt-badge--warning' },
    ];
    public static MB_BANNER_BANNER_TYPES = [
        { value: MBBannerType.BannerAds, label: 'Banner Quảng Cáo' },
        { value: MBBannerType.BannerHome, label: 'Banner Home' },
        { value: MBBannerType.BannerSystem, label: 'Banner Hệ Sinh Thái ' },
    ];
    public static MB_BANNER_SOURCE_TYPES = [
        { value: MBSourceType.Customer, label: 'Khách hàng' },
        { value: MBSourceType.Staff, label: 'Nội bộ' },
    ];

    public static MB_BANNER_PRODUCT_TYPES = [
        { value: MBProductType.MeeyLand, label: 'Meey Land' },
        { value: MBProductType.MeeyMap, label: 'Meey Map' },
        { value: MBProductType.MeeyCRM, label: 'Meey CRM' },
        { value: MBProductType.MeeyAds, label: 'Meey Ads' },
        { value: MBProductType.MeeyProject, label: 'Meey Project' },
        { value: MBProductType.Meey3D, label: 'Meey 3D' },
        { value: MBProductType.MeeyNew, label: 'Meey New' },
        { value: MBProductType.MeeyValue, label: 'Meey Value' },
        { value: MBProductType.MeeyGroup, label: 'Meey Group' },
        { value: MBProductType.MeeyRedt, label: 'Meey Redt' },
    ];

    public static MB_BANNER_PLATFORM_TYPES = [
        { value: MBPlatformType.App, label: 'App' },
        { value: MBPlatformType.Web, label: 'Website' },
        { value: MBPlatformType.WebMobile, label: 'Web Mobile' },
    ];

    public static MS_TAG_TYPES = [
        { value: MSTagType.AutoTag, label: 'Auto tag' },
        { value: MSTagType.ManualTag, label: 'Manual tag' },
        { value: MSTagType.SearchTag, label: 'Search tag' },
    ];

    public static MS_TAG_DEMAND_TYPES = [
        { value: MSDemandType.Sale, label: 'Cần bán' },
        { value: MSDemandType.Lease, label: 'Cho thuê' },
        { value: MSDemandType.Transfer, label: 'Sang nhượng' },
    ];

    public static MS_TAG_ACTION_TYPES = [
        { value: MSActionType.Add, label: 'Thêm mới' },
        { value: MSActionType.Edit, label: 'Sửa' },
        { value: MSActionType.Delete, label: 'Xóa' },
    ];

    public static MS_TAG_PRIORITY_TYPES = [
        { value: MSPrioritizedType.Prioritized, label: 'Tag ưu tiên' },
        { value: MSPrioritizedType.NoPrioritized, label: 'Tag không ưu tiên' },
    ];

    public static MS_TAG_STATUS_TYPES = [
        { value: MSStatusType.Inserting, label: 'Đang chèn tags', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MSStatusType.Complete, label: 'Hoàn thành chèn tags', color: 'kt-badge kt-badge--inline kt-badge--primary' },
    ];

    public static MS_TAG_FURNITURE_TYPES = [
        { value: MSFurnitureType.Have, label: 'Có' },
        { value: MSFurnitureType.No, label: 'Không' },
    ];

    public static MS_STRUCTURE_TYPES = [
        { label: 'Nhu cầu', value: StructureType.Need },
        { label: 'Loại nhà đất', value: StructureType.TypeOfHouse },
        { label: 'Loại hình BĐS', value: StructureType.TypeOfRealEstate },
        { label: 'Dự án', value: StructureType.Project },
        { label: 'Đường/phố', value: StructureType.Street },
        { label: 'Phường/xã', value: StructureType.Ward },
        { label: 'Quận/huyện', value: StructureType.District },
        { label: 'Tỉnh/thành phố', value: StructureType.City },
        { label: 'Giá', value: StructureType.Price },
        { label: 'Diện tích', value: StructureType.Area },
        { label: 'Số tầng', value: StructureType.Floor },
        { label: 'Số phòng ngủ', value: StructureType.Bedroom },
        { label: 'Hướng nhà/đất', value: StructureType.Direction },
        { label: 'Mặt tiền', value: StructureType.Facade },
        { label: 'Ưu điểm BĐS', value: StructureType.Feature },
        { label: 'Đường rộng', value: StructureType.WideRoad },
        { label: 'Giấy tờ pháp lý', value: StructureType.LegalPaper },
        { label: 'Nội thất, thiết bị', value: StructureType.HavingFE },
        { label: 'Tiện ích', value: StructureType.Utility },
    ];

    public static MS_META_SEO_TYPES = [
        { value: MSMetaSeoType.NotFound, label: '404' },
        { value: MSMetaSeoType.Post, label: 'Đăng tin' },
        { value: MSMetaSeoType.Listing, label: 'Listing' },
        { value: MSMetaSeoType.Category, label: 'Danh mục' },
    ];
    public static MS_META_SEO_TYPES_V1 = [
        { value: MSMetaSeoType.NotFound, label: '404' },
        { value: MSMetaSeoType.Post, label: 'Đăng tin' },
        { value: MSMetaSeoType.Category, label: 'Danh mục' },
    ];
    public static MS_META_SEO_TYPES_V2 = [
        { value: MSMetaSeoType.Listing, label: 'Listing' },
    ];
    public static MS_META_SEO_CATEGORY_TYPES = [
        { value: MSMetaSeoCategoryType.Sale, label: 'Mua bán', Type: MSMetaSeoType.Listing },
        { value: MSMetaSeoCategoryType.Lease, label: 'Cho thuê', Type: MSMetaSeoType.Listing },
        { value: MSMetaSeoCategoryType.Transfer, label: 'Sang nhượng', Type: MSMetaSeoType.Listing },
    ];
    public static MS_META_SEO_CATEGORY_TYPES_V2 = [
        { value: MSMetaSeoCategoryTypeV2.Sale, label: 'Cần bán', Type: MSMetaSeoType.Listing },
        { value: MSMetaSeoCategoryTypeV2.Lease, label: 'Cho thuê', Type: MSMetaSeoType.Listing },
        { value: MSMetaSeoCategoryTypeV2.Transfer, label: 'Sang nhượng', Type: MSMetaSeoType.Listing },
    ];
    public static MS_URL_TYPES = [
        { value: MSUrlType.Tags, label: 'URL tags' },
        { value: MSUrlType.Filter, label: 'URL filters' },
    ];

    public static MAF_CONTRACT_TYPES = [
        { value: MAFContractType.Individual, label: 'Cá nhân' },
        { value: MAFContractType.Businesses, label: 'Doanh nghiệp' },
    ];
    public static MAF_CONTRACT_CONMMISSION_STATUS_TYPES = [
        { value: MAFContractCommissionStatus.Pending, label: 'Chưa được duyệt' },
        { value: MAFContractCommissionStatus.CommissionPending, label: 'Có hoa hồng chưa hoàn thiện' },
        { value: MAFContractCommissionStatus.Approve, label: 'Đã duyệt' },
        { value: MAFContractCommissionStatus.NotInformation, label: 'Chưa có thông tin' },
    ];
    public static MAF_FILTER_CONTRACT_STATUS_TYPES = [
        { value: MAFFilterContractStatus.NotYet, label: 'Chưa hoàn thiện' },
        { value: MAFFilterContractStatus.NotYetHasCommission, label: 'Có hoa hồng chưa hoàn thiện' },
    ];
    public static MAF_FILTER_CXHANNEL_TYPES = [
        { value: MAFFilterChannelType.Link, label: 'Link liên kết' },
        { value: MAFFilterChannelType.Code, label: 'Nhập mã giới thiệu' },
        { value: MAFFilterChannelType.QR, label: 'Scan QR' },
        { value: MAFFilterChannelType.Admin, label: 'Admin' },
        { value: MAFFilterChannelType.IFrame, label: 'IFrame' },
    ];
    public static MAF_CONTRACT_SIGN_STATUS_TYPES = [
        { value: MAFContractSignStatus.Unsigned, label: 'Chưa ký' },
        { value: MAFContractSignStatus.Signed, label: 'Đã ký' },
    ];
    public static MAF_CONTRACT_STATUS_TYPES = [
        // { value: MAFContractStatus.Draft, label: 'Nháp', color: 'kt-badge kt-badge--inline kt-badge--dark' },
        { value: MAFContractStatus.Pending, label: 'Chờ duyệt', color: 'kt-badge kt-badge--inline kt-badge--warning' },
        { value: MAFContractStatus.Approve, label: 'Đã duyệt', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFContractStatus.Reject, label: 'Từ chối', color: 'kt-badge kt-badge--inline kt-badge--danger' },
    ];

    public static MAF_SYNTHETIC_CONTRACT_STATUS_TYPES = [
        { value: MAFSyntheticContractStatus.BusinessesNotYet, label: 'Doanh nghiệp chưa có hợp đồng', color: 'kt-badge kt-badge--inline kt-badge--dark' },
        { value: MAFSyntheticContractStatus.BusinessesHasContract, label: 'Doanh nghiệp đã có hợp đồng', color: 'kt-badge kt-badge--inline kt-badge--success' },
        { value: MAFSyntheticContractStatus.IndividualUnsigned, label: 'Cá nhân chưa ký online', color: 'kt-badge kt-badge--inline kt-badge--dark' },
        { value: MAFSyntheticContractStatus.IndividualSigned, label: 'Cá nhân đã ký online', color: 'kt-badge kt-badge--inline kt-badge--success' },
    ];

    public static MAF_TRANSACTION_COMMISSION_TYPES = [
        { value: TransactionCommissionType.Direct, label: 'DS F1' },
        { value: TransactionCommissionType.Manage, label: 'DS cấp bậc' },
    ];

    public static MAF_INVOICE_STATUS_TYPES = [
        { value: MAFInvoiceStatus.NotYet, label: 'Chưa có' },
        { value: MAFInvoiceStatus.Exists, label: 'Đã có' },
    ];

    public static MPO_AVATAR_TYPES = [
        { value: MPOAvatarType.FromVideo, label: 'Ảnh capture từ video', selected: true },
        { value: MPOAvatarType.Upload, label: 'Chọn ảnh từ máy tính' },
    ];

    public static MPO_CENSORSHIP_CONFIRM_TYPES = [
        { value: 0, confirm: 'muốn duyệt', color: 'text-success' },
        { value: 2, confirm: 'không duyệt', color: 'text-danger' },
    ];

    public static UNIT_TYPE_ACTIVE = [
        { value: true, label: 'Đang kích hoạt' },
        { value: false, label: 'Không kích hoạt' },
    ];

    public static M3D_TOUR_CATEGORY_TYPE = [
        { value: '643f4dec682af3c1bae490b5', label: 'Du lịch' },
        { value: '643f4dd5682af3c1bae490b2', label: 'Dự án' },
        { value: '643f4dfd682af3c1bae490b8', label: 'Nhà ở' },
        { value: '643f4e07682af3c1bae490be', label: 'Quy hoạch' },
        { value: '643f4e01682af3c1bae490bb', label: 'Triển lãm' },
    ];
    public static M3D_TOUR_STATUS_TYPE = [
        { value: M3DTourStatusType.Public, label: 'Công khai', color: 'text-success' },
        //{ value: M3DTourStatusType.Censoring, label: 'Kiểm duyệt', color: 'text-info' },
        { value: M3DTourStatusType.Private, label: 'Riêng tư', color: "text-primary" },
        { value: M3DTourStatusType.Error, label: 'Lỗi', color: 'text-danger' },
    ];
    public static M3D_CENSORSHIP_TYPE = [
        { value: M3DCensorshipType.Not_Censor, label: 'Chưa kiểm duyệt' },
        { value: M3DCensorshipType.Rejected, label: 'Từ chối' },
        { value: M3DCensorshipType.Censored, label: 'Đã kiểm duyệt' },
    ]
    public static M3D_TOUR_TYPE = [
        { value: M3DTourType.Created, label: 'Tour tự tạo' },
        { value: M3DTourType.Crawl, label: 'Tour crawl' }
    ];
    public static M3D_CUSTOMER_STATUS_TYPE = [
        { value: M3DContactFromStatus.New_Customer, label: 'Khách hàng mới', color: 'red' },
        { value: M3DContactFromStatus.Not_Contact, label: 'Chưa liên hệ được',color: 'gray' },
        { value: M3DContactFromStatus.Call_Back, label: 'Hẹn gọi lại',color: '#ffb84d' },
        { value: M3DContactFromStatus.Care, label: 'Quan tâm' ,color: '#4da6ff'},
        { value: M3DContactFromStatus.Full_Information, label: 'Nhận đủ thông tin',color: '#e68a00' },
        { value: M3DContactFromStatus.Trust, label: 'Tin tưởng' ,color: '#0073e6'},
        { value: M3DContactFromStatus.Purchase, label: 'Mua hàng' ,color: 'green'},
        { value: M3DContactFromStatus.Block, label: 'Chặn',color: 'black' },
    ]
    public static M3D_GROUND_TOUR_TYPE = [
        { value: M3DGroundTourType.Have, label: 'Có' },
        { value: M3DGroundTourType.No, label: 'Không' }
    ];
    public static MRV_USER_TYPE = [
        { value: MRVUserType.MeeyId, label: 'Tài khoản MeeyId' },
        { value: MRVUserType.Secret, label: 'Tài khoản ẩn danh' },
        { value: MRVUserType.Seeding, label: 'Tài khoản seeding' },

    ]
    public static MRV_REPORT_VIOLATE_STATUS_TYPE = [
        { value: MRVReportViolateStatusType.All, label: 'Tất cả' },
        { value: MRVReportViolateStatusType.Pending, label: 'Chưa xử lý' },
        { value: MRVReportViolateStatusType.Reject, label: 'Báo cáo sai' },
        { value: MRVReportViolateStatusType.Success, label: 'Đã xoá ND vi phạm' },
        
    ]
    public static MRV_USER_STATUS_TYPE = [
        { value: MRVUserStatusType.Active, label: 'Đang hoạt động', color: 'text-success' },
        { value: MRVUserStatusType.Pending, label: 'Không hoạt động', color: 'text-danger' }
    ]
    public static MRV_USER_GENDER_TYPE = [
        { value: MRVUserGenderType.Male, label: 'Nam' },
        { value: MRVUserGenderType.Female, label: 'Nữ' },
        { value: MRVUserGenderType.Unknow, label: 'Khác' }

    ]

    public static MRV_PROJECT_STATUS_TYPE = [
        { value: MRVProjectStatusType.Active, label: 'Công khai', color: 'text-success' },
        { value: MRVProjectStatusType.Pending, label: 'Không công khai', color: 'text-danger' }
    ]

    public static MRV_PROJECT_VOTESCORE_TYPE = [
        { value: MRVProjectVoteScoreType.Zero, label: 'Chưa có sao' },
        { value: MRVProjectVoteScoreType.One, label: 'Từ 1 sao trở lên' },
        { value: MRVProjectVoteScoreType.Two, label: 'Từ 2 sao trở lên' },
        { value: MRVProjectVoteScoreType.Three, label: 'Từ 3 sao trở lên' },
        { value: MRVProjectVoteScoreType.Four, label: 'Từ 4 sao trở lên' },
        { value: MRVProjectVoteScoreType.Five, label: 'Từ 5 sao trở lên' },
    ]

    public static MA_PHONE_VERIFY_TYPE = [
        { value: MLUserVerifyPhone.Active, label: 'Đã xác thực' },
        { value: MLUserVerifyPhone.DeActive, label: 'Chưa xác thực' },
    ]

    public static LABELS: Dictionary<string> = new Dictionary<string>([
        { key: 'Code', value: 'Mã' },
        { key: 'Name', value: 'Tên' },
        { key: 'Male', value: 'Nam' },
        { key: 'Day', value: 'Ngày' },
        { key: 'Year', value: 'Năm' },
        { key: 'Female', value: 'Nữ' },
        { key: 'Type', value: 'Loại' },
        { key: 'Team', value: 'Nhóm' },
        { key: 'Port', value: 'Cổng' },
        { key: 'Role', value: 'Quyền' },
        { key: 'Group', value: 'Nhóm' },
        { key: 'Round', value: 'Lượt' },
        { key: 'Month', value: 'Tháng' },
        { key: 'Equals', value: 'Bằng' },
        { key: 'TeamId', value: 'Nhóm' },
        { key: 'Package', value: 'Gói' },
        { key: 'MapDay', value: 'Ngày' },
        { key: 'Year1', value: '1 năm' },
        { key: 'RoleId', value: 'Quyền' },
        { key: 'TeamIds', value: 'Nhóm' },
        { key: 'Reason', value: 'Lý do' },
        { key: 'RoleIds', value: 'Quyền' },
        { key: 'Title', value: 'Tiêu đề' },
        { key: 'Notes', value: 'Ghi chú' },
        { key: 'Contains', value: 'Chứa' },
        { key: 'Day30', value: '30 ngày' },
        { key: 'Day60', value: '60 ngày' },
        { key: 'Day90', value: '90 ngày' },
        { key: 'Month6', value: '6 tháng' },
        { key: 'User', value: 'Tài khoản' },
        { key: 'City', value: 'Thành phố' },
        { key: 'Ward', value: 'Phường/Xã' },
        { key: 'NotEquals', value: 'Khác' },
        { key: 'Locked', value: 'Bị khóa' },
        { key: 'Deleted', value: 'Đã xóa' },
        { key: 'Search', value: 'Tìm kiếm' },
        { key: 'Amount', value: 'Số lượng' },
        { key: 'Leader', value: 'Lãnh đạo' },
        { key: 'EmailFrom', value: 'Email' },
        { key: 'Address', value: 'Địa chỉ' },
        { key: 'Company', value: 'Công ty' },
        { key: 'Position', value: 'Vị trí' },
        { key: 'MapDistrict', value: 'Quận' },
        { key: 'Question', value: 'Câu hỏi' },
        { key: 'Active', value: 'Hoạt động' },
        { key: 'CityId', value: 'Thành phố' },
        { key: 'Content', value: 'Nội dung' },
        { key: 'Country', value: 'Quốc gia' },
        { key: 'Object', value: 'Đối tượng' },
        { key: 'Gender', value: 'Giới tính' },
        { key: 'EndWith', value: 'Kết thúc' },
        { key: 'LessThan', value: 'Nhỏ hơn' },
        { key: 'PriceRoot', value: 'Giá gốc' },
        { key: 'Status', value: 'Trạng thái' },
        { key: 'Account', value: 'Tài khoản' },
        { key: 'Password', value: 'Mật khẩu' },
        { key: 'Incognito', value: 'Ẩn danh' },
        { key: 'LeaderEmail', value: 'Email' },
        { key: 'StartWith', value: 'Bắt đầu' },
        { key: 'Birthday', value: 'Ngày sinh' },
        { key: 'FullName', value: 'Họ và tên' },
        { key: 'CountryId', value: 'Quốc gia' },
        { key: 'DateTime', value: 'Thời gian' },
        { key: 'CreatorEmail', value: 'Email' },
        { key: 'PositionId', value: 'Chức vụ' },
        { key: 'Category', value: 'Chuyên mục' },
        { key: 'PositionIds', value: 'Chức vụ' },
        { key: 'District', value: 'Quận/Huyện' },
        { key: 'Browser', value: 'Trình duyệt' },
        { key: 'Phone', value: 'Số điện thoại' },
        { key: 'PageSize', value: 'Kích thước' },
        { key: 'RefId', value: 'Id tham chiếu' },
        { key: 'Avatar', value: 'Ảnh đại diện' },
        { key: 'GreaterThan', value: 'Lớn hơn' },
        { key: 'Description', value: 'Miêu tả' },
        { key: 'Promotion', value: 'Khuyến mãi' },
        { key: 'Organization', value: 'Website' },
        { key: 'Permission', value: 'Chức năng' },
        { key: 'Landscape', value: 'Xoay ngang' },
        { key: 'Types', value: 'Danh sách loại' },
        { key: 'Between', value: 'Trong khoảng' },
        { key: 'Department', value: 'Phòng ban' },
        { key: 'Unknow', value: 'Không xác định' },
        { key: 'DistrictId', value: 'Quận/Huyện' },
        { key: 'UsedDate', value: 'Ngày sử dụng' },
        { key: 'ReasonLock', value: 'Lý do khóa' },
        { key: 'UserName', value: 'Tên đăng nhập' },
        { key: 'Username', value: 'Tên đăng nhập' },
        { key: 'NotContains', value: 'Không chứa' },
        { key: 'StartDate', value: 'Ngày bắt đầu' },
        { key: 'ApproveDate', value: 'Ngày duyệt' },
        { key: 'ShortName', value: 'Tên viết tắt' },
        { key: 'DepartmentId', value: 'Phòng ban' },
        { key: 'DistrictIds', value: 'Quận/Huyện' },
        { key: 'Payment', value: 'Tiền thanh toán' },
        { key: 'DeActive', value: 'Chưa kích hoạt' },
        { key: 'NotBetween', value: 'Ngoài khoảng' },
        { key: 'DepartmentIds', value: 'Phòng ban' },
        { key: 'RejectDate', value: 'Ngày từ chối' },
        { key: 'OldPassword', value: 'Mật khẩu cũ' },
        { key: 'SystemName', value: 'Tên hệ thống' },
        { key: 'LockedStatus', value: 'Trạng thái' },
        { key: 'Unlimited', value: 'Không giới hạn' },
        { key: 'TicketCategory', value: 'Chuyên mục' },
        { key: 'NotEndWith', value: 'Không kết thúc' },
        { key: 'LeaderPhone', value: 'Số điện thoại' },
        { key: 'DialingCode', value: 'Mã điện thoại' },
        { key: 'EnglishName', value: 'Tên tiếng Anh' },
        { key: 'CreatorPhone', value: 'Số điện thoại' },
        { key: 'CreatorName', value: 'Tên khách hàng' },
        { key: 'NotStartWith', value: 'Không bắt đầu' },
        { key: 'NoPromotion', value: 'Không Khuyến mãi' },
        { key: 'ConfirmPassword', value: 'Nhập lại mật khẩu' },
        { key: 'LessThanOrEqual', value: 'Nhỏ hơn hoặc bằng' },
        { key: 'CustomUseTime', value: 'Nhập thời gian cụ thể' },
        { key: 'GreaterThanOrEqual', value: 'Lớn hơn hoặc bằng' },
    ]);
}
