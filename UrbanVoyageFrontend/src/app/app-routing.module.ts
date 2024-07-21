import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AuthPageComponent} from "./pages/auth-page/auth-page.component";
import {RoutesPageComponent} from "./pages/routes-page/routes-page.component";
import {BookingPageComponent} from "./pages/booking-page/booking-page.component";
import {SchedulesPageComponent} from "./pages/schedules-page/schedules-page.component";
import {OurServicePageComponent} from "./pages/our-service-page/our-service-page.component";
import {ContactPageComponent} from "./pages/contact-page/contact-page.component";
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {VerifyEmailComponent} from "./pages/verify-email/verify-email.component";
import {BackofficePageComponent} from "./pages/backoffice-page/backoffice-page.component";
import { AdminGuard } from './guards/admin.guard';
import { UnauthorizedPageComponent } from './pages/unauthorized-page/unauthorized-page.component';
import {SuccessPaymentComponent} from "./pages/success-payment/success-payment.component";
import {CancelPaymentComponent} from "./pages/cancel-payment/cancel-payment.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'homepage', component: HomePageComponent },
  { path: 'routes', component: RoutesPageComponent },
  { path: 'booking', component: BookingPageComponent },
  { path: 'schedules', component: SchedulesPageComponent },
  { path: 'services', component: OurServicePageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'booking', component: BookingPageComponent },
  {
    path: 'backoffice',
    component: BackofficePageComponent,
    canActivate: [AdminGuard]
  },

  { path: 'unauthorized', component: UnauthorizedPageComponent },
  { path: 'success', component: SuccessPaymentComponent },

  { path: 'cancel', component: CancelPaymentComponent },





  // autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
