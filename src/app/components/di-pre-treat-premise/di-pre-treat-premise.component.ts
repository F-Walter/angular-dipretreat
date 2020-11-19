import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PremiseService } from 'src/app/services/premises/premise.service';
import { map, catchError } from 'rxjs/operators';
import { Sensor } from 'src/app/model/Sensor';
import * as CanvasJS from '../../external-libraries/canvasjs.min.js';
import { Point } from 'src/app/model/Point.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ForecastDialogComponent } from './forecast/forecast-dialog.component.js';
import { Premise } from 'src/app/model/Premise.js';

@Component({
  selector: 'app-di-pre-treat-premise',
  templateUrl: './di-pre-treat-premise.component.html',
  styleUrls: ['./di-pre-treat-premise.component.css']
})
export class DiPreTreatPremiseComponent implements OnInit {

  activatedRoutesSubscription: Subscription

  isAllLoaded: boolean
  premiseId: string
  datesForm: FormGroup
  startDateSelected: string
  endDateSelected: string


  message: string
  alertType: string

  //Premise information

  premise_id: string
  premise_name: string
  premise_geom: string
  last_maintanance: string
  corrosion_level: string
  last_inspection: string
  creation_year: string
  today: Date
  warningTemperature: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private premiseService: PremiseService,
    fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {

    this.today = new Date()

    this.message = ""
    this.warningTemperature = false
    this.isAllLoaded = false

    this.datesForm = fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.activatedRoutesSubscription = this.activatedRoute.queryParams.subscribe((param) => {
      if (param['premiseId']) {
        this.premiseId = param['premiseId']

        if (param['startDate']) {
          this.startDateSelected = param['startDate']
          this.datesForm.get('startDate').setValue(this.startDateSelected)
        }
        else {
          // The field was not defined => startDate = one month ago 
          let oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          this.startDateSelected = this.convertDateToStringFormat(oneMonthAgo)
          this.datesForm.get('startDate').setValue(oneMonthAgo)
        }

        if (param['endDate']) {
          this.endDateSelected = param['endDate']
          this.datesForm.get('endDate').setValue(this.endDateSelected)
        }
        else {
          // The field was not defined => endDate = today 
          this.endDateSelected = this.convertDateToStringFormat(this.today)
          this.datesForm.get('endDate').setValue(this.today)
        }




        this.premiseService.getPremiseSensorData(this.premiseId, this.startDateSelected, this.endDateSelected).subscribe((sensorData: Sensor[]) => {
          let sensors: Sensor[] = []

          for (let i = 0; i < sensorData.length; i++) {
            sensors.push(new Sensor(
              sensorData[i].sensor_description,
              sensorData[i].sensor_data,
              sensorData[i].sensor_timestamp,
              sensorData[i].sensor_coord,
              sensorData[i].premises_name))
          }

          this.isAllLoaded = true

          // arrayData = arrayData.slice(0, 10000)  //se si vuole limitare i dati
          // console.log(arrayData)
          let ph1Array = []
          let ph2Array = []
          let ph3Array = []
          let humidityArray = []
          let temperatureArray = []
          let windSpeedArray = []
          let pressureArray = []
          let extHumidityArray = []
          let extTemperatureArray = []
          let y;
          let x;

          // console.log(arrayData);


          for (let i = 0; i < sensors.length; i++) {

            y = sensors[i].sensor_data; // measurment value
            x = new Date(sensors[i].sensor_timestamp); // timestamp

            let p: Point = new Point(x, y)

            switch (sensors[i].sensor_description) {
              //Duplicated data are avoided
              case 'pH1':
                if (!ph1Array.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  ph1Array.push(p)
                break;
              case 'pH2':
                if (!ph2Array.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  ph2Array.push(p)
                break;
              case 'pH3':
                if (!ph3Array.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  ph3Array.push(p)
                break;
              case 'humidity':
                if (!humidityArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y))))
                  humidityArray.push(p)
                break;
              case "temperature":
                if (!temperatureArray.some(data => ((data.x.getTime() == p.x.getTime()) && (data.y == p.y)))) {
                  temperatureArray.push(p)
                  if (p.y < -30 && p.y > 50) {
                    this.warningTemperature = true
                  }
                }
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

          //Sort all arrays before showing
          humidityArray = humidityArray.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          temperatureArray = temperatureArray.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          ph1Array = ph1Array.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          ph2Array = ph2Array.sort((x1, x2) => {
            return x1.x.getTime() - x2.x.getTime()
          })

          ph3Array = ph3Array.sort((x1, x2) => {
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
                name: "pH1",
                axisYType: "primary",
                showInLegend: true,
                dataPoints: ph1Array
              },
              {
                type: "line",
                name: "pH2",
                axisYType: "primary",
                showInLegend: true,
                dataPoints: ph2Array
              },
              {
                type: "line",
                name: "pH3",
                axisYType: "primary",
                showInLegend: true,
                dataPoints: ph3Array
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


        // Get information about the premise shown
        this.premiseService.getAllPremises().subscribe((premises: Premise[]) => {

          let premise = premises.find((p) => p.premises_id == this.premiseId)

          if (premise) {
            //if premise is defined
            if (premise.premises_id)
              this.premise_id = premise.premises_id
            if (premise.premises_name)
              this.premise_name = premise.premises_name;
            if (premise.premises_geom)
              this.premise_geom = "Lat " + premise.premises_geom.x + " - Lng " + premise.premises_geom.y;
            if (premise.last_maintanance)
              this.last_maintanance = premise.last_maintanance;
            if (premise.corrosion_level == 0 || premise.corrosion_level)
              this.corrosion_level = `${premise.corrosion_level}`;
            if (premise.last_inspection)
              this.last_inspection = premise.last_inspection;
            if (premise.creation_year)
              this.creation_year = premise.creation_year.substring(0, 10);

          }


        })
      }
    })
  }




  private openDialog(premiseId: string): void {
    const dialogRef = this.dialog.open(ForecastDialogComponent, {
      width: '75%',
      height: '90%',
      data: { premiseId: premiseId }
    });
  }

  changeSelectedDate(date: Date) {
    // console.log(date.toISOString().substring(0, 10))
  }

  /**
   * Metodo usato per inviare richiesta e ottenere nuovi grafici
   */
  confirm() {
    let startDate = new Date(this.datesForm.get('startDate').value)
    let endDate = new Date(this.datesForm.get('endDate').value)

    //console.log(startDate, endDate, this.convertDateToStringFormat(startDate), this.convertDateToStringFormat(endDate))

    if (startDate.getTime() > endDate.getTime()) {
      //errore data inizio > data fine
      this.message = "The inserted dates are not in the right order."
      this.alertType = "danger"
    } else {
      this.message = ""
      this.alertType = ""
      this.isAllLoaded = false
      // faccio ricaricare il componente con i dati corretti
      this.router.navigate([
        "/premiseDetails"],
        {
          queryParams: {
            premiseId: this.premiseId,
            startDate: this.convertDateToStringFormat(startDate),
            endDate: this.convertDateToStringFormat(endDate)
          }
        })

    }

  }




  //TODO: integration with other company
  submitCorrosionForcast() {
    console.log("Corrosion Forecast " + this.premiseId);
    this.openDialog(this.premiseId);
  }

  private convertDateToStringFormat(selectedDate: Date) {
    let month = selectedDate.getMonth() + 1
    let date = selectedDate.getDate()
    let formattedMonth = ""
    let formattedDate = ""
    if (month < 10)
      formattedMonth = `0${month}`
    else
      formattedMonth = `${month}`
    if (date < 10)
      formattedDate = `0${date}`
    else
      formattedDate = `${date}`
    return `${selectedDate.getFullYear()}-${formattedMonth}-${formattedDate}`
  }
}





