declare var $;
declare var google;
import * as _ from 'lodash';
import { StringEx } from '../../decorators/string.decorator';
import { AddressData } from '../../domains/data/address.data';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-address',
    templateUrl: 'address.component.html',
    styleUrls: ['address.component.scss']
})
export class AddressComponent implements OnInit, OnChanges {
    lat: number;
    lng: number;
    circle: any;
    options: any;
    address: string;
    @Input() value: AddressData;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.value && this.decorator.defaultValue) {
            this.value = this.decorator.defaultValue;
        }
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.max) this.decorator.max = 500000;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';

        setTimeout(() => {
            if (!this.decorator.readonly)
                this.renderGoogleAddress();
            this.setValue();
        }, 200);
    }

    ngOnChanges() {
        this.setValue();
    }

    clear() {
        this.lat = null;
        this.lng = null;
        this.value = null;
        this.address = null;
        this.valueChange.emit(this.value);
    }

    private setValue() {
        if (this.value) {
            try {
                let element: HTMLInputElement = document.getElementById(this.decorator.id) as HTMLInputElement;
                let obj: AddressData = _.cloneDeep(this.value);
                if (obj && obj.address) {
                    this.lat = obj.lat;
                    this.lng = obj.lng;
                    this.address = obj.address;
                    if (element) element.value = obj.address;
                }
            } catch { }
        }
    }

    private renderGoogleAddress() {
        this.options = {
            componentRestrictions: {
                country: 'gb'
            }
        };
        this.circle = new google.maps.Circle({
            radius: 775000,
            center: {
                lat: 54.093409,
                lng: -2.89479
            }
        });
        let element: HTMLInputElement = document.getElementById(this.decorator.id) as HTMLInputElement,
            inputPlace = new google.maps.places.Autocomplete(element, this.options);
        inputPlace.setBounds(this.circle.getBounds());
        google.maps.event.addListener(inputPlace, 'place_changed', () => {
            let place = inputPlace.getPlace(),
                lat = place.geometry.location.lat(),
                lng = place.geometry.location.lng();
            let value: AddressData = {
                address: element.value,
                lat: parseFloat(lat.toFixed(6)),
                lng: parseFloat(lng.toFixed(6)),
            };
            this.valueChange.emit(value);
        });
    }
}
