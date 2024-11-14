import { AppInjector } from '../../../app.module';
import { MPOProjectService } from '../project.service';
import { FileData } from '../../../_core/domains/data/file.data';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { MPOProjectInfoComponent } from './project.info/project.info.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MPOProjectImageComponent } from './project.image/project.image.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MPOProjectFilesComponent } from './project.files/project.files.component';
import { MPOProjectLocationComponent } from './project.location/project.location.component';
import { MPOProjectUtilitiesComponent } from './project.utilities/project.utilities.component';
import { MPOProjectJuridicalComponent } from './project.juridical/project.juridical.component';
import { MPOProjectSalePolicyComponent } from './project.sale.policy/project.sale.policy.component';
import { VideoProjectDetailComponent } from '../project.video/detail/video.project.detail.component';
import MPOProjectVideosGridComponent from '../project.video/project.video.grid.component';
import { MPOProjectUploadVideoComponent } from './project.upload.video/project.upload.video.component';
import { MPOJuridicalType } from '../../../_core/domains/entities/meeyproject/enums/mpo.juridical.type';
import { MPOProjectPaymentProgressComponent } from './project.payment.progress/project.payment.progress.component';
import { MPOProjectInvestorRelatedComponent } from './project.investor.related/project.investor.related.component';
import { MPOProjectConstructionComponent } from './project.construction.progress/project.construction.progress.component';
import { MPOProjectConstructionProgressEntity, MPOProjectEntity, MPOProjectInvestorRelatedEntity, MPOProjectJuridicalDetailEntity, MPOProjectJuridicalEntity, MPOProjectLocationEntity, MPOProjectPaymentProgressEntity, MPOProjectSalePolicyEntity, MPOProjectUtilitiesEntity } from '../../../_core/domains/entities/meeyproject/mpo.project.entity';

@Component({
  templateUrl: './add.project.component.html',
  styleUrls: ['./add.project.component.scss']
})
export class MPOAddProjectComponent extends EditComponent implements OnInit {
  @ViewChild('projectInfo') projectInfo: MPOProjectInfoComponent;
  @ViewChild('projectImage') projectImage: MPOProjectImageComponent;
  @ViewChild('projectFiles') projectFiles: MPOProjectFilesComponent;
  @ViewChild('projectLocation') projectLocation: MPOProjectLocationComponent;
  @ViewChild('projectUtilities') projectUtilities: MPOProjectUtilitiesComponent;
  @ViewChild('projectJuridical') projectJuridical: MPOProjectJuridicalComponent;
  @ViewChild('projectVideoAdmin') projectVideoAdmin: MPOProjectVideosGridComponent;
  @ViewChild('projectSalePolicy') projectSalePolicy: MPOProjectSalePolicyComponent;
  @ViewChild('projectConstruction') projectConstruction: MPOProjectConstructionComponent;
  @ViewChild('projectInvestorRelated') projectInvestorRelated: MPOProjectInvestorRelatedComponent;
  @ViewChild('projectPaymentProgress') projectPaymentProgress: MPOProjectPaymentProgressComponent;

  @Input() params: any;
  actions: ActionData[] = [];

  id: string;
  validTabs = [];
  viewer: boolean;
  prevData: string;
  isAddNew: boolean;
  tab: string = 'info';
  productName: string = '';
  loading: boolean = false;
  videoTab: string = 'admin';
  isProduct: boolean = false;
  loadingInfo: boolean = false;
  utilitiesTab: string = 'basic';
  locationTab: string = 'trafficLine';

  dialog: AdminDialogService;
  service: MPOProjectService;

  item: MPOProjectEntity = new MPOProjectEntity();

  constructor() {
    super();
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    this.id = this.getParam('id');
    //this.tab = this.getParam('tab');
    if (this.params && this.params['tab'])
      this.tab = this.params && this.params['tab'];
    this.locationTab = this.getParam('locationTab');
    this.utilitiesTab = this.getParam('utilitiesTab');
    this.viewer = this.getParam('viewer');
    this.isAddNew = this.getParam('isAddNew');
    this.isProduct = this.getParam('isProduct');
    this.productName = this.getParam('productName');
    if (this.isProduct) {
      this.breadcrumbs = [];
      this.breadcrumbs.push({
        Name: this.productName
      });
      this.breadcrumbs.push({
        Name: 'Danh sách dự án',
        Link: '/admin/mpoproject/land'
      });
    }
    this.breadcrumbs.push({
      Name: 'Xem/Cập nhật thông tin'
    });
    await this.loadItem();

    let confirmUploadVideo = this.getParam('confirmUploadVideo');
    if (confirmUploadVideo) this.popupUpload();
    this.renderActions();
  }

  selectedTab(tab: string) {
    this.tab = tab;
  }

  selectedVideosTab(tab: string) {
    this.videoTab = tab;
  }

  async loadItem() {
    if (this.id) {
      this.loading = true;
      await this.service.getProject(this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          const item = result.Object;
          this.item = EntityHelper.createEntity(MPOProjectEntity, item);
          this.item.Images = this.renderImages(this.item?.Images);
          this.item.Logo = this.renderImage(this.item?.Logo);
          this.item.Banner = this.renderImage(this.item?.Banner);

          // create location
          this.item.LocationTab = EntityHelper.createEntity(MPOProjectLocationEntity, {
            LocationDescription: item.LocationTab?.locationDescription,
            TrafficLineDescription: item.LocationTab?.trafficLineDescription,
            Images: this.renderImages(item.LocationTab?.images),
          });

          // create utilities
          this.item.UtilitiesTab = EntityHelper.createEntity(MPOProjectUtilitiesEntity, {
            BasicUtilities: item.UtilitiesTab?.basicUtilities?.join(';'),
            BasicDescription: item.UtilitiesTab?.basicDescription,
            BasicImages: this.renderImages(item.UtilitiesTab?.basicImages),
            OutstandingUtilities: item.UtilitiesTab?.outstandingUtilities?.join(';'),
            OutstandingDescription: item.UtilitiesTab?.outstandingDescription,
            OutstandingImages: this.renderImages(item.UtilitiesTab?.outstandingImages),
          });

          // create juridical
          let juridicalDetail: MPOProjectJuridicalDetailEntity[] = [];
          let juridicalFile = [];
          let juridicalImage = [];
          if (item.Juridical) {
            Object.keys(MPOJuridicalType).forEach(key => {
              if (item.Juridical[key].length > 0) {
                const details = item.Juridical[key].filter(c => c.file || c.doc).map((c: any) => {
                  if (c.file) c.file.Code = UtilityExHelper.randomText(10);
                  else if (c.doc) c.doc.Code = UtilityExHelper.randomText(10);
                  return c;
                });
                juridicalDetail = juridicalDetail.concat(
                  details.map((c: any) => {
                    return {
                      Type: key,
                      Description: c.description,
                      Url: (c.file || c.doc)?.url,
                      Code: (c.file || c.doc)?.Code,
                      Name: (c.file || c.doc)?.title,
                      TypeFile: c.docType.toLowerCase(),
                    }
                  })
                );
                juridicalFile = juridicalFile.concat(this.renderFiles(details.filter(c => c.docType === 'File').map(c => { return (c.file || c.doc) })));
                juridicalImage = juridicalImage.concat(this.renderFiles(details.filter(c => c.docType === 'Image').map(c => { return (c.file || c.doc) })));
              }
            })

          }
          this.item.Juridical = EntityHelper.createEntity(MPOProjectJuridicalEntity, {
            Description: item.Juridical?.description,
            Details: juridicalDetail,
            Files: juridicalFile,
            ImageFiles: juridicalImage,
          });

          // create sale policy
          this.item.SalePolicy = EntityHelper.createEntity(MPOProjectSalePolicyEntity, {
            Description: item.SalePolicy?.description,
            Files: this.renderFiles(item.SalePolicy?.files),
            Images: this.renderImages(item.SalePolicy?.images),
          });

          // create construction progress
          this.item.ConstructionProgress = EntityHelper.createEntity(MPOProjectConstructionProgressEntity, {
            Description: item.ConstructionProgress?.description,
            Images: this.renderImages(item.ConstructionProgress?.images),
          });

          // create payment progress
          this.item.PaymentProgress = EntityHelper.createEntity(MPOProjectPaymentProgressEntity, {
            PaymentProgress: item.PaymentProgress?.progress,
            Description: item.PaymentProgress?.description,
            Images: this.renderImages(item.PaymentProgress?.images),
          });

          //create Investor Related
          this.item.InvestorRelated = EntityHelper.createEntity(MPOProjectInvestorRelatedEntity, {
            ProjectMeeyId: item.ProjectMeeyId,
            Id: item.InvestorRelated?.investor?._id,
            InvestorId: item.InvestorRelated?.investor?._id,
            Name: item.InvestorRelated?.investor?.name,
            Description: item.InvestorRelated?.investor?.description,
            Logo: this.renderImage(item.InvestorRelated?.investor?.logo),
            AffiliateUnit: item.InvestorRelated?.affiliateUnit.filter(c => c && c.unit && c.unit?.relatedUnitType).map(c => {
              return {
                Name: c.unit?._id,
                Unit: c.unit?.relatedUnitType?._id,
                Logo: c.unit?.logo ? this.renderImage(c.unit.logo) : null,
                Description: c.description || c.unit?.relatedUnitType?.description,
              }
            }),
          });

          //Create data meey land
          if (this.isProduct) {
            this.item.IsPublished = item.DataMeeyland?.isPublished ? true : false;
            this.item.Description = item.DataMeeyland?.description ? item.DataMeeyland.description : null;
            this.item.Juridical.Description = item.DataMeeyland?.juridical ? item.DataMeeyland.juridical : null;
            this.item.SalePolicy.Description = item.DataMeeyland?.salePolicy ? item.DataMeeyland.salePolicy : null;
            this.item.UtilitiesTab.BasicDescription = item.DataMeeyland?.utilities ? item.DataMeeyland.utilities : null;
            this.item.LocationTab.TrafficLineDescription = item.DataMeeyland?.location ? item.DataMeeyland.location : null;
            this.item.PaymentProgress.PaymentProgress = item.DataMeeyland?.payProgress ? item.DataMeeyland.payProgress : null;
            this.item.ConstructionProgress.Description = item.DataMeeyland?.constructionProgress ? item.DataMeeyland.constructionProgress : null;
          }
          setTimeout(() => this.prevData = JSON.stringify(this.item), 2000);
        } else {
          this.dialog.Alert('Thông báo', 'Dự án không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
        }
      });
      this.loading = false;
    }
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => this.isProduct ? this.backNotSave() : this.back())
    ];
    if (this.viewer) {
      actions.push({
        name: 'Sửa',
        icon: 'la la-edit',
        processButton: true,
        systemName: ActionType.Edit,
        className: 'btn btn-primary',
        click: () => this.edit(this.item)
      });
    } else {
      if (!this.isProduct) {
        actions.push({
          name: 'Lưu',
          icon: 'la la-save',
          processButton: true,
          className: 'btn btn-primary',
          systemName: this.isAddNew ? ActionType.AddNew : ActionType.Edit,
          click: async () => await this.confirm()
        });
      } else {
        actions.push({
          icon: 'la la-copy',
          name: 'Lấy thông tin từ Meey Project',
          className: 'btn btn-primary',
          systemName: ActionType.Empty,
          hidden: () => {
            return (this.tab == 'image' || this.tab == 'files' || this.tab == 'videos' || this.tab == 'investorRelated');
          },
          click: () => {
            this.getDataMeeyProject();
          }
        });
        actions.push({
          name: 'Lưu',
          icon: 'la la-save',
          processButton: true,
          className: 'btn btn-primary',
          systemName: ActionType.Edit,
          click: async () => await this.confirmInfo()
        });
      }
    }
    this.actions = await this.authen.actionsAllow(MPOProjectEntity, actions);
  }

  private renderFiles(files: any[]): FileData[] {
    let itemFiles: FileData[] = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        itemFiles.push({
          Code: file.Code,
          Path: file.url,
          Name: file.title,
          ResultUpload: {
            _id: file._id,
            uri: file.uri,
            url: file.url,
            name: file.name,
            size: file.size,
            s3Key: file.s3Key,
            width: file.width,
            height: file.height,
            mimeType: file.mimeType,
          }
        });
      }
    }
    return itemFiles;
  }

  private renderImages(images: any[]): FileData[] {
    let itemImages: FileData[] = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        itemImages.push(this.renderImage(image));
      }
    }
    return itemImages;
  }

  private renderImage(image: any): FileData {
    let itemImage: FileData = new FileData();
    if (image) {
      itemImage = {
        Path: image.url,
        Name: image.title,
        ResultUpload: {
          _id: image._id,
          uri: image.uri,
          url: image.url,
          name: image.name,
          size: image.size,
          s3Key: image.s3Key,
          width: image.width,
          height: image.height,
          mimeType: image.mimeType,
        }
      }
    }
    return itemImage;
  }

  back(confirm = false) {
    if (this.isAddNew && !confirm) {
      this.dialogService.Confirm("Bạn có đồng ý đóng màn hình thêm mới dự án ? Nếu đồng ý, các dữ liệu đã nhập sẽ không được lưu!", () => this.back(true), null, 'Cảnh báo');
    } else {
      if (this.isProduct) {
        this.router.navigate(['/admin/mpoproject/land']);
      } else {
        if (this.state) {
          if (!this.viewer && !this.isAddNew) this.view(this.item);
          else
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        }
        else
          window.history.back();
      }
    }
  }

  backNotSave() {
    let jsonData = JSON.stringify(this.item);
    if (!this.prevData || this.prevData == jsonData) {
      this.back();
      return;
    }
    this.dialogService.Confirm('Các thông tin bạn nhập sẽ không được giữ lại, bạn có chắc muốn quay lại không?', () => {
      if (this.state)
        this.router.navigate(['/admin/mpoproject/land']);
      else
        window.history.back();
    }, null, 'Quay lại')
  }

  private view(item: MPOProjectEntity) {
    let obj: NavigationStateData = {
      viewer: true,
      id: item.ProjectMeeyId,
      prevUrl: '/admin/mpoproject',
      prevData: this.state.prevData,
      object: {
        tab: this.tab,
        isProduct: this.isProduct,
        locationTab: this.locationTab,
        productName: this.productName,
        utilitiesTab: this.utilitiesTab,
      }
    };
    this.router.navigate(['/admin/mpoproject/view'], { state: { params: JSON.stringify(obj) } });
  }

  private edit(item: MPOProjectEntity, confirmUploadVideo = false) {
    let obj: NavigationStateData = {
      id: item.ProjectMeeyId,
      prevUrl: '/admin/mpoproject',
      prevData: this.state.prevData,
      object: {
        tab: this.tab,
        isProduct: this.isProduct,
        productName: this.productName,
        locationTab: this.locationTab,
        utilitiesTab: this.utilitiesTab,
        confirmUploadVideo: confirmUploadVideo,
      }
    };
    this.router.navigate(['/admin/mpoproject/edit'], { state: { params: JSON.stringify(obj) } });
  }

  async confirm(confirmUploadVideo = false) {
    this.processing = true;
    this.validTabs = [];
    let valid = await this.validate();

    if (valid) {
      let project = {
        lat: this.item.Lat,
        lng: this.item.Lng,
        name: this.item.Name,
        city: this.item.CityId,
        ward: this.item.WardId,
        street: this.item.StreetId,
        district: this.item.DistrictId,
        address: this.item.Address,
        investor: this.item.InvestorId,
        status: this.item.ProjectStatusId,
        projectTypes: this.item.ProjectTypeIds,
        isPublished: this.item.IsPublished,
        tradeName: this.item.TradeName,
        totalArea: this.item.TotalArea,
        buildingDensity: this.item.BuildingDensity,
        ownership: this.item.Ownership,
        totalFloor: this.item.TotalFloor,
        totalBuilding: this.item.TotalBuilding,
        totalApartment: this.item.TotalApartment,
        progress: this.item.Progress,
        startTime: this.item.StartTime,
        completionTime: this.item.CompletionTime,
        logo: null,
        banner: null,
        description: this.item.DescriptionText,
        descriptionFormat: this.item.Description,
        images: null,
        lowestPriceByM2: this.item.PriceM2Min == "" ? null : this.item.PriceM2Min,
        highestPriceByM2: this.item.PriceM2Max == "" ? null : this.item.PriceM2Max,
        lowestPriceByProduct: this.item.PriceMin == "" ? null : this.item.PriceMin, 
        highestPriceByProduct: this.item.PriceMax == "" ? null : this.item.PriceMax,
        locationTab: null,
        utilities: null,
        juridical: null,
        salePolicy: null,
        investorRelated: null,
        constructionProgress: null,
        payProgress: null,
      }

      if (this.item.Logo) {
        project.logo = this.item.Logo.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
          .map(c => {
            return c._id
              ? { _id: c._id }
              : { s3Key: c.s3Key }
          })[0];
      }
      if (this.item.Banner) {
        project.banner = this.item.Banner.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
          .map(c => {
            return c._id
              ? { _id: c._id }
              : { s3Key: c.s3Key }
          })[0];
      }

      if (this.item.Images) {
        project.images = this.item.Images.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
          .map(c => {
            return c._id
              ? { _id: c._id }
              : { s3Key: c.s3Key }
          });
      }

      if (this.item.LocationTab) {
        project.locationTab = {
          trafficLineDescription: this.item.LocationTab.TrafficLineDescription,
          images: null
        }
        if (this.item.LocationTab.Images) {
          project.locationTab.images = this.item.LocationTab.Images.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
      }
      if (this.item.UtilitiesTab) {
        project.utilities = {
          basicUtilities: this.item.UtilitiesTab?.BasicUtilities ? this.item.UtilitiesTab.BasicUtilities?.split(';') : [],
          basicDescription: this.item.UtilitiesTab.BasicDescription,
          basicImages: null,
        }

        if (this.item.UtilitiesTab.BasicImages) {
          project.utilities.basicImages = this.item.UtilitiesTab.BasicImages.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
      }
      if (this.item.Juridical) {
        project.juridical = {
          businessLicense: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'businessLicense').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          handoverDecision: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'handoverDecision').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          ownershipCertificate: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'ownershipCertificate').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          approve1_500: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'approve1_500').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          constructionPermit: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'constructionPermit').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          responsibleForCollectingFoundation: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'responsibleForCollectingFoundation').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          bankGuarantee: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'bankGuarantee').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          otherDocs: this.item.Juridical?.Details ? this.item.Juridical.Details.filter(c => c.Type == 'otherDocs').map(c => { return { description: c.Description, doc: c.UrlS3Key, docType: c.TypeFile } }) : [],
          description: this.item.Juridical.Description,
        }
      }
      if (this.item.SalePolicy) {
        project.salePolicy = {
          description: this.item.SalePolicy.Description,
          images: null,
          files: null,
        }
        if (this.item.SalePolicy.Images) {
          project.salePolicy.images = this.item.SalePolicy.Images.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
        if (this.item.SalePolicy.Files) {
          project.salePolicy.files = this.item.SalePolicy.Files.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.files && Array.isArray(c.ResultUpload.files) ? c.ResultUpload.files[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
      }
      if (this.item.InvestorRelated) {
        project.investorRelated = {
          investor: this.item.InvestorRelated.InvestorId || null,
          description: this.item.InvestorRelated.Description,
          logo: this.item.InvestorRelated.Logo,
          affiliateUnit: this.item.InvestorRelated.AffiliateUnit.filter(c => c && c.Name && c.RelatedType).map(c => {
            return {
              unit: c.Name,
              relatedType: c.RelatedType,
              description: c.Description,
            }
          })
        }
      }
      if (this.item.ConstructionProgress) {
        project.constructionProgress = {
          description: this.item.ConstructionProgress.Description,
          images: null,
        }

        if (this.item.ConstructionProgress.Images) {
          project.constructionProgress.images = this.item.ConstructionProgress.Images.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
      }
      if (this.item.PaymentProgress) {
        project.payProgress = {
          progress: this.item.PaymentProgress.PaymentProgress,
          images: null,
        }
        if (this.item.PaymentProgress.Images) {
          project.payProgress.images = this.item.PaymentProgress.Images.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return c._id
                ? { _id: c._id }
                : { s3Key: c.s3Key }
            });
        }
      }

      let saveProject = false;
      if (this.item.ProjectMeeyId) {
        await this.service.updateInformation(project, this.item.ProjectMeeyId).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Cập nhật dự án thành công');
            if (result.Object) {
              saveProject = true;
            }
          } else {
            ToastrHelper.ErrorResult(result);
          }
        });
        if (saveProject) {
          await this.projectImage.confirm();
          await this.projectFiles.confirm();
          this.view(this.item);
        }
      } else {
        await this.service.addNew(project).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo dự án thành công');
            if (result.Object) {
              saveProject = true;
              this.item.ProjectMeeyId = result.Object._id;
            }
          } else {
            ToastrHelper.ErrorResult(result);
          }
        });
        if (saveProject) {
          this.projectImage.item.ProjectMeeyId = this.item.ProjectMeeyId;
          this.projectFiles.item.ProjectMeeyId = this.item.ProjectMeeyId;
          await this.projectImage.confirm();
          await this.projectFiles.confirm();
          this.isAddNew = false;
          if (confirmUploadVideo) this.edit(this.item, confirmUploadVideo)
          else this.view(this.item);
        }
      }

    } else {
      if (this.item.Id && this.item.IsPublished) {
        this.tab = this.validTabs[0];
        this.dialogService.Alert('Cảnh báo', 'Vui lòng kiểm tra các thông tin bắt buộc tại các tab thông tin có đánh dấu <i class="fa fa-exclamation-circle" style="color: #fd397a"></i>')
      }
    }
    this.processing = false;
  }

  async confirmInfo() {
    this.processing = true;
    let valid = true;
    if (!await this.projectInfo.valid()) {
      this.validTabs.push('info');
      valid = false;
    }
    if (!await this.projectLocation.valid()) {
      this.validTabs.push('location');
      valid = false;
    }
    if (!await this.projectUtilities.valid()) {
      this.validTabs.push('utilities');
      valid = false;
    }
    if (!await this.projectJuridical.valid()) {
      this.validTabs.push('juridical');
      valid = false;
    }
    if (!await this.projectSalePolicy.valid()) {
      this.validTabs.push('salePolicy');
      valid = false;
    }
    if (!await this.projectInvestorRelated.valid()) {
      this.validTabs.push('investorRelated');
      valid = false;
    }
    if (!await this.projectConstruction.valid()) {
      this.validTabs.push('construction');
      valid = false;
    }
    if (!await this.projectPaymentProgress.valid()) {
      this.validTabs.push('paymentProgress');
      valid = false;
    }
    if (valid) {
      // call api
      let data = {
        "updatedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin',
        },
        "isPublished": this.item.IsPublished,
        "description": this.item.Description,
        "descriptionFormat": this.item.DescriptionText,
        "location": this.item.LocationTab.TrafficLineDescription,
        "juridical": this.item.Juridical.Description,
        "salePolicy": this.item.SalePolicy.Description,
        "constructionProgress": this.item.ConstructionProgress.Description,
        "payProgress": this.item.PaymentProgress.PaymentProgress,
        "utilities": this.item.UtilitiesTab.BasicDescription,
      };
      if (this.productName == 'Meey Land') {
        data['project'] = 'dataMeeyland';
      }
      return await this.service.callApi('MPOProject', 'UpdateInformationProduct/' + this.item.ProjectMeeyId, data, MethodType.Put).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Cập nhật thành công');
          this.prevData = JSON.stringify(this.item);
          this.processing = false;
          this.view(this.item);
          return true;
        }
        ToastrHelper.ErrorResult(result);
        this.processing = false;
        return false;
      }, (e: any) => {
        ToastrHelper.Exception(e);
        this.processing = false;
        return false;
      });
    };
    this.processing = false;
  }

  popupUpload() {
    if (this.item.ProjectMeeyId) {
      this.dialogService.WapperAsync({
        cancelText: 'Đóng',
        confirmText: 'Tải lên và tiếp tục',
        resultText: 'Tải lên',
        size: ModalSizeType.Large,
        title: 'Tải lên Video dự án',
        className: 'modal-body-project',
        object: MPOProjectUploadVideoComponent,
        objectExtra: {
          ProjectId: this.item.ProjectMeeyId
        }
      }, async (item: any) => {
        this.projectVideoAdmin.loadItems();
        setTimeout(() => {
          this.popupUpload();
        }, 300);
      }, null, async (item: any) => {
        this.projectVideoAdmin.loadItems();
      });
    } else {
      this.dialogService.ConfirmAsync("Bạn phải tạo dự án trước khi tải video lên. Bạn có muốn tạo dự án ?", async () => this.confirm(true))
    }
  }

  private async getDataMeeyProject() {
    if (this.id) {
      this.loadingInfo = true;
      let isData = false;
      switch (this.tab) {
        case 'info': {
          if (this.item?.Description) isData = true;
        } break;
        case 'location': {
          if (this.item.LocationTab.TrafficLineDescription) isData = true;
        } break;
        case 'utilities': {
          if (this.item.UtilitiesTab.BasicDescription) isData = true;
        } break;
        case 'juridical': {
          if (this.item.Juridical.Description) isData = true;
        } break;
        case 'salePolicy': {
          if (this.item.SalePolicy.Description) isData = true;
        } break;
        case 'construction': {
          if (this.item.ConstructionProgress.Description) isData = true;
        } break;
        case 'paymentProgress': {
          if (this.item.PaymentProgress.PaymentProgress) isData = true;
        } break;
      }
      if (isData) ToastrHelper.Error('Chỉ được phép copy từ Meey Project khi chưa điền dữ liệu.');
      else {
        await this.service.getProject(this.id).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            const item = result.Object;
            switch (this.tab) {
              case 'info': {
                this.item.Description = item?.Description;
              } break;
              case 'location': {
                this.item.LocationTab.TrafficLineDescription = item.LocationTab?.trafficLineDescription;
              } break;
              case 'utilities': {
                this.item.UtilitiesTab.BasicDescription = item.UtilitiesTab?.basicDescription;
              } break;
              case 'juridical': {
                this.item.Juridical.Description = item.Juridical?.description;
              } break;
              case 'salePolicy': {
                this.item.SalePolicy.Description = item.SalePolicy?.description;
              } break;
              case 'construction': {
                this.item.ConstructionProgress.Description = item.ConstructionProgress?.description;
              } break;
              case 'paymentProgress': {
                this.item.PaymentProgress.PaymentProgress = item.PaymentProgress?.progress;
              } break;
            }
            ToastrHelper.Success('Copy thông tin từ Meey Project thành công.');
          } else {
            this.dialog.Alert('Thông báo', 'Dự án không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
          }
        });
      }
      this.loadingInfo = false;
    }
  }
  private getDocType(value: string) {
    if (value?.endsWith('.png') || value?.endsWith('.jpg'))
      return 'Image';
    return 'File';
  }
  private async validate() {
    let valid = true;
    if (!await this.projectInfo.valid()) {
      this.validTabs.push('info');
      valid = false;
    }
    if (valid) {
      let exists = await this.service.checkExistsAbs(this.item.Name, this.item.TradeName, this.item.CityId, this.item.DistrictId, this.item.WardId, this.item.ProjectMeeyId).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          return <boolean>result.Object;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
      if (exists) {
        ToastrHelper.Error('Dự án đã tồn tại trên hệ thống, vui lòng kiểm tra lại dữ liệu');
        this.validTabs.push('info');
        this.processing = false;
        return false;
      }
    }
    if (!await this.projectLocation.valid()) {
      this.validTabs.push('location');
      valid = false;
    }
    if (!await this.projectUtilities.valid()) {
      this.validTabs.push('utilities');
      valid = false;
    }
    if (!await this.projectJuridical.valid()) {
      this.validTabs.push('juridical');
      valid = false;
    }
    if (!await this.projectSalePolicy.valid()) {
      this.validTabs.push('salePolicy');
      valid = false;
    }
    if (!await this.projectInvestorRelated.valid()) {
      this.validTabs.push('investorRelated');
      valid = false;
    }
    if (!await this.projectConstruction.valid()) {
      this.validTabs.push('construction');
      valid = false;
    }
    if (!await this.projectPaymentProgress.valid()) {
      this.validTabs.push('paymentProgress');
      valid = false;
    }
    return valid;
  }
  public validTabChange(tabs: string[]) {
    this.validTabs = tabs;
  }
}
