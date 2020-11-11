import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dipretreat-toolbar',
  templateUrl: './dipretreat-toolbar.component.html',
  styleUrls: ['./dipretreat-toolbar.component.css']
})
export class DipretreatToolbarComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }


  logout() {
    // this.authService.logout()
    this.router.navigate(['home'])
  }

}
