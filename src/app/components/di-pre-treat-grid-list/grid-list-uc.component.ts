import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';



export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

const navLinks = [
  {
    label: 'DiPreTreatUCChoice',
    link: 'DiPreTreatUCChoice',
  }
];

@Component({
  selector: 'grid-list-uc',
  templateUrl: './grid-list-uc.component.html',
  styleUrls: ['./grid-list-uc.component.css'],
})
export class GridListUCComponent {
  tryBool: boolean = false


  navLinks: any[]

  constructor(private router: Router) {

    this.navLinks = navLinks
  }

  buttons = [
    { text: 'UC-A', value: "A", color: 'primary' },
    { text: 'UC-B', value: "B", color: 'accent' },
    { text: 'UC-C', value: "C", color: 'warn' },
    { text: 'UC-D', value: "D", color: '' }
  ]


  onClickButton(useCase: string) {
    this.router.navigate(['UseCaseDetails'], { queryParams: { UC: useCase } })
  }
}