import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarkFormComponent } from './landmark-form/landmark-form.component';
import { LandmarkListComponent } from './landmark-list/landmark-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landmarks',
    pathMatch: 'full'
    // component: LandmarkListComponent,
  },
  {
    path: 'landmarks',
    component: LandmarkListComponent,
  },
  {
    path: 'landmarks/edit/:id',
    component: LandmarkFormComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'classes/landmarks/:id', 
    component: LandmarkFormComponent, 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
