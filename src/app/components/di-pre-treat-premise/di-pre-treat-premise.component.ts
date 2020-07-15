import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PremiseService } from 'src/app/services/premises/premise.service';
import { map, catchError } from 'rxjs/operators';
import { Sensor } from 'src/app/model/Sensor';
import * as CanvasJS from '../../external-libraries/canvasjs.min.js';
import { Point } from 'src/app/model/Point.js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-di-pre-treat-premise',
  templateUrl: './di-pre-treat-premise.component.html',
  styleUrls: ['./di-pre-treat-premise.component.css']
})
export class DiPreTreatPremiseComponent implements OnInit {

  activatedRoutesSubscription: Subscription


  premiseData$: Observable<any>
  datesForm: FormGroup;
  premiseId: string
  startDateSelected: string;
  endDateSelected: string;
  closedAlert: boolean

  constructor(private activatedRoute: ActivatedRoute, private premiseService: PremiseService, private fb: FormBuilder, private router: Router) {
    this.datesForm = fb.group({
      startDate: [''],
      endDate: ['']
    })

    this.premiseData$ = of([])

    this.closedAlert = true
    // console.log(this.datesForm)
  }

  changeSelectedDate(date: Date) {
    console.log(date.toISOString().substring(0, 10))
  }

  submit() {
    if (this.datesForm.value.startDate.getTime() <= this.datesForm.value.endDate.getTime()) {//TODO: avvisare in caso di errore
      this.closedAlert = true;
      this.router.navigate(["/premiseDetails"], { queryParams: { premiseId: this.premiseId, startDate: this.datesForm.value.startDate.toISOString().substring(0, 10), endDate: this.datesForm.value.endDate.toISOString().substring(0, 10) } })
    } else {
      this.closedAlert = false
    }
  }

  ngOnInit(): void {

    this.activatedRoutesSubscription = this.activatedRoute.queryParams.subscribe((param) => {
      if (param['premiseId']) {
        this.premiseId = param['premiseId']

        if (param['startDate'])
          this.startDateSelected = param['startDate']
        else
          this.startDateSelected = "2020-01-04"


        if (param['endDate'])
          this.endDateSelected = param['endDate']
        else
          this.endDateSelected = "2020-04-09"

        let arrayData: Sensor[] = []
        console.log(param['premiseId'])


        this.premiseData$ = this.premiseService.getPremiseData(this.premiseId, this.startDateSelected, this.endDateSelected) // per adesso il premiseName non è usato perchè abbiamo un API di default
          .pipe(
            map(data => {
              let premiseData = Object.values(data)
              for (let index = 0; index < premiseData.length; index++) {
                for (let i = 0; i < premiseData.length; i++) {
                  arrayData.push(new Sensor(premiseData[i]))
                }
              }
              return arrayData
            }),
            catchError(_ => of([]))
          )


        this.premiseData$.subscribe((arrayData: Sensor[]) => {

          // arrayData = arrayData.slice(0, 10000)  //se si vuole limitare i dati
          console.log(arrayData)
          let phArray = []
          let humidityArray = []
          let temperatureArray = []
          let y;
          let x;

          for (let i = 0; i < arrayData.length; i++) {


            y = arrayData[i].sensor_data;

            x = new Date(arrayData[i].sensor_timestamp);

            let p: Point = new Point(x, y)

            switch (arrayData[i].sensor_description) {
              case 'pH':
                if (!phArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  phArray.push(p)
                break;
              case 'humidity':
                if (!humidityArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  humidityArray.push(p)
                break;
              case "temperature":
                if (!temperatureArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  temperatureArray.push(p)
                break;
              default:
                break;
            }

          }

          console.log(arrayData.length)
          console.log(humidityArray.length)
          console.log(temperatureArray.length)
          console.log(phArray.length)

          //   console.log(temperatureArray)

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




