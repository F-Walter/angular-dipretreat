import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
// import { API } from '../../../environments/environment'


const users = [
  {
    email: "dipretreat@dipretreat.it",
    password: "dipretreat"
  }
]



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userMail: string


  constructor(private http: HttpClient, private router: Router) {

  }

  isLogged() {
    return true 
  }


  login(email: string, password: string) {
    let validUser = false
    users.forEach(u => {
      if (u.email === email) {
        if (u.password === password){
          validUser = true
          this.userMail = email
        }
         

      }
    })
    return validUser
  }

  logout() {
    this.userMail = null
  }
}
