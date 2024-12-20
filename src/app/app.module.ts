import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';  
import { FormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './myComponents/login/login.component';
import { HomeComponent } from './myComponents/home/home.component';
import { CountriesComponent } from './myComponents/countries/countries.component';
import { FarmsComponent } from './myComponents/farms/farms.component';
import { FarmersComponent } from './myComponents/farmers/farmers.component';
import { SchedulesComponent } from './myComponents/schedules/schedules.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CountriesComponent,
    FarmsComponent,
    FarmersComponent,
    SchedulesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  
    FormsModule,    
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
