import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MeeymapService } from '../meeymap.service';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';
import { MMLookupHistoryStatusType } from '../../../_core/domains/entities/meeymap/enums/mm.lookup.history.status.type';

@Component({
    templateUrl: './lookup.quickview.component.html',
    styleUrls: [
        '../map.scss',
        './lookup.quickview.component.scss',
        '../../../../assets/css/modal.scss',
    ],
})
export class MMLookupQuickViewComponent extends EditComponent implements OnInit {
    L: any;
    map: any;
    layerPopup: any;
    loadingMap: boolean;
    layerPopupFeature: any;
    MMLookupHistoryStatusType = MMLookupHistoryStatusType;

    popup: boolean;
    infoArea: number;
    infoLegal: string;
    infoProject: string;
    @Input() params: any;
    loading: boolean = true;
    item: MMLookupHistoryEntity = new MMLookupHistoryEntity();

    service: MeeymapService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(MeeymapService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MMLookupHistoryEntity();
        let id = this.getParam('id');
        let refId = this.getParam('refId');
        this.popup = this.getParam('popup');
        if (refId) {
            await this.service.callApi('MMLookupHistory', 'MeeyId/' + refId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item = result.Object as MMLookupHistoryEntity;
                    this.item = EntityHelper.createEntity(MMLookupHistoryEntity, item);
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
                    this.initMap(this.item);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        else if (id) {
            await this.service.item('MMLookupHistory', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item = result.Object as MMLookupHistoryEntity;
                    this.item = EntityHelper.createEntity(MMLookupHistoryEntity, item);
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
                    this.initMap(this.item);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private getZoom(area: number) {
        return area >= 55000 ? 18 : area >= 3000 ? 19 : 20
    }
    private initMap(item: MMLookupHistoryEntity) {
        this.loadingMap = true;
        if (!this.L) this.L = require('leaflet');
        require('../../../../assets/plugins/leaflet/leaflet-smothzoom/leaflet-smothzoom.js');
        //require('../../../../assets/plugins/leaflet/leaflet-responsive-popup/leaflet.responsive.popup.js');
        setTimeout(() => {
            let area = item.Feature.properties?.SHAPE_Area || item.Feature.properties?.Shape_Area,
                el = document.getElementById('lookup-quickview-map'),
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
                if (!this.map) {
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
                }
                this.createMarker(item);
                if (this.featuresHasValue(item)) {
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