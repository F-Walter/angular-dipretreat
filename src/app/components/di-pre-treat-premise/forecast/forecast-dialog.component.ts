import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forecast-dialog',
  templateUrl: './forecast-dialog.component.html',
  styleUrls: ['./forecast-dialog.component.css']
})
export class ForecastDialogComponent implements OnInit {

  datesForm: FormGroup

  closedAlert: boolean


  constructor(
    public dialogRef: MatDialogRef<ForecastDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.closedAlert = true

    this.datesForm = new FormGroup(
      {
        startDate: new FormControl(new Date(), Validators.required),
        endDate: new FormControl('', Validators.required),
      })
  }

  ngOnInit(): void {
  }


  onSubmitClick(): void {
    this.dialogRef.close();
  }

  submit() {
    console.log()
  }



}
