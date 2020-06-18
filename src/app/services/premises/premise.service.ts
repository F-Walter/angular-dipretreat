import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/environments/environment';
import { Observable, of, from } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PremiseService {
  getPremiseData(premiseName: string) {
    //for now the URL is fixed
    return this.http.get(API.PREMISES_DATA).pipe(
      catchError(err => of([])),
     )
  }

  constructor(private http: HttpClient) { }



  getAllPremises() {
    return this.http.get(API.PREMISES).pipe(
      catchError(err => of([])))
  }
}