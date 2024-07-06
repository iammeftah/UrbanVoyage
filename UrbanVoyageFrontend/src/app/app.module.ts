import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { HeaderComponent } from './components/header/header.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DarkModeToggleComponent } from './objects/dark-mode-toggle/dark-mode-toggle.component';
import { FooterComponent } from './components/footer/footer.component';
import { RoutesPageComponent } from './pages/routes-page/routes-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { SchedulesPageComponent } from './pages/schedules-page/schedules-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AuthPageComponent,
    HeaderComponent,
    DarkModeToggleComponent,
    FooterComponent,
    RoutesPageComponent,
    BookingPageComponent,
    SchedulesPageComponent,
    CarouselComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterOutlet
  ],
  providers: [
    /*
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    */
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
