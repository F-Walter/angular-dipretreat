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

  getPremiseData(premiseId: string, startDate: string = "2020-01-04", endDate: String = "2020-04-09") {
    //for now the URL is fixed
    return this.http.get(`http://icowms.cloud.reply.eu/sensordata/getFiltered?start=${startDate}&stop=${endDate}&building=${premiseId}`).pipe(
      retry(3),
      catchError(err => of([])),
    )
  }

  getAllPremises() {
    return this.http.get(API_PREMISES.PREMISES).pipe(
      retry(3),
      catchError(err => of([])))
  }
}