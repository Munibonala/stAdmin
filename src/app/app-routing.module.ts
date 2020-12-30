import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AllTasksListComponent } from './components/all-tasks-list/all-tasks-list.component';
import { AlCustomersComponent } from './components/al-customers/al-customers.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { AllBookingsComponent } from './components/all-bookings/all-bookings.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReferralsComponent } from './components/referrals/referrals.component';


const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"admin",component:AdminComponent,children:[
    {path:"dashboard",component:DashboardComponent},
    {path:"settings",component:SettingsComponent},
    {path:"task_list",component:AllTasksListComponent},
    {path:"customers",component:AlCustomersComponent},
    {path:"referrals",component:ReferralsComponent},
    {path:"allBookings",component:AllBookingsComponent},
    {path:"reports",component:ReportsComponent},
    {path:"notifications",component:NotificationsComponent},
    {path:"booking/:id",component:BookingDetailsComponent},
    {path:"details/:id",component:TaskDetailsComponent},
    {path:"customer/:id",component:CustomerDetailsComponent},
    {path:"**",redirectTo:"allBookings",pathMatch:"full" }
  ]},
  {path:"**",redirectTo:"login",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
