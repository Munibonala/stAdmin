import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-all-bookings',
  templateUrl: './all-bookings.component.html',
  styleUrls: ['./all-bookings.component.css']
})
export class AllBookingsComponent implements OnInit {
  filteredData:Array<any> = [];
  jobs:Array<any> =[];
  baseUrl:string = "";
  maxDate:any = new Date()
  jobObj:any;
  pageNo:number = 1;
  apiStatus:string = "Fetching Bookings"
  totalPageCount:number = 0;
  filterForm:FormGroup;
debounceTime = null;
bookingID:string = "";
isDetailsPage:boolean = false;
taskStatus:string = "All";
pageNumbers:Array<any> = [];
@ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  constructor(private adminService:AdminService,private router:Router,private fb:FormBuilder,
    private  cd: ChangeDetectorRef, private snackBar:MatSnackBar, private dialog:MatDialog) { }

  ngOnInit() {
    this.jobObj = {
      "type":this.taskStatus,
      "pageNo":""+ this.pageNo,
      "size":"20",
      State:"All"
     }
     this.filterForm = this.fb.group({
       dateRange: [null]
     })
    this.adminService.showLoader.next(true);
    this.baseUrl = this.adminService.baseUrl;
    this.getJobs()
  }
  getColors(status){
    switch (status){
      case true:
        return '#09A804';
        case false: return '#FF870E';
        
    }
  }
  receiveMessage(event){
    this.isDetailsPage = false;
  }
  tasksFilter(type){
    this.taskStatus = type;
  }
  getFilteredTask(){
    console.log(this.filterForm.value.dateRange);
    this.apiStatus = "Fetching Bookings..!"
    if(this.filterForm.value.dateRange != null){
      this.filteredData = [];
      this.pageNo = 1;
      this.jobObj = {
        type : this.taskStatus,
      pageNo:""+this.pageNo,
      size:"20",
      "fromdate": ""+ new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0),
      "todate":""+ new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999),
      }
      this.getJobs();
    }else{
      this.filteredData = [];
      this.pageNo = 1;
      this.jobObj = {
        type : this.taskStatus,
        pageNo:""+this.pageNo,
        size:"20"
      }
      this.getJobs()
    }
  }
  //message alerts showing
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  getJobs(){
    this.pageNumbers = []
    this.jobObj.pageNo = ""+this.pageNo
let token = sessionStorage.getItem('token');
this.adminService.showLoader.next(true);
    this.adminService.fetchAllbookings(this.jobObj,token).subscribe((posRes)=>{
      this.apiStatus = "No Bookings Found";
      console.log("results",posRes);
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        // this.jobs = posRes.bookingData;
        
        this.jobs = posRes.FetchData;
        this.totalPageCount = posRes.pages;
        for(let i:number = 0; i<this.totalPageCount; i++){
          this.pageNumbers.push(i+1);
        }
        this.jobs.forEach((val,i)=>{
          // this.jobs.taskDate = new Date(parseFloat(val.taskDate));
          this.jobs[i].postedDate = new Date(val.postedDate * 1);
        })
        this.filteredData = this.jobs;
        // this.cd.detectChanges();
        this.adminService.showLoader.next(false);
      }else{
        this.adminService.showLoader.next(false);
      }
      
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
  previousPage(){
    this.pageNo -= 1;
    this.getJobs();
  }
  nextPage(){
    this.pageNo += 1;
    this.getJobs();
  }
  gotoSelectedPage(number){
    this.pageNo = number;
    this.getJobs()
  }
  // Vertual Scroll pagination
  onScrollEnd(){
    if(this.viewPort){
      this.viewPort.elementScrolled().subscribe(
        res => {
          
            clearTimeout(this.debounceTime);
        this.debounceTime = setTimeout(() => {
          if (
            (res as any).srcElement.scrollTop +
            (res as any).srcElement.offsetHeight >=
            (res as any).srcElement.scrollHeight   && this.totalPageCount > this.pageNo
          ) {
            console.log("View Port",this.viewPort)
            this.pageNo = this.pageNo + 1;
            this.getJobs()
          }
        }, 100)
        });
    }
  }
  openDetails(job){
    this.isDetailsPage = true;
    this.bookingID = job.bookingID
   
//  this.router.navigate(['admin','booking',job.bookingID])
  }
  bookingFilters(){
    let obj = {
      from : "AllBookings"
    }
    this.pageNo = 1
   let dialogRef = this.dialog.open(FiltersComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.pageNo){
        this.filteredData = [];
        this.jobObj = res;
        this.getJobs()
      }
    })
  }
  applyFilter(term: string) {
    if(!term) {
      this.filteredData = this.jobs;
    } else {
      this.filteredData = this.jobs.filter(x => 
       x.taskTitle.trim().toLowerCase().includes(term.trim().toLowerCase()) || x.bookingID.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }
}
