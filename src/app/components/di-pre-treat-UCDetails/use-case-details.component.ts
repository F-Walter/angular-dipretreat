import { Component, OnInit } from '@angular/core';


//For now values in the db are provided statically, later will be provided from a service
const ELEMENT_DATA = [
  {state: 1, item: 'Hydrogen', hour: 1.00, problem: 'H'},
  {state: 2, item: 'Helium', hour: 4.00, problem: 'He'},
  {state: 3, item: 'Lithium', hour: 6.94, problem: 'Li'},
  {state: 4, item: 'Beryllium', hour: 9.01, problem: 'Be'},
  {state: 5, item: 'Boron', hour: 10.51, problem: 'B'},
  {state: 6, item: 'Carbon', hour: 12.01, problem: 'C'},
  {state: 7, item: 'Nitrogen', hour: 14.00, problem: 'N'},
  {state: 8, item: 'Oxygen', hour: 15.33, problem: 'O'},
  {state: 9, item: 'Fluorine', hour: 18.38, problem: ''},
  {state: 10, item: 'Neon', hour: 20.17, problem: ''},
];

@Component({
  selector: 'app-use-case-details',
  templateUrl: './use-case-details.component.html',
  styleUrls: ['./use-case-details.component.css']
})
export class UseCaseDetailsComponent implements OnInit {

  displayedColumns: string[] = ['state', 'item','hour', 'problem'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
