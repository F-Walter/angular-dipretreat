import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment, positions } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PremiseService } from '../../services/premises/premise.service';
import { element } from 'protractor';
import { Premise } from 'src/app/model/Premise';

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
  arrayAllPremises: [];
  constructor(private activatedRoute: ActivatedRoute, private premiseService: PremiseService) {
    //by default
    this.lat = 37.75;
    this.lng = -122.41;
    this.arrayAllPremises = []
  }

  ngOnInit() {
    var premises$ = this.premiseService.getAllPremises()

    // param passed in query string
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

      premises$.subscribe((premises) => {

        //set access token 
        var map = mapboxgl
        map.accessToken = environment.mapbox.accessToken;

        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: 5,
          center: [this.lng, this.lat]
        });

        var premiseArray = premises as [];

        this.arrayAllPremises = premiseArray

        //element is a premise
        this.arrayAllPremises.forEach(element => {

          var e: any
          e = element

          var lat: number
          var lng: number

          lat = e.premises_geom.x
          lng = e.premises_geom.y

          // add the marker to the map corresponding to the position of the premises
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
        })

        // Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
      })
    })

  }
}

