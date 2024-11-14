import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { FacilityEntity } from '../../../../_core/domains/entities/facility.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MLArticleAccessType } from '../../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLScheduleArticleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';

@Component({
    templateUrl: './schedule.view.article.map.component.html',
    styleUrls: [
        '../../../meeymap/map.scss',
        '../../../../../assets/css/modal.scss',
        './schedule.view.article.map.component.scss',
    ],
})
export class MLScheduleViewArticleMapComponent implements OnInit {
    L: any;
    map: any;
    layerPopup: any;
    loadingMap: boolean;
    layerPopupFacility: any;

    popup: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: MLScheduleService;
    facilities: FacilityEntity[];
    dialogService: AdminDialogService;
    item: MLScheduleArticleEntity = new MLScheduleArticleEntity();

    constructor() {
        this.service = AppInjector.get(MLScheduleService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    confirm() {
        this.quickViewArticle(this.item);
        return true;
    }

    async ngOnInit() {
        this.loading = false;
        let item = this.params && this.params['item'];
        if (item) {
            this.item = EntityHelper.createEntity(MLScheduleArticleEntity, item);
            this.item.Coordinates = item.Coordinates;
            this.initMap(this.item);
            this.service.facilities(this.item.Coordinates, 10).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.facilities = result.Object;
                    if (this.facilities && this.facilities.length > 0) {
                        this.facilities.forEach((item: FacilityEntity) => {
                            this.createMarkerFacility(item);
                        });
                    }
                }
            });
        }
    }

    quickViewArticle(item: MLScheduleArticleEntity) {
        if (item.AccessType == MLArticleAccessType.Publish) {
            if (item.Path) {
                let url = UtilityExHelper.buildMeeyLandUrl(item.Path);
                window.open(url, "_blank");
            }
        } else {
            let statusText = '';
            switch (item.AccessType) {
                case MLArticleAccessType.Deleted: statusText = 'đã xóa'; break;
                case MLArticleAccessType.UnPublish: statusText = 'đã bị hạ'; break;
                case MLArticleAccessType.Draft: statusText = 'đang chờ duyệt'; break;
                case MLArticleAccessType.WaitPublish: statusText = 'đang chờ đăng'; break;
                case MLArticleAccessType.WaitPayment: statusText = 'đang chờ thanh toán'; break;
            }
            let message = 'Tin đăng ' + statusText + '<br />' + 'Vui lòng kiểm tra lại';
            this.dialogService.Alert('Thông báo', message);
        }
    }
    private initMap(item: MLScheduleArticleEntity) {
        this.loadingMap = true;
        if (!this.L) this.L = require('leaflet');
        require('../../../../../assets/plugins/leaflet/leaflet-smothzoom/leaflet-smothzoom.js');
        //require('../../../../../assets/plugins/leaflet/leaflet-responsive-popup/leaflet.responsive.popup.js');
        setTimeout(() => {
            let el = document.getElementById('article-map'),
                latLng = [item.Coordinates.Lat, item.Coordinates.Lng],
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
                        zoom: 17,
                        minZoom: 16,
                        maxZoom: 18,
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
    private createTemplate(item: MLScheduleArticleEntity) {
        let html = '<div class="map-popup-item">' +
            '<div class="body"><p style="font-size: larger; margin-bottom: 5px;">' + item.Title + '</p>' +
            '<p><span class="title">Mã tin: </span><b>' + item.Code + '</b></p>';
        if (item.CategoryName) html += '<p><span class="title">Chuyên mục:  </span><b>' + item.CategoryName + '</b></p>';
        html += '<p><span class="title">Ngày đăng:  </span><b>' + UtilityExHelper.dateTimeString(item.PublishedDate || item.StartDate) + '</b></p>' +
            '<p><span class="title">Địa chỉ:  </span><b>' + item.Location + '</b></p>' +
            '</div>' +
            '<div class="footer"><p>Tọa độ: ' + item.Coordinates.Lat + '/' + item.Coordinates.Lng + '</p></div></div>';
        return html;
    }
    private createMarkerFacility(item: FacilityEntity): any {
        if (item && item.Lat && item.Lng) {
            let html = '<div class="map-popup-small"><div class="icon-wrapper-small"></div></div>',
                type = item.Category.toLowerCase();
            if (type.indexOf('trường') >= 0) {
                html = '<div class="map-popup-small"><div class="icon-wrapper-small university"><span class="map-icon map-icon-university"></span></div></div>'
            } else if (type.indexOf('siêu thị') >= 0 || type.indexOf('tiện ích') >= 0) {
                html = '<div class="map-popup-small"><div class="icon-wrapper-small supermarket"><span class="map-icon map-icon-grocery-or-supermarket"></span></div></div>'
            } else if (type.indexOf('bệnh viện') >= 0) {
                html = '<div class="map-popup-small"><div class="icon-wrapper-small hospital"><span class="map-icon map-icon-hospital"></span></div></div>'
            } else if (type.indexOf('ngân hàng') >= 0) {
                html = '<div class="map-popup-small"><div class="icon-wrapper-small bank"><span class="map-icon map-icon-bank"></span></div></div>'
            } else if (type.indexOf('bến xe') >= 0) {
                html = '<div class="map-popup-small"><div class="icon-wrapper-small station"><span class="map-icon map-icon-bus-station"></span></div></div>'
            }

            let latLng = [item.Lat, item.Lng];
            let marker = this.L.marker(latLng, {
                item: item,
                icon: this.L.divIcon({ html: html }),
            }).on("mouseover", (e: any) => {
                let latlng = e.latlng,
                    item = this.facilities
                        .filter(c => c.Lat == latlng.lat)
                        .find(c => c.Lng == latlng.lng);
                if (item) {
                    let html = this.createHtmlTooltip(item);
                    this.layerPopupFacility = this.L.popup({ hasTip: true, autoPan: true, offset: [15, 15], closeButton: false })
                        .setLatLng(e.latlng)
                        .setContent(html)
                        .openOn(this.map);
                }
            }).on("mouseout", (e: any) => {
                if (this.layerPopupFacility) {
                    this.map.closePopup(this.layerPopupFacility);
                    this.layerPopupFacility = null;
                }
            });
            this.map.addLayer(marker);
        }
    }
    private createHtmlTooltip(item: FacilityEntity): string {
        let html = '<div class="map-popup-item">'
            + '<div class="header">' + item.Category + '</div>'
            + '<div class="body"><a>' + item.Name + '</a></div>';
        if (item.Address) html += '<div class="footer">Địa chỉ: ' + item.Address + '</div>';
        html += '</div>';
        return html;
    }
    private createMarker(item: MLScheduleArticleEntity): any {
        if (item && item.Coordinates.Lat && item.Coordinates.Lng) {
            let latLng = [item.Coordinates.Lat, item.Coordinates.Lng],
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
    private createPopupMarker(item: MLScheduleArticleEntity) {
        let html = this.createTemplate(item),
            latLng = [item.Coordinates.Lat, item.Coordinates.Lng];
        this.layerPopup = this.L.popup({ hasTip: true, autoPan: true, offset: [0, -32], closeButton: false })
            .setLatLng(latLng).setContent(html).openOn(this.map);
    }
}