import { Component, OnInit } from '@angular/core';


//For now values in the db are provided statically, later will be provided from a service
const ELEMENT_DATA = [
  {state: 1, item: 'Hydrogen', hour: 1.0079, problem: 'H'},
  {state: 2, item: 'Helium', hour: 4.0026, problem: 'He'},
  {state: 3, item: 'Lithium', hour: 6.941, problem: 'Li'},
  {state: 4, item: 'Beryllium', hour: 9.0122, problem: 'Be'},
  {state: 5, item: 'Boron', hour: 10.811, problem: 'B'},
  {state: 6, item: 'Carbon', hour: 12.0107, problem: 'C'},
  {state: 7, item: 'Nitrogen', hour: 14.0067, problem: 'N'},
  {state: 8, item: 'Oxygen', hour: 15.9994, problem: 'O'},
  {state: 9, item: 'Fluorine', hour: 18.9984, problem: 'F'},
  {state: 10, item: 'Neon', hour: 20.1797, problem: 'Ne'},
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
