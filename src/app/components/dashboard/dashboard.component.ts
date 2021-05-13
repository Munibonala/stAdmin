import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/admin.service';
import { Router } from '@angular/router';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  filteredData:Array<any> = [];
  jobs:Array<any> =[];
  quickResult:Array<any> = [];
  status:any = {
    getTypeFilter: "thisYear"
  };
  categorystatus:any = {
    getTypeFilter: "thisYear"
  };
  bookingsForm:FormGroup;
  label:any;
  isBookingDateRange:boolean = false;
  postOverViewForm:FormGroup;
  bookingData:any ;
  isLocationBase:boolean = false;
  maxDate:any = new Date();
  isPostJobDateRange:boolean = false
  //Line Chart Codes
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July','Aug','Sep','Oct','Nov','Dec'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            display: true,
          },
          gridLines: {
            color: "rgba(0, 0, 0,0)"
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            display: true,
            beginAtZero: true,
            stepSize :1
          },
          gridLines: {
            color: "rgba(0, 0, 0,0)"
          }
        }
      ]
    },
    elements: 
    { 
        point: 
        {
            radius: 8,
            hitRadius: 40,
            hoverRadius: 10,
            hoverBorderWidth: 5
        }
    },
    legend: {
      position: 'top',
      labels: {
        fontSize: 10,
        usePointStyle: true
      }
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'skyblue',
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
// Bar Charts Code
chartOptions = {
  responsive: true,
     legend: {
    position: 'top',
    labels: {
      fontSize: 10,
      usePointStyle: true
    }
  },
   scales: {
      xAxes: [{
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }
      }],
      yAxes: [{
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }   
      }]
  }
};
public barChartLabels: Label[] = ['AC','Admin','Baby Sitting','Cleaning', 'Design', 'Electrition','Assembling',
'Handyman','Mini Task','More','Moving','Painter','Photographer','Plumber','Promoter','Waiter/Waitress'];
public barChartLabelsLocation: Label[]
public barChartType: ChartType = 'horizontalBar';
public barChartLegend = true;

public barChartData: ChartDataSets[] = [];
public barChartDataLocation: ChartDataSets[] = [];

public barChartColors: Color[] = [
  { backgroundColor: ['aqua','#00afaa','#6abf4a','#93d501','#cede01','#843274','#ffd101','#c9a978','#ff671c',
                    '#fa0e0e','#843274','green','yellow','#cede01','orange','#dc3545','#3f51b5','#00afaa','#6abf4a','#93d501','#cede01','#ffd101'] }
]

  constructor(private adminService:AdminService,private router:Router, private fb:FormBuilder,private snackBar:MatSnackBar) { }

  ngOnInit() {
    
    this.browseCategory()
    this.bookingsForm = this.fb.group({
      dateRange:["",Validators.required]
    })
    this.postOverViewForm = this.fb.group({
      dateRange:["",Validators.required]
    })
    this.getStatuses()
    this.getBookingStatus();
    this.getCatStatus()
  }
  // Browse Category
browseCategory(){
  this.adminService.showLoader.next(true);
  this.adminService.browseCategory().subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
    if(posRes.response == 3){
      let categories = []
       
      posRes.categoriesList.forEach(val=>{
         return categories.push(val.categoryName)
       })
     
      this.barChartLabels = categories.sort();
    }else{
      this.openSnackBar(posRes.message,"")
    }
  },(err:HttpErrorResponse)=>{
    this.adminService.showLoader.next(false);
    this.openSnackBar(err.message,"");
    if(err.error instanceof Error){
      console.warn("CSE",err.message);
    }else{
      console.warn("SSE",err.message);
      
    }
  })
}
showPendingVerification(status){
    this.router.navigate(['/admin','customers'], { queryParams: { search_term: status } });
}
 //message alerts showing
 openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
  getStatuses(){
    this.adminService.showLoader.next(true);
    let token = sessionStorage.getItem('token')
    this.adminService.fetchStatus(token).subscribe((posRes)=>{
      if(posRes.response == 3){
        this.quickResult = posRes.results;
        console.log("results",this.quickResult);
      }else{
        this.openSnackBar(posRes.message,"")
      }
      
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
  getThisYear(){
    this.isBookingDateRange = false;
this.status = {
  getTypeFilter : "thisYear"
}
let label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July','Aug','Sep','Oct','Nov','Dec'];
this.lineChartLabels = label;
this.getBookingStatus()
  }
  getThisMonth(){
    this.isBookingDateRange = false;
    this.status = {
      getTypeFilter : "thisMonth"
    }
    let label = ['1', '2', '3', '4', '5', '6', '7','8','9','10','11', '12', 
    '13', '14', '15', '16', '17','18','19','20','21', '22', '23', '24', 
    '25', '26', '27','28','29','30','31'];
    this.lineChartLabels = label;
    this.getBookingStatus()
  }
  getThisWeek(){
    this.isBookingDateRange = false;
    this.status = {
      getTypeFilter : "thisWeek"
    }
    let label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    this.lineChartLabels = label;
    this.getBookingStatus()
      }
      getBookingByRange(){
        this.isBookingDateRange = true;
        // this.status = {
        //   getTypeFilter : "[1598400000,1600905599]"
        // }
        let frmDate = new Date(this.bookingsForm.value.dateRange[0]).getTime();
        let toDate = new Date(this.bookingsForm.value.dateRange[1]).getTime();
        frmDate = new Date(this.bookingsForm.value.dateRange[0]).setHours(0,0,0,0);
        toDate = new Date(this.bookingsForm.value.dateRange[1]).setHours(23,59,59,999);
        this.status = {
          getTypeFilter :  JSON.stringify([frmDate,toDate])
        }
        console.log(this.status);
        
      this.getBookingStatus()
        
      }
  getBookingStatus(){
    this.adminService.showLoader.next(true);
    this.lineChartData = []
    let token = sessionStorage.getItem('token');
    this.adminService.fetchBookingStatus(this.status,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      console.log("Booking",posRes);
      if(posRes.response == 3){
        if(!this.isBookingDateRange){
          this.bookingData = posRes.result;
          this.lineChartData = [this.bookingData];
        }else{
          this.bookingData = {label:"Date Range",data:Object.values(posRes.result.data[0])};
          
          this.lineChartLabels = Object.keys(posRes.result.data[0])
          this.lineChartData = [this.bookingData];

        }
      }else{
        this.openSnackBar(posRes.message,"");
      } 
    },(err:HttpErrorResponse)=>{
      this.openSnackBar(err.message,"");
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
  getThisYearPosts(){
    this.categorystatus = {
      getTypeFilter : "thisYear"
    }
    this.getCatStatus()
  }
  getThisMonthPosts(){
    this.categorystatus = {
      getTypeFilter : "thisMonth"
    }
    this.getCatStatus()
  }
  getThisWeekPosts(){
    this.categorystatus = {
      getTypeFilter : "thisWeek"
    }
    this.getCatStatus()
  }
  getPostsByRange(){
  let  frmDate = new Date(this.postOverViewForm.value.dateRange[0]).setHours(0,0,0,0);
  let  toDate = new Date(this.postOverViewForm.value.dateRange[1]).setHours(23,59,59,999);
this.label = new Date(frmDate).toLocaleDateString()+"to"+new Date(toDate).toLocaleDateString()
      // frmDate = new Date(new Date(frmDate).toLocaleDateString()).getTime() + 100;
      // toDate = new Date(new Date(toDate).toLocaleDateString()).getTime() + 86399900;
    this.categorystatus = {
      getTypeFilter :  JSON.stringify([frmDate,toDate])
    }
    console.log(this.status);
    this.getCatStatus()
  }
  getCatStatus(){
    this.adminService.showLoader.next(true);
    let token = sessionStorage.getItem('token')
    this.adminService.fetchCategoryStatus(this.categorystatus,token).subscribe((posRes)=>{
      console.log("Category",posRes);
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        let array = [];
        posRes.result.forEach(val=>{
          let arr = []
          let obj = {label:"",data:[]}
       if(this.categorystatus.getTypeFilter == "thisYear"){
            switch(val.label) { 
            case 1: { 
              obj.label =  "Jan";
               break; 
            } 
            case 2: {  
               obj.label =  "Feb";
               break; 
            }
            case 3: { 
              obj.label =  "Mar";
               break; 
            } 
            case 4: {  
               obj.label =  "Aprl";
               break; 
            }
            case 5: { 
              obj.label =  "May";
               break; 
            } 
            case 6: {  
               obj.label =  "Jun";
               break; 
            }
            case 7: { 
              obj.label =  "July";
               break; 
            } 
            case 8: {  
               obj.label =  "Aug";
               break; 
            }
            case 9: { 
              obj.label =  "Sep";
               break; 
            } 
            case 10: {  
               obj.label =  "Oct";
               break; 
            }
            case 11: { 
              obj.label =  "Nov";
               break; 
            } 
            case 12: {  
               obj.label =  "Dec";
               break; 
            }
            default: { 
              obj.label =  val.label;
               break; 
            } 
         }
       }else{
        obj.label =  val.label;
       }
        
      obj.data =  Object.values(val.data);
      arr.push(obj);
      array.push(arr)
        });
        console.log("array",array);
        
        this.barChartData = array;
      }else{
        this.openSnackBar(posRes.message,"")
      }
      
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"")
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
//  Location Based Posts fetching
changeView(event){
  if(event.value == "location"){
    this.isLocationBase = true
    if(!this.barChartDataLocation.length){
      this.getLocationBasedChart()
    }
  }else{
    this.isLocationBase = false;
  }
}
getLocationBasedChart(){
  this.adminService.showLoader.next(true);
  let token = sessionStorage.getItem('token');
  let obj = {
    "getTypeFilter":"states"
  }
  this.adminService.fetchlocationBasedTasks(obj,token).subscribe((posRes)=>{
    console.log("Location Based",posRes);
    this.adminService.showLoader.next(false);
    if(posRes.response == 3){
      let valuesArray = [];
this.barChartLabelsLocation = Object.keys(posRes.result[0].data)
      posRes.result.forEach(val=>{
        let arr = []
        let obj = {label:"",data:[]}
     obj.label =  val.label;
    obj.data =  Object.values(val.data);
    arr.push(obj);
    valuesArray.push(arr)
      });
      this.barChartDataLocation = valuesArray;
      console.log("Location data", this.barChartDataLocation);
      console.log("COmplex",this.barChartLabelsLocation);
      
      
    }else{
      this.openSnackBar(posRes.message,"")
    }
    
  },(err:HttpErrorResponse)=>{
    this.adminService.showLoader.next(false);
    this.openSnackBar(err.message,"")
    if(err.error instanceof Error){
      console.warn("CSError",err.error)
    }else{
      console.warn("SSError",err.error)
    }
  })  
}
}
