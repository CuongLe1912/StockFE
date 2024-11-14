import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MeeymapService } from '../meeymap.service';
import { Component, Input, OnInit } from '@angular/core';
import { MMAssignComponent } from '../assign/assign.component';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { MMAddNoteComponent } from '../add.note/add.note.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MLPopupViewUserComponent } from '../../meeyuser/popup.view.user/popup.view.user.component';
import { MLLookHistoryAssignComponent } from '../lookup.history.assign/lookup.history.assign.component';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';
import { MMLookupHistoryStatusType } from '../../../_core/domains/entities/meeymap/enums/mm.lookup.history.status.type';

@Component({
    templateUrl: './lookup.view.component.html',
    styleUrls: [
        '../map.scss',
        './lookup.view.component.scss',
        '../../../../assets/css/modal.scss',
    ],
})
export class MMLookupViewComponent extends EditComponent implements OnInit {
    L: any;
    map: any;
    layerPopup: any;
    loadingMap: boolean;
    layerPopupFeature: any;
    MMLookupHistoryStatusType = MMLookupHistoryStatusType;

    id: number;
    meeyId: string;
    infoArea: number;
    infoLegal: string;
    infoProject: string;
    allowAssign: boolean;
    @Input() params: any;
    loading: boolean = true;
    item: MMLookupHistoryEntity = new MMLookupHistoryEntity();

    service: MeeymapService;
    authService: AdminAuthService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.state = this.getUrlState();
        this.service = AppInjector.get(MeeymapService);
        this.authService = AppInjector.get(AdminAuthService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.meeyId = this.params && this.params['meeyId'];
        if (this.state) {
            this.id = this.id || this.state.id;
        }
        if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
            this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
        } else if (this.router?.routerState?.snapshot?.root?.queryParams["meeyId"]) {
            this.meeyId = this.router?.routerState?.snapshot?.root?.queryParams["meeyId"];
        } else if (this.router?.routerState?.snapshot?.root?.queryParams["meeyid"]) {
            this.meeyId = this.router?.routerState?.snapshot?.root?.queryParams["meeyid"];
        }
        await this.loadItem();
        this.allowAssign = await this.authService.permissionAllow('mmlookuphistory', ActionType.AssignSupport);
        this.loading = false;
    }

    assign() {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Lưu',
            object: MMAssignComponent,
            size: ModalSizeType.Medium,
            title: 'Gán chăm sóc khách hàng',
            objectExtra: {
                item: _.cloneDeep(this.item)
            }
        }, async () => { this.loadItem(); });
    }
    viewUser() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            object: MLPopupViewUserComponent,
            title: 'Xem thông tin người dùng',
            objectExtra: { meeyId: this.item.MeeyUserId }
        });
    }
    historyAssign() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            objectExtra: { id: this.item.Id },
            object: MLLookHistoryAssignComponent,
            title: 'Lịch sử thay đổi nhân viên chăm sóc',
        });
    }
    viewLookupHistoryUser() {
        let search = this.item.Phone || this.item.Email;
        let obj: NavigationStateData = {
            prevData: {
                Search: search,
                Paging: {
                    Index: 1,
                    Size: 50,
                }
            }
        };
        this.router.navigate(['/admin/mmlookuphistory'], { state: { params: JSON.stringify(obj) } });
    }

    private async loadItem() {
        this.item = new MMLookupHistoryEntity();
        if (this.id) {
            await this.service.item('MMLookupHistory', this.id).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.meeyId) {
            await this.service.itemByMeeyId(this.meeyId).then((result: ResultApi) => {
                this.renderItem(result);
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            {
                name: 'Gán CSKH',
                icon: 'la la-book',
                className: 'btn btn-primary',
                systemName: ActionType.AssignSupport,
                click: (() => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Hủy',
                        confirmText: 'Lưu',
                        object: MMAssignComponent,
                        size: ModalSizeType.Medium,
                        title: 'Gán chăm sóc khách hàng',
                        objectExtra: {
                            item: _.cloneDeep(this.item)
                        }
                    }, async () => { this.loadItem(); });
                })
            },
            {
                icon: 'la la-bolt',
                name: ActionType.Notes,
                className: 'btn btn-info',
                systemName: ActionType.Notes,
                click: (() => {
                    this.dialogService.WapperAsync({
                        title: 'Ghi chú',
                        cancelText: 'Hủy',
                        confirmText: 'Lưu',
                        object: MMAddNoteComponent,
                        size: ModalSizeType.Medium,
                        objectExtra: {
                            item: _.cloneDeep(this.item)
                        }
                    }, async () => { this.loadItem(); });
                })
            }
        ];
        this.actions = await this.authen.actionsAllow(MMLookupHistoryEntity, actions);
    }
    private getZoom(area: number) {
        return area >= 55000 ? 18 : area >= 3000 ? 19 : 20
    }
    private renderItem(result: ResultApi) {
        if (ResultApi.IsSuccess(result)) {
            let item = result.Object as MMLookupHistoryEntity;
            this.item = EntityHelper.createEntity(MMLookupHistoryEntity, result.Object as MMLookupHistoryEntity);
            if (this.featuresHasValue(item)) {
                item.Feature.properties.features.forEach((feature: any) => {
                    if (!this.infoProject) {
                        this.infoProject = feature.properties.kyHieuPhan;
                    }
                    if (!this.infoLegal) {
                        this.infoLegal = feature.properties.canCuPhapL;
                    }
                });
                if (!this.infoProject) this.infoProject = item.Feature.properties.kyHieuPhan;
                this.infoArea = item.Feature.properties.SHAPE_Area || item.Feature.properties.Shape_Area;
            }
            this.item.Feature = item.Feature;
            this.renderActions();
            this.breadcrumbs = [
                { Name: 'Meey Map' },
                { Name: 'Lịch sử tra cứu', Link: this.state.prevUrl },
                { Name: 'Thông tin tra cứu lịch sử' }
            ];
            this.initMap(this.item);
        } else {
            ToastrHelper.ErrorResult(result);
        }
    }
    private initMap(item: MMLookupHistoryEntity) {
        if (!this.map) {
            this.loadingMap = true;
            if (!this.L) this.L = require('leaflet');
            require('../../../../assets/plugins/leaflet/leaflet-smothzoom/leaflet-smothzoom.js');
            //require('../../../../assets/plugins/leaflet/leaflet-responsive-popup/leaflet.responsive.popup.js');
            setTimeout(() => {
                let area = item.Feature.properties.SHAPE_Area || item.Feature.properties.Shape_Area,
                    el = document.getElementById('lookup-view-map'),
                    latLng = [item.Lat, item.Lng],
                    zoom = this.getZoom(area),
                    googleStreets = this.L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                        maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                    }),
                    googleHybrid = this.L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                        maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                    }),
                    googleTerrain = this.L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                        maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                    });
                if (el) {
                    this.map = this.L.map(el, {
                        zoom: zoom,
                        minZoom: 16,
                        maxZoom: 22,
                        zoomSnap: true,
                        dragging: true,
                        zoomDelta: true,
                        touchZoom: true,
                        trackResize: true,
                        zoomControl: false,
                        smoothSensitivity: 1,
                        smoothWheelZoom: true,
                        doubleClickZoom: true,
                        scrollWheelZoom: false,
                        closePopupOnClick: false,
                        center: latLng || [21.027763, 105.834160],
                        layers: [googleStreets, googleHybrid, googleTerrain],
                    });
                    this.createMarker(item);
                    if (item.Feature && item.Feature.properties && item.Feature.properties.features && item.Feature.properties.features.length > 0) {
                        item.Feature.properties.features.forEach((feature: any, index: number) => {
                            this.createMarkerFeature(feature, index);
                            this.L.geoJSON(feature, {
                                style: {
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 1,
                                    color: 'rgb(225, 225, 225)',
                                    fillColor: feature.properties.color,
                                }
                            }).addTo(this.map);
                        });
                    }

                    let baseMaps = { "Vệ tinh": googleHybrid, "Địa hình": googleStreets, "Đường phố": googleTerrain };
                    this.L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(this.map);

                    // change author
                    let interval = setInterval(() => {
                        let elements = document.getElementsByClassName('leaflet-control-attribution');
                        if (elements && elements.length > 0) {
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].innerHTML = '<a href="https://adminv3.meeyland.com" title="Meey Admin Maps">Meey Admin Maps</a>';
                            };
                            clearInterval(interval);
                        }
                    }, 100);
                    this.loadingMap = false;
                }
            }, 300);
        }
    }

    private createMarker(item: MMLookupHistoryEntity): any {
        if (item && item.Lat && item.Lng) {
            let latLng = [item.Lat, item.Lng],
                html = '<div class="map-popup"><div class="icon-wrapper animation has-img"><img src="https://www.demoapus-wp1.com/homeo/wp-content/uploads/2020/03/pin.png"></div></div>',
                marker = this.L.marker(latLng, {
                    icon: this.L.divIcon({ html: html })
                }).on("mouseover", (e: any) => {
                    this.createPopupMarker(item);
                });
            this.createPopupMarker(item);
            if (this.map) this.map.addLayer(marker);
        }
    }
    private createPopupMarker(item: MMLookupHistoryEntity) {
        let latLng = [item.Lat, item.Lng],
            html = '<div class="map-popup-item">' +
                '<div class="body"><p>' + item.Address + '</p></div>' +
                '<div class="footer"><p>Tọa độ: ' + item.Lat + '/' + item.Lng + '</p></div></div>';
        this.layerPopup = this.L.popup({ hasTip: true, autoPan: true, offset: [0, -32] })
            .setLatLng(latLng).setContent(html).openOn(this.map);
    }

    private createPopupMarkerFeature(item: any) {
        if (item && item.centerLatLng) {
            let area = item.properties && item.properties.Shape_Area.toFixed(2),
                latLng = [item.centerLatLng.lat, item.centerLatLng.lng],
                type = item.properties && item.properties.loaiDat,
                html = '<div class="map-popup-item">' +
                    '<div class="body"><p>' + type + '</p></div>' +
                    '<div class="footer"><p>Diện tích: ' + area + '</p></div></div>';
            this.layerPopupFeature = this.L.popup({ hasTip: true, autoPan: true, offset: [0, 10] })
                .setLatLng(latLng).setContent(html).openOn(this.map);
        }
    }
    private createMarkerFeature(item: any, index: number): any {
        if (item && item.centerLatLng) {
            let latLng = [item.centerLatLng.lat, item.centerLatLng.lng],
                html = '<div class="map-popup-small"><div class="icon-wrapper-small">' + (index + 1) + '</div></div>',
                marker = this.L.marker(latLng, {
                    item: item,
                    icon: this.L.divIcon({ html: html }),
                }).on("mouseover", (e: any) => {
                    this.createPopupMarkerFeature(item);
                }).on("mouseout", (e: any) => {
                    if (this.layerPopupFeature) {
                        this.map.closePopup(this.layerPopupFeature);
                        this.layerPopupFeature = null;
                    }
                });
            if (this.map) this.map.addLayer(marker);
        }
    }

    private featuresHasValue(item: MMLookupHistoryEntity): boolean {
        return item.Feature &&
            item.Feature.properties &&
            item.Feature.properties.features &&
            item.Feature.properties.features.length > 0;
    }
}