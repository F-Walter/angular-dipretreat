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
  premiseId: string
  datesForm: FormGroup;
  startDateSelected: string;
  endDateSelected: string;
  closedAlert: boolean


  //Premise information

  premise_id: string
  premise_name: string;
  premise_geom: string;
  last_maintanance: string;
  corrosion_level: string;
  last_inspection: string;
  creation_year: string;

  constructor(private activatedRoute: ActivatedRoute, private premiseService: PremiseService, private fb: FormBuilder, private router: Router) {
    this.datesForm = fb.group({
      startDate: [''],
      endDate: ['']
    })

    this.premiseData$ = of([])

    this.closedAlert = true
    // console.log(this.datesForm)

    this.premise_id = "N/A"
    this.premise_name = "N/A"
    this.premise_geom = "N/A"
    this.last_maintanance = "N/A"
    this.corrosion_level = "N/A"
    this.last_inspection = "N/A"
    this.creation_year = "N/A"
  }

  changeSelectedDate(date: Date) {
    // console.log(date.toISOString().substring(0, 10))
  }

  submit() {
    if (this.datesForm.value.startDate.getTime() <= this.datesForm.value.endDate.getTime()) {//TODO: avvisare in caso di errore
      this.closedAlert = true;
      this.router.navigate(["/premiseDetails"], { queryParams: { premiseId: this.premiseId, startDate: this.datesForm.value.startDate.toISOString().substring(0, 10), endDate: this.datesForm.value.endDate.toISOString().substring(0, 10) } })
    } else {
      this.closedAlert = false
    }
  }

  //TODO: integration with other company
  submitCorrosionForcast() {
    console.log("Corrosion Forecast");

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
          this.endDateSelected = "2020-07-29"

        let arrayData: Sensor[] = []
        // console.log(param['premiseId'])
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

        this.premiseService.getAllPremises().subscribe((e) => {
          let element: any = e;
          element.forEach(premise => {
            if (premise.premises_id == this.premiseId) {
              if (premise.premises_id)
                this.premise_id = premise.premises_id
              if (premise.premises_name)
                this.premise_name = premise.premises_name;
              if (premise.premises_geom)
                this.premise_geom = "Lat " + premise.premises_geom.x + " - Lng " + premise.premises_geom.y;
              if (premise.last_maintanance)
                this.last_maintanance = premise.last_maintanance;
              if (premise.corrosion_level == 0 || premise.corrosion_level)
                this.corrosion_level = premise.corrosion_level;
              if (premise.last_inspection)
                this.last_inspection = premise.last_inspection;
              if (premise.creation_year)
                this.creation_year = premise.creation_year.substring(0, 10);
            }
          });

          this.premiseData$.subscribe((arrayData: Sensor[]) => {

            // arrayData = arrayData.slice(0, 10000)  //se si vuole limitare i dati
            // console.log(arrayData)
            let phArray = []
            let humidityArray = []
            let temperatureArray = []
            let windSpeedArray = []
            let pressureArray = []
            let extHumidityArray = []
            let extTemperatureArray = []
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
                case 'wind speed':
                  if (!windSpeedArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                    windSpeedArray.push(p)
                  break;

                case 'ext pressure':
                  if (!pressureArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                    pressureArray.push(p)
                  break;

                case 'ext humidity':
                  if (!extHumidityArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                    extHumidityArray.push(p)
                  break;
                case 'ext temperature':
                  if (!extTemperatureArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                    extTemperatureArray.push(p)
                  break;
                default:
                  break;
              }

            }

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

            windSpeedArray = windSpeedArray.sort((x1, x2) => {
              return x1.x.getTime() - x2.x.getTime()
            })


            pressureArray = pressureArray.sort((x1, x2) => {
              return x1.x.getTime() - x2.x.getTime()
            })

            extHumidityArray = extHumidityArray.sort((x1, x2) => {
              return x1.x.getTime() - x2.x.getTime()
            })

            extTemperatureArray = extTemperatureArray.sort((x1, x2) => {
              return x1.x.getTime() - x2.x.getTime()
            })



            var chartHumityTemperature = new CanvasJS.Chart("chartContainer", {
              zoomEnabled: true,
              animationEnabled: true,
              exportEnabled: true,
              title: {
                text: this.premise_name
              },
              subtitles: [{
                text: "Try Zooming and Panning"
              }],
              axisY: {
                title: "Humidity[%]",
              },
              axisY2: {
                title: "Temperature[C]", //TODO: definire unità 
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
                {
                  type: "line",
                  name: "External Humidity",
                  axisYType: "primary",
                  showInLegend: true,
                  dataPoints: extHumidityArray
                },
                {
                  type: "line",
                  name: "External Temperature",
                  axisYType: "secondary",
                  showInLegend: true,
                  dataPoints: extTemperatureArray
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
                title: "pH",
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
                  name: "pH",
                  axisYType: "primary",
                  showInLegend: true,
                  dataPoints: phArray
                },

              ]
            });


            var chartWindSpeed = new CanvasJS.Chart("chartContainerWindSpeed", {
              zoomEnabled: true,
              animationEnabled: true,
              exportEnabled: true,
              title: {
                text: "Wind Speed"
              },
              subtitles: [{
                text: "Try Zooming and Panning"
              }],
              axisY: {
                title: "WindSpeed[m/s]",
              },
              axisY2: {
                title: "Pressure[hPa]",
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
                  name: "WindSpeed",
                  axisYType: "primary",
                  showInLegend: true,
                  dataPoints: windSpeedArray
                },
                {
                  type: "line",
                  name: "Pressure",
                  axisYType: "secondary",
                  showInLegend: true,
                  dataPoints: pressureArray
                },


              ]
            });


            chartHumityTemperature.render();
            chartPH.render();
            chartWindSpeed.render();
          })





        })





      }
    })
  }



}




