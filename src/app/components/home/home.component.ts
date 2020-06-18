import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';


const navLinks = [
  {
    label: 'DiPreTreatHome',
    link:'DiPreTreatHome',
  }
  // {
  //   label: 'Students',
  //   link: 'teacher/course/applicationi-internet/students',
  //   index: 2
  // },
  // {
  //   label: 'VM\'s',
  //   link: 'teacher/course/applicationi-internet/vms',
  //   index: 3
  // },
  // {
  //   label: 'Groups',
  //   link: 'teacher/course/applicazioni-internet/groups',
  //   index: 1
  // },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  opened = false // if the sidenav should be opened or not

  navLinks: any[]

  constructor(public authService: AuthService) {

    this.navLinks = navLinks
  }
  ngOnInit(): void {
  }



  // toggleForMenuClick() {
  //   console.log(this.opened)
  //   this.opened = !this.opened
  // }


}
