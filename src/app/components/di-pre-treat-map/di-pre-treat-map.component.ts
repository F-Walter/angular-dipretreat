import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment, positions } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-di-pre-treat-map',
  templateUrl: './di-pre-treat-map.component.html',
  styleUrls: ['./di-pre-treat-map.component.css']
})
export class DiPreTreatMapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number;
  lng: number;
  selectedCountry: string;
  constructor(private activatedRoute: ActivatedRoute) {
    this.lat = 37.75;
    this.lng = -122.41; //by default
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param['country']) {
        this.selectedCountry = param['country'];

        positions.forEach(element => {
          if (element.country == this.selectedCountry) {
            this.lat = Number(element.latitude);
            this.lng = Number(element.longitude);
          }
        });
      }

      var map = mapboxgl
      map.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 7,
        center: [this.lng, this.lat]
      });
      // Add map controls
      this.map.addControl(new mapboxgl.NavigationControl());
    })

  }
}


/*

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  constructor() { }
  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }
}
*/