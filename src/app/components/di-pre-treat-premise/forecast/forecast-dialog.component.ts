import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PremiseService } from 'src/app/services/premises/premise.service';

@Component({
  selector: 'app-forecast-dialog',
  templateUrl: './forecast-dialog.component.html',
  styleUrls: ['./forecast-dialog.component.css']
})
export class ForecastDialogComponent implements OnInit {

  datesForm: FormGroup

  closedAlert: boolean
  historicalData: [];


  constructor(
    private premiseService: PremiseService,
    public dialogRef: MatDialogRef<ForecastDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.historicalData = data.historicalData

    this.closedAlert = true

    this.datesForm = new FormGroup(
      {
        startDate: new FormControl(new Date(), Validators.required),
        endDate: new FormControl(new Date(), Validators.required),
      })
  }

  ngOnInit(): void {
  }


  onSubmitClick(): void {
    this.dialogRef.close();
  }

  submit() {
    console.log("QUI", this.historicalData)
    this.premiseService.sendForecastRequest(this.datesForm.get('startDate').value, this.datesForm.get('endDate').value, this.historicalData)
  }



}
