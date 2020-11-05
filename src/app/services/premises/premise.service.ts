import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICOWMS as ICOWMS } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Premise } from 'src/app/model/Premise';


@Injectable({
  providedIn: 'root'
})
export class PremiseService {

  constructor(private http: HttpClient) { }

  getPremiseSensorData<Sensor>(premiseId: string, startDate: string = "2020-01-04", endDate: String = "2020-04-09"): Observable<Sensor[]> {
    //for now the URL is fixed
    return this.http.get<Sensor[]>(`${ICOWMS}/sensordata/getFiltered?start=${startDate}&stop=${endDate}&building=${premiseId}`).pipe(
      retry(3),
      catchError(err => of([])),
    )
  }

  getAllPremises<Premise>(): Observable<Premise[]> {
    return this.http.get<Premise[]>(`${ICOWMS}/sensordata/premises`).pipe(
      retry(3),
      catchError(err => of([])))
  }


  // For the moment it is not necessary anymore
  getHistoricalPremiseData(premiseId: string): Observable<any> {
    let url = `${ICOWMS}/sensordata/getAllFilteredSensData?building=${premiseId}`

    return this.http.get(url).pipe(
      retry(3),
      catchError(err => of([])))
  }
}

export interface ForecastInterface {
  date: string,
  value: number
  error: number
}