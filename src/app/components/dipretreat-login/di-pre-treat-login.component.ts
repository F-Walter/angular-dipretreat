import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-di-pre-treat-login',
  templateUrl: './di-pre-treat-login.component.html',
  styleUrls: ['./di-pre-treat-login.component.css']
})
export class DiPreTreatLoginComponent implements OnInit {

  //user is logegd?
  logged:boolean

  email: FormControl
  password: FormControl
  form: FormGroup

  hide: boolean //if the password should be hidden or not
  closed: boolean  // alert dialog closed attribute

  constructor(
    private authService: AuthService,
    private router: Router) {



    this.logged = authService.isLogged()

    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)])

    this.form = new FormGroup(
      {
        email: this.email,
        password: this.password
      }
    )

    this.hide = true
    this.closed = true

  }

  ngOnInit(): void {
  }


  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    return "The password must be at least of " + this.password.errors.minlength.requiredLength + " characters."
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Validation")

      if(this.authService.login(this.form.value['email'], this.form.value['password'])){
        this.loginSuccessful()
        //Login successful
        this.router.navigate(['/DiPreTreatHome', {}]);
      }else{
        this.loginFailed()
      }


      /*.subscribe(
        (authResult) => {
          //LOGIN SUCCESSFUL
          this.loginSuccessful()
        },
        //LOGIN FAILED //va inserito nel dialog
        (err) => {
          console.log("AUTH ERROR");
          this.loginFailed()
        }
      )*/

    } else { //TODO: avvisa che c'è stato un errore
      console.log("FORM IS NOT VALID")


      this.loginFailed()
    }
  }

  onCancel() {
   
    this.router.navigate(['home'])
  }

  loginSuccessful() {
    this.logged = true // user is logged
    this.closed = true // close alert dialog  
    //navigateToNextPage
    this.router.navigate(['DiPreTreatHome'])
  }
  loginFailed() {
    this.logged = false //user is not logged
    this.closed = false // open alert dialog  
  }


}
