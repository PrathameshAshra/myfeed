import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './components/landingPage/landing-page.component';

const routes: Routes = [
  {
    path:'',redirectTo:'home',pathMatch :'full'
  },
  {
    path:'home',component:LandingPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
