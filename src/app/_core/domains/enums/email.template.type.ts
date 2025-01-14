export enum EmailTemplateType {
    MARegister = 1,
    MAUserResetPassword,
    MAAdminResetPassword,
    MLRegister = 50,
    MLResetPassword,
    MLLock,
    MLUnlock,
    MLVerifyEmail,
    MLVerifyOtp,
    MLCompany03 = 100,
    MLCompany04,
    MLCompany05,
    MLCompany06,
    MLCompany07,
    MLCompany08,
    MLCompany09,
    MLCompany10,
    MLCompany11,
    MLCompany12,
    MLCompany13,
    MLCompany14,
    MLCompany15,
    MLCompany16,
    MLCompany17,
    MLCompany18,
    MLCompanySendOtp = 200,
    MLAppointment05 = 205,
    MLAppointment06,
    MLAppointment07,
    MLAppointment08,
    MLAppointment09,
    MLAppointment10,
    MLAppointment11,
    MLAppointment12,
    MLAppointment13,
    MLAppointment14,
    MLAppointment15,
    MAF01 = 250,
    MAF02,
    MAF03,
    MAF04,
    MAF05,
    MAF06,
    MAF07,
    MAF08,
    MAF09,
    MAF10,
    MAF11,
    MAF12,
    MLArticle1 = 300,
    MLArticle2,
    MLArticle3,
    MLArticle4,
    MLArticle5,
    MLArticle6,
    MCTransferMoney = 400,
    MPPaymentOldSystem = 450,
    MMap1 = 500,
    MMap2,
    MMap3,    
}
export function EmailTemplateTypeAware(constructor: Function) {
    constructor.prototype.EmailTemplateType = EmailTemplateType;
}