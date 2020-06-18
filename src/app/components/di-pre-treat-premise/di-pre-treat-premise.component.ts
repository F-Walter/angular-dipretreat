import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PremiseService } from 'src/app/services/premises/premise.service';
import { map } from 'rxjs/operators';
import { PremiseData } from 'src/app/model/PremiseData';
import { Sensor } from 'src/app/model/Sensor';
import * as CanvasJS from '../../external-libraries/canvasjs.min.js';

@Component({
  selector: 'app-di-pre-treat-premise',
  templateUrl: './di-pre-treat-premise.component.html',
  styleUrls: ['./di-pre-treat-premise.component.css']
})
export class DiPreTreatPremiseComponent {

  activatedRoutesSubscription: Subscription


  premiseData$: Observable<any>
  arrayData: PremiseData[] = []
  arrayData$: Observable<PremiseData[]>



  constructor(activatedRoute: ActivatedRoute, premiseService: PremiseService) {

    this.activatedRoutesSubscription = activatedRoute.queryParams.subscribe((param) => {
      if (param['premiseName']) {
        this.premiseData$ = premiseService.getPremiseData(param['premiseName'])
          .pipe(
            map(data => {

              let dates = Object.keys(data)
              let premiseData = Object.values(data)

              for (let index = 0; index < dates.length; index++) {
                console.log(premiseData[index].length)
                for (let i = 0; i < premiseData[index].length; i++) {
                  this.arrayData.push(new PremiseData(dates[index], new Sensor(premiseData[index][i])))
                }
              }
              this.arrayData$ = of(this.arrayData)
              console.log(this.arrayData)
              return data
            }),

          )
        this.premiseData$.subscribe((a) => {
          console.log(this.arrayData)


          let phArray = [];
          let humidityArray = []
          let temperatureArray = []

          let y = 0;
          let x;



          for (let i = 0; i < this.arrayData.length; i++) {

            y = this.arrayData[i].sensor.sensor_data;

            x = this.arrayData[i].date;

            if (this.arrayData[i].sensor.sensor_description === "pH") {
              phArray.push({ y: y })
            } else {
              if (this.arrayData[i].sensor.sensor_description === "humidity")
                humidityArray.push({ x: x, y: y })
              else
                temperatureArray.push({ x: x, y: y })

            }
          }

          var chartHumityTemperature = new CanvasJS.Chart("chartContainer", {
            zoomEnabled: true,
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: "Ponte Torino"
            },
            subtitles: [{
              text: "Try Zooming and Panning"
            }],
            axisY: {
              title: "Humidity[rH %]",
            },
            axisY2: {
              title: "Temperature[ ]",
            },
            legend: {
              cursor: "pointer",
              verticalAlign: "top",
              horizontalAlign: "center",
              dockInsidePlotArea: true,
            },
            toolTip: {
              shared: true
            },
            data: [
              {
                type: "line",
                name: "Humidity",
                axisYType: "primary",
                showInLegend: true,

                dataPoints: humidityArray
              },
              {
                type: "line",
                name: "Temperature",
                axisYType: "secondary",
                showInLegend: true,

                dataPoints: temperatureArray
              },


            ]
          });



          var chartPH = new CanvasJS.Chart("chartContainerPH", {
            zoomEnabled: true,
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: "PH"
            },
            subtitles: [{
              text: "Try Zooming and Panning"
            }],


            axisY: {
              title: "PH[rH %]",
            },
            legend: {
              cursor: "pointer",
              verticalAlign: "top",
              horizontalAlign: "center",
              dockInsidePlotArea: true,
            },
            data: [
              {
                type: "line",
                name: "PH",
                axisYType: "primary",
                showInLegend: true,
                dataPoints: phArray
              },

            ]
          });


          chartHumityTemperature.render();
          chartPH.render();
        })
      }
    })
  }



}




