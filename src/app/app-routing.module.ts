import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './Home/homepage.component';
import { ContactuspageComponent } from './ContactUs/contactuspage.component';

const routes: Routes = 
[
  {path:'home',component:HomepageComponent},
  {path:'contact-us',component:ContactuspageComponent},
  {path:'',component:HomepageComponent,pathMatch:"full"},
  {path:'**',component:HomepageComponent,pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
