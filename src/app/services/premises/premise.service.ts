import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREMISES } from 'src/environments/environment';
import { Observable, of, from } from 'rxjs';
import { catchError, mergeMap, map, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PremiseService {

  constructor(private http: HttpClient) { }

  getPremiseData(premiseId: string, startDate: string = "2020-01-04", endDate: String = "2020-04-09"): Observable<any> {
    //for now the URL is fixed
    return this.http.get(`http://icowms.cloud.reply.eu/sensordata/getFiltered?start=${startDate}&stop=${endDate}&building=${premiseId}`).pipe(
      retry(3),
      catchError(err => of([])),
    )
  }

  getAllPremises(): Observable<any> {
    return this.http.get(API_PREMISES.PREMISES).pipe(
      retry(3),
      catchError(err => of([])))
  }


  getHistoricalPremiseData(premiseId: string): Observable<any> {
    let url = `http://icowms.cloud.reply.eu/sensordata/getAllFilteredSensData?building=${premiseId}`

    return this.http.get(url).pipe(
      retry(3),
      catchError(err => of([])))
  }

/*  sendForecastRequest(startDate: Date, endDate: Date, premiseId: string): Observable<ForecastInterface[]> {
    //TODO da sistemare
    
    let url = `/prediction`
    let start = startDate.toISOString().substring(0, 10);
    let end = endDate.toISOString().substring(0, 10);

    return this.http.post<ForecastInterface[]>(url, { start_date: start, end_date: end, data: premiseId }).pipe(
      retry(3),
      catchError(err => of([])))
  }*/

}

export interface ForecastInterface {
  date: string,
  value: number
  error: number
}