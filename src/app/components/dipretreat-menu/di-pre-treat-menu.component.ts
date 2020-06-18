import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { Premise } from 'src/app/model/Premise';
import { Router } from '@angular/router';
import { PremiseService } from 'src/app/services/premises/premise.service';

@Component({
  selector: 'app-di-pre-treat-menu',
  templateUrl: './di-pre-treat-menu.component.html',
  styleUrls: ['./di-pre-treat-menu.component.css']
})
export class DiPreTreatMenuComponent implements OnInit {

  selectedValue: string;
  premises$: Observable<Premise>

  constructor(
    public authService: AuthService,
    private router: Router,
    private premiseService: PremiseService) { }

  ngOnInit(): void {
    this.premises$ = this.premiseService.getAllPremises()
    this.premises$.subscribe(
      (success) => console.log("Get Premises success"),
      (error) => console.log("Get Premises failed"),
      () => console.log("completed"))
  }

  premiseSelected(premiseName:string){
    this.router.navigate(['premiseDetails'],{queryParams:{premiseName: premiseName}})
  }

  logout() {
    // this.authService.logout()
    this.router.navigate(['home'])
  }

}
