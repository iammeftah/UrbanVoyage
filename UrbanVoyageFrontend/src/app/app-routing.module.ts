import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AuthPageComponent} from "./pages/auth-page/auth-page.component";
import {RoutesPageComponent} from "./pages/routes-page/routes-page.component";
import {BookingPageComponent} from "./pages/booking-page/booking-page.component";
import {SchedulesPageComponent} from "./pages/schedules-page/schedules-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'homepage', component: HomePageComponent },
  { path: 'routes', component: RoutesPageComponent },
  { path: 'booking', component: BookingPageComponent },
  { path: 'schedules', component: SchedulesPageComponent },
  { path: 'auth', component: AuthPageComponent },
  // autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
