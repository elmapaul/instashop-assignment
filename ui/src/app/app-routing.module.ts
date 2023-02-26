import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarkFormComponent } from './landmark-form/landmark-form.component';
import { LandmarkListComponent } from './landmark-list/landmark-list.component';

const routes: Routes = [
  {
    path: '',
    component: LandmarkListComponent,
  },
  {
    path: 'landmarks/add',
    component: LandmarkFormComponent,
  },
  {
    path: 'landmarks/edit/:id',
    component: LandmarkFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
