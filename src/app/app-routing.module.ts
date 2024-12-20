import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './myComponents/home/home.component';
import { CountriesComponent } from './myComponents/countries/countries.component';
import { LoginComponent } from './myComponents/login/login.component';
import { FarmsComponent } from './myComponents/farms/farms.component';
import { FarmersComponent } from './myComponents/farmers/farmers.component';
import { SchedulesComponent } from './myComponents/schedules/schedules.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },        // Redirect root ('') to '/login'
  { path: 'login', component: LoginComponent },                // Route for Login
  { path: 'home', component: HomeComponent },                  // Route for Home
  { path: 'countries', component: CountriesComponent },        // Route for Countries
  { path: 'farms', component: FarmsComponent},                 // Route for Farms
  { path: 'farmers', component: FarmersComponent},             // Route for Farmers
  { path: 'schedules', component: SchedulesComponent}          // Route for Schedules
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
