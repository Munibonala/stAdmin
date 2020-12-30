import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
filtercustomer:string= "all";
reportsForm1:FormGroup;
providerForm:FormGroup;
bookingsForm:FormGroup;
referralForm:FormGroup;
dateRange:any;
fileName:string = "";
bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
taskStatus:string = "All"
  date = null;
  customerDetailsLink:string = "";
  bookingStatus:string = "All"
  @ViewChild('t',{static:false}) datePicker: NgbInputDatepicker;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  constructor(private adminService:AdminService, private  dialog:MatDialog,
    private fb:FormBuilder, private snackBar:MatSnackBar,private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
    this.reportsForm1 = this.fb.group({
      dateRange:["",Validators.required]
    })
    this.providerForm = this.fb.group({
      dateRange:["",Validators.required]
    })
    this.bookingsForm = this.fb.group({
      dateRange:["",Validators.required]
    })
    this.referralForm = this.fb.group({
      dateRange:["",Validators.required]
    })
  }

  changeView(event){
    this.filtercustomer = event.value;
    if(this.filtercustomer == "poster"){
    
    }else if(this.filtercustomer == "provider"){
      
    }else{ 
    }
  }
  bookingFilter(status){
    this.bookingStatus = status
  }
//message alerts showing
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
  
getFilteredReport1(){
  let frmDate = new Date(this.reportsForm1.value.dateRange[0]).getTime();
  let toDate = new Date(this.reportsForm1.value.dateRange[1]).getTime();

  frmDate = new Date(this.reportsForm1.value.dateRange[0]).setHours(0,0,0,0);
  toDate = new Date(this.reportsForm1.value.dateRange[1]).setHours(23,59,59,999);
  let obj = {
    reportType:"Customer",
    fromDate:""+ frmDate,
    toDate:""+ toDate
  }
  this.fileName = "customerReport.csv";
  this.getReports(obj);
console.log(this.reportsForm1.value.startDate[0],this.reportsForm1.value.startDate[1]);
}
getproviderDetails(){
  let frmDate = new Date(this.providerForm.value.dateRange[0]).getTime();
  let toDate = new Date(this.providerForm.value.dateRange[1]).getTime();

  frmDate = new Date(this.providerForm.value.dateRange[0]).setHours(0,0,0,0);
  toDate = new Date(this.providerForm.value.dateRange[1]).setHours(23,59,59,999);
  let obj = {
    reportType:"Provider",
    fromDate:""+ frmDate,
    toDate:""+ toDate
  }
  this.fileName = new Date(this.providerForm.value.dateRange[0]).toLocaleDateString()+"-"+new Date(this.providerForm.value.dateRange[1]).toLocaleDateString()+"providerReport.csv";
  this.getReports(obj)
} 
getBookings(){
  let frmDate = new Date(this.bookingsForm.value.dateRange[0]).getTime();
  let toDate = new Date(this.bookingsForm.value.dateRange[1]).getTime();
  frmDate = new Date(this.bookingsForm.value.dateRange[0]).setHours(0,0,0,0);
  toDate = new Date(this.bookingsForm.value.dateRange[1]).setHours(23,59,59,999);
  let obj = {
    reportType:"Bookings",
    reportStatus:this.bookingStatus,
    fromDate:""+ frmDate,
    toDate:""+ toDate
  }
  this.fileName = "bookingsReport.csv";
  this.getReports(obj)
}  
getReferrals(){
  let frmDate = new Date(this.referralForm.value.dateRange[0]).getTime();
  let toDate = new Date(this.referralForm.value.dateRange[1]).getTime();

  frmDate = new Date(this.referralForm.value.dateRange[0]).setHours(0,0,0,0);
  toDate = new Date(this.referralForm.value.dateRange[1]).setHours(23,59,59,999);
  let obj = {
    reportType:"Referral",
    fromDate:""+ frmDate,
    toDate:""+ toDate
  }
  this.fileName = "referralReport.csv";
  this.getReports(obj)
} 
getReports(obj){
  this.adminService.showLoader.next(true);
  let token = sessionStorage.getItem('token')
  this.adminService.downloadReports(obj,token).subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
    var blob = new Blob([posRes]);
    if (window.navigator.msSaveOrOpenBlob){
      window.navigator.msSaveBlob(blob, this.fileName);
    }
    else {
      var a = window.document.createElement("a");
  
      a.href = window.URL.createObjectURL(blob);
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  },(err:HttpErrorResponse)=>{
    if(err.error instanceof Error){
      console.warn("Client Error",err.message);
    }else{
      console.warn("Server Error",err.message);
    }
  })
}

}
