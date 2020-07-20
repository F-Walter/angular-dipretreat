import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment, positions } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PremiseService } from '../../services/premises/premise.service';

import StylesControl from 'mapbox-gl-controls/lib/styles';




@Component({
  selector: 'app-di-pre-treat-map',
  templateUrl: './di-pre-treat-map.component.html',
  styleUrls: ['./di-pre-treat-map.component.css']
})
export class DiPreTreatMapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11'; // style: 'mapbox://styles/mapbox/satellite-v9'
  lat: number;
  lng: number;
  selectedCountry: string;
  arrayAllPremises: [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private premiseService: PremiseService) {
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
        let map = mapboxgl
        map.accessToken = environment.mapbox.accessToken;

        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: 5,
          center: [this.lng, this.lat]
        });

        let premiseArray = premises as [];

        this.arrayAllPremises = premiseArray

        //element is a premise
        this.arrayAllPremises.forEach(element => {

          let e: any
          e = element

          let lat: number
          let lng: number

          lat = e.premises_geom.x
          lng = e.premises_geom.y

          let premiseId = e.premises_id
          let premiseName = e.premises_name
          let corrosion_level = Number(e.corrosion_level)
          let popup;

          // add the marker to the map corresponding to the position of the premises

          let marker: mapboxgl.Marker;

          switch (corrosion_level) {
            //No corrosion - green
            case 0:
              popup = new mapboxgl.Popup({ offset: 25 })
                .setText(`Name: ${premiseName} - No corrosion`);

              marker = new mapboxgl.Marker({ color: 'green' })
                .setLngLat([lng, lat])
                .setPopup(popup) // sets a popup on this marker
                .addTo(this.map);
              break;

            // Uncertain level of corrosion - yellow
            case 1:
              popup = new mapboxgl.Popup({ offset: 25 })
                .setText(`Name: ${premiseName} - Uncertain level of corrosion`);

              marker = new mapboxgl.Marker({ color: 'yellow' })
                .setLngLat([lng, lat])
                .setPopup(popup) // sets a popup on this marker
                .addTo(this.map);
              break;

            //Corrosion likely - orange
            case 2:
              popup = new mapboxgl.Popup({ offset: 25 })
                .setText(`Name: ${premiseName} - Corrosion likely`);

              marker = new mapboxgl.Marker({ color: 'orange' })
                .setLngLat([lng, lat])
                .setPopup(popup) // sets a popup on this marker
                .addTo(this.map);
              break;

            //Severe state of corrosion - red  
            case 3: //red
              popup = new mapboxgl.Popup({ offset: 25 })
                .setText(`Name: ${premiseName} - Severe state of corrosion`);

              marker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat([lng, lat])
                .setPopup(popup) // sets a popup on this marker
                .addTo(this.map);
              break;

            //error case -> N/A corrosion level
            default:
              popup = new mapboxgl.Popup({ offset: 25 })
                .setText(`Name: ${premiseName} - Corrosion level: N/A`);

              marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(popup) // sets a popup on this marker
                .addTo(this.map);
              break;
          }

          marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
          marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());
          marker.getElement().addEventListener('click', () => this.router.navigate(['premiseDetails'], { queryParams: { premiseId: premiseId } }))

        })


        //  //Add searchbar
        //   var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        //     accessToken: mapboxgl.accessToken, // Set the access token
        //     mapboxgl: mapboxgl, // Set the mapbox-gl instance
        //     marker: false, // Do not use the default marker style
        //   });

        // // Add the geocoder to the map
        // this.map.addControl(geocoder);

        // Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));


        // with custom styles:
        this.map.addControl(new StylesControl({
          styles: [
            {
              label: 'Road',
              styleUrl: 'mapbox://styles/mapbox/streets-v11',
            }, {
              label: 'Earth',
              styleUrl: 'mapbox://styles/mapbox/satellite-v9',
            },
          ],
          onChange: (style) => console.log(style),
        }), 'top-right');
      })
    })
  }



}


