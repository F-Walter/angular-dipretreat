import { Component } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PremiseService } from 'src/app/services/premises/premise.service';
import { map, catchError } from 'rxjs/operators';
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
  arrayData: Sensor[] = []



  constructor(activatedRoute: ActivatedRoute, premiseService: PremiseService) {

    this.activatedRoutesSubscription = activatedRoute.queryParams.subscribe((param) => {
      if (param['premiseName']) {
        this.premiseData$ = premiseService.getPremiseData(param['premiseName']) // per adesso il premiseName non è usato perchè abbiamo un API di default
          .pipe(
            map(data => {
              let premiseData = Object.values(data)

              for (let index = 0; index < premiseData.length; index++) {
                for (let i = 0; i < premiseData.length; i++) {
                  this.arrayData.push(new Sensor(premiseData[i]))
                }
              }
              return data
            }),
            catchError(_ => of([]))
          )


        this.premiseData$.subscribe((a) => {

          // this.arrayData = this.arrayData.slice(0,500)  //se si vuole limitare i dati

          let phArray = []
          let humidityArray = []
          let temperatureArray = []
          let y;
          let x;

          for (let i = 0; i < this.arrayData.length; i++) {

            y = this.arrayData[i].sensor_data;

            x = new Date(this.arrayData[i].sensor_timestamp);


            switch (this.arrayData[i].sensor_description) {
              case 'pH':
                phArray.push({ x: x, y: y })
                break;
              case 'humidity':
                humidityArray.push({ x: x, y: y })
                break;
              case "temperature":
                temperatureArray.push({ x: x, y: y })
                console.log(this.arrayData[i])
                break;
              default:
                break;
            }

          }

          console.log(this.arrayData.length)
          console.log(humidityArray.length)
          console.log(temperatureArray.length)
          console.log(phArray.length)
          
          //Sort all arrays
          humidityArray = humidityArray.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          temperatureArray = temperatureArray.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          phArray = phArray.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

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
            axisX: {
              valueFormatString: "MMM YYYY"
            },
            axisY: {
              title: "Humidity[rH %]",
            },
            axisY2: {
              title: "Temperature[ ]", //TODO: definire unità 
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




