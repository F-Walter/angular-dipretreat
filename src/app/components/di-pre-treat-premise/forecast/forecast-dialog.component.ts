import { Component, OnInit, Inject, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PremiseService } from 'src/app/services/premises/premise.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-forecast-dialog',
  templateUrl: './forecast-dialog.component.html',
  styleUrls: ['./forecast-dialog.component.css']
})
export class ForecastDialogComponent implements OnInit {

  datesForm: FormGroup

  closedAlert: boolean
  forecastSubmitted: boolean
  premiseId: string
  src: SafeResourceUrl
  today: Date
  oneYearLater: Date;

  constructor(
    private premiseService: PremiseService,
    public dialogRef: MatDialogRef<ForecastDialogComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data) {


    this.closedAlert = true
    this.forecastSubmitted = false

    this.today = new Date()
    let temp = new Date()

    temp.setFullYear(this.today.getFullYear() + 1)

    this.oneYearLater = temp

    if (this.data.premiseId) this.premiseId = this.data.premiseId

    this.datesForm = new FormGroup(
      {
        start: new FormControl(this.today, Validators.required),
        end: new FormControl(this.oneYearLater, Validators.required),
      })
  }

  ngOnInit(): void {
  }


  /* onSubmitClick(): void {
     this.dialogRef.close();
   }*/

  confirmForecast() {
    console.log("start " + this.convertDateToStringFormat(this.datesForm.get('start').value), "time" + this.datesForm.get('start').value.getTime());

    if (this.datesForm.get('start').value.getTime() > this.datesForm.get('end').value.getTime()) {
      //ERRORE
      //TODO mostrare messaggio errore
      console.log("ERRORE start>end");

    } else {
      //OK
      this.forecastSubmitted = true
      //this.premiseService.sendForecastRequest(this.datesForm.get('start').value, this.datesForm.get('end').value, this.premiseId)
      let url = `https://dipretreatapi.azurewebsites.net/api/predict/?start=${this.convertDateToStringFormat(this.datesForm.get('start').value)}&end=${this.convertDateToStringFormat(this.datesForm.get('end').value)}&building_id=${this.premiseId}&code=vM74fJfsAI1mhf92mWAJguSv2H3gxJ8FsmAcaqdyMDT06WfKzHp1aw==`
      //TODO rimuovere commento e dinamicizzare URL
      //this.src = url
      this.src ="https://dipretreatapi.azurewebsites.net/api/predict/?start=2019-01-01&end=2021-01-01&building_id=0&code=vM74fJfsAI1mhf92mWAJguSv2H3gxJ8FsmAcaqdyMDT06WfKzHp1aw=="
      console.log(this.src);
    }

  }



  convertDateToStringFormat(selectedDate: Date) {
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
