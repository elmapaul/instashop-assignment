import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User | null = null;
  // @ts-ignore
  private userSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.userSub = this.authService.user.subscribe(user => this.user = user);
  }

  logOut() {
    this.authService.logOut().subscribe();
    this.user = null;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
