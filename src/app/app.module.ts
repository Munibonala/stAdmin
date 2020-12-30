import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule, MatButtonModule, MatIconModule, MatStepperModule, MatDialogModule, 
  MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatRippleModule, MatButtonToggleModule, MatCheckboxModule, MatSnackBarModule, MatSelectModule, MatAutocompleteModule, MatChipsModule, MatCardModule} from '@angular/material'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AllTasksListComponent } from './components/all-tasks-list/all-tasks-list.component';
import { DeleteDailogComponent } from './components/delete-dailog/delete-dailog.component';
import { AlCustomersComponent } from './components/al-customers/al-customers.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { AllBookingsComponent } from './components/all-bookings/all-bookings.component';
import { CommentsDailogComponent } from './components/comments-dailog/comments-dailog.component';
import { OffersDailogComponent } from './components/offers-dailog/offers-dailog.component';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import {NgbDatepickerModule, NgbDatepickerMonth, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AccountVerificationModalComponent } from './components/account-verification-modal/account-verification-modal.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SendNotificationsDailogComponent } from './components/send-notifications-dailog/send-notifications-dailog.component';
import { ReportsComponent } from './components/reports/reports.component'
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ReferralsComponent } from './components/referrals/referrals.component';
import { UserRefferalDailogComponent } from './components/user-refferal-dailog/user-refferal-dailog.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    TaskDetailsComponent,
    SettingsComponent,
    AllTasksListComponent,
    DeleteDailogComponent,
    AlCustomersComponent,
    CustomerDetailsComponent,
    BookingDetailsComponent,
    AllBookingsComponent,
    CommentsDailogComponent,
    OffersDailogComponent,
    ReviewModalComponent,
    AccountVerificationModalComponent,
    NotificationsComponent,
    SendNotificationsDailogComponent,
    ReportsComponent,
    ReferralsComponent,
    UserRefferalDailogComponent
  ],
  entryComponents:[DeleteDailogComponent,CommentsDailogComponent,OffersDailogComponent,
    ReviewModalComponent,AccountVerificationModalComponent,SendNotificationsDailogComponent,
    UserRefferalDailogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatStepperModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    NgbDatepickerModule,
    ScrollingModule,
    MatAutocompleteModule,
    BsDatepickerModule.forRoot(),
    ChartsModule
  ],
  providers: [BsDatepickerConfig,BsDaterangepickerConfig,ThemeService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
