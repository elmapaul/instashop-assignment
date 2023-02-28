import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) return; 

    const username = form.value.username;
    const password = form.value.password;

    this.authService.login(username, password)
      .subscribe(resData => this.router.navigate(['/']),
        errorMessage => { this.error = errorMessage; }
      );

    form.reset();
  }
}
