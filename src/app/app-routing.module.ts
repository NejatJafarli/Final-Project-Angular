import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { CarDetailsComponent } from './car-details/car-details.component';
import { CarsComponent } from './cars/cars.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: CarsComponent },
  { path: 'cars', component: CarsComponent },
  { path: 'cardetail/:id', component: CarDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
