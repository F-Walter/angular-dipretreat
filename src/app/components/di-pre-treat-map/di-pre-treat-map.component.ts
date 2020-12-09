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

      this.premiseService.getAllPremises().subscribe((premises) => {

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



        this.premiseService.getAlarm().subscribe((alarms) => {

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

            let popupHTML = ""
            let color

            console.log(alarms);

            for (let i = 0; i < alarms.length; i++) {
              if (alarms[i].id == premiseId)
                popupHTML = `<i class="material-icons warningTemperature" style="font-size:12px;color:red">warning</i> Out of range temperature: ${alarms[i].s_data}`
            }

            switch (corrosion_level) {
              //No corrosion - green
              case 0:
                popupHTML = popupHTML.concat(`<p> Name: ${premiseName} - No deterioration </p>`)
                color = "green"
                break;

              // Uncertain level of corrosion - yellow
              case 1:
                popupHTML = popupHTML.concat(`<p> Name: ${premiseName} - Starting deterioration </p>`)
                color = "yellow"
                break;

              //Corrosion likely - orange
              case 2:
                popupHTML = popupHTML.concat(`<p>Name: ${premiseName} - Advanced deterioration </p>`)
                color = `orange`
                break;

              //Severe state of corrosion - red  
              case 3: //red
                popupHTML = popupHTML.concat(`<p>Name: ${premiseName} - Severe state of corrosion </p>`)
                color = `red`
                break;

              //error case -> N/A corrosion level
              default:
                popupHTML = popupHTML.concat(`<p> Name: ${premiseName} - Corrosion level: N/A </p>`)
                break;
            }
            
            popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(popupHTML);

            marker = new mapboxgl.Marker({ color: color })
              .setLngLat([lng, lat])
              .setPopup(popup) // sets a popup on this marker
              .addTo(this.map);

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
    })
  }



}


