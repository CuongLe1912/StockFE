declare var google: any;
import * as _ from 'lodash';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'mpo-project-map',
    templateUrl: './view.project.map.component.html',
    styleUrls: [
        '../../meeymap/map.scss',
        '../../../../assets/css/modal.scss',
        './view.project.map.component.scss',
    ],
})
export class MPOViewProjectMapComponent implements OnInit, OnChanges {
    L: any;
    map: any;
    mapId: string;
    layerPopup: any;
    loadingMap: boolean;
    layerPopupFacility: any;
    defaultLatLng = [21.027763, 105.834160];

    popup: boolean;
    markers: any[] = [];
    loading: boolean = true;
    @Input() viewer: boolean;
    @Input() coordinates: number[];
    @Output() pointChange = new EventEmitter<number[]>();

    constructor() {
        this.mapId = UtilityExHelper.randomText(10);
    }

    async ngOnInit() {
        setTimeout(() => this.initMap(), 300);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.coordinates && changes.coordinates.currentValue) {
                let coordinates: number[] = changes.coordinates.currentValue;
                if (coordinates && coordinates.length == 2)
                    this.coordinates = coordinates;
                this.createMarker();
            }
        }
    }

    private initMap() {
        this.loadingMap = true;
        if (!this.L) this.L = require('leaflet');
        require('../../../../assets/plugins/leaflet/leaflet-smothzoom/leaflet-smothzoom.js');
        setTimeout(() => {
            let latLng = null,
                el = document.getElementById(this.mapId),
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
                        center: latLng || this.defaultLatLng,
                        layers: [googleStreets, googleHybrid, googleTerrain],
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

                this.createMarker();
                this.loadingMap = false;
            }
        }, 300);
    }
    private createMarker(): any {
        if (this.L) {
            let latLng = this.coordinates && this.coordinates.length == 2
                ? [this.coordinates[0], this.coordinates[1]]
                : this.defaultLatLng,
                html = '<div class="map-popup"><div class="icon-wrapper animation has-img"><img src="https://www.demoapus-wp1.com/homeo/wp-content/uploads/2020/03/pin.png"></div></div>';

            let marker: any;
            if (this.viewer) {
                marker = this.L.marker(latLng, {
                    draggable: false,
                    icon: this.L.divIcon({ html: html })
                });
            } else {
                marker = this.L.marker(latLng, {
                    draggable: true,
                    icon: this.L.divIcon({ html: html })
                }).on('dragend', () => {
                    let coordinates = [marker.getLatLng().lat, marker.getLatLng().lng];
                    this.pointChange.emit(coordinates);
                });
            }
            if (this.map) {
                this.map.addLayer(marker);
                var group = new this.L.featureGroup([marker]);
                this.map.fitBounds(group.getBounds());
            }
        }
    }
}