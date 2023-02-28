import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarkFormComponent } from './landmark-form/landmark-form.component';
import { LandmarkListComponent } from './landmark-list/landmark-list.component';
import { LoginComponent } from './login/login.component';
import { LandmarkPreviewComponent } from './landmark-preview/landmark-preview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landmarks',
    pathMatch: 'full'
  },
  {
    path: 'landmarks/edit/:id',
    component: LandmarkFormComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'landmarks/:id', 
    component: LandmarkPreviewComponent
  },
  {
    path: 'landmarks',
    component: LandmarkListComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
