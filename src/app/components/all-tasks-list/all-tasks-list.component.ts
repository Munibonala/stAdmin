import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-all-tasks-list',
  templateUrl: './all-tasks-list.component.html',
  styleUrls: ['./all-tasks-list.component.css']
})
export class AllTasksListComponent implements OnInit {
  filteredData:Array<any> = [];
  jobs:Array<any> =[];
  jobsCopy:Array<any> = [];
  taskStatus:string = "All";
  filterForm:FormGroup;
  pageNo:number = 1;
  dataMessage:string = "Fetching Data.."
  totalPageCount:number = 0;
  maxDate = new Date();
  date = null;
  totalItemsCount:number = 0;
debounceTime = null;
jobObj:any
  @ViewChild('t',{static:false}) datePicker: NgbInputDatepicker;
  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  constructor(private adminService:AdminService,private router:Router, private  dialog:MatDialog,
     private fb:FormBuilder, private snackBar:MatSnackBar,private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
   private  cd: ChangeDetectorRef) {
      }

  ngOnInit() {
    this.jobObj = {
      taskStatus : this.taskStatus,
      pageNo:""+this.pageNo,
      size:"20"
    }
    this.filterForm = this.fb.group({
      dateRange:[null,Validators.required]
    })
    this.getJobs()
  }
  //message alerts showing
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  // Date Picker
  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromDate = date;
     
  //   } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
  //     this.toDate = date;
  //     this.datePicker.close()
  //   } else {
  //     this.toDate = null;
  //     this.fromDate = date;
  //   }
  //   console.log(this.fromDate, this.toDate);
  // }
  // isHovered(date: NgbDate) {
  //   return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  // }

  // isInside(date: NgbDate) {
  //   return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  // }

  // isRange(date: NgbDate) {
  //   return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  // }

  // validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
  //   const parsed = this.formatter.parse(input);
  //   return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  // }
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
  getFilteredTask(){
    console.log(this.filterForm.value.dateRange);
    
    if(this.filterForm.value.dateRange != null){
      let frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0);
      let toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
      console.log(new Date(frmDate),new Date(toDate));
      
      // if(new Date(this.filterForm.value.dateRange[0]).getTime() === new Date(this.filterForm.value.dateRange[1]).getTime()){
        
      // }
      // frmDate = new Date(new Date(frmDate).toLocaleDateString()).getTime();
      //   toDate = new Date(new Date(toDate).toLocaleDateString()).getTime() + 86399900;
      this.filteredData = [];
      this.pageNo = 1;
      this.jobObj = {
        taskStatus : this.taskStatus,
      pageNo:""+this.pageNo,
      size:"20",
      "fromdate": ""+ frmDate,
      "todate":""+ toDate,
      }
      this.getJobs();
    }else{
      this.filteredData = [];
      this.pageNo = 1;
      this.jobObj = {
        taskStatus : this.taskStatus,
        pageNo:""+this.pageNo,
        size:"20"
      }
      this.getJobs()
    }
  }
  getFltrTask(){
    this.adminService.showLoader.next(true);
    this.dataMessage = "Fetching Data..."
    let obj = {
      taskStatus : this.taskStatus,
      fromdate: ""+ new Date(this.fromDate.year,this.fromDate.month,this.fromDate.day).setHours(0,0,0),
      todate: ""+new Date(this.toDate.year,this.toDate.month,this.toDate.day).getTime(),
    }
    console.log("Form",obj);
    let token = sessionStorage.getItem('token')
    this.adminService.getFilteredTasks(obj,token).subscribe((pos:any)=>{
      this.adminService.showLoader.next(false);
    if(pos.response == 3){
      this.jobs = pos.jobsData;
      console.log("jobs",this.jobs);
        this.jobs.forEach((val,i)=>{
          // this.jobs.taskDate = new Date(parseFloat(val.taskDate));
          this.jobs[i].postedDate = new Date(val.postedDate * 1);
          if(val.budget.budgetType.Total == false){
            let num:number = parseInt(val.budget.Hours);
            this.jobs[i].budget.budget = num * val.budget.pricePerHour;
          }
        })
        this.filteredData = this.jobs
    }else{
      this.openSnackBar(pos.message,"")
    }
      
    },(err:HttpErrorResponse)=>{
      this.openSnackBar(err.error,"")
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
  getColors(status){
    switch (status){
      case "Open":
        return '#09A804';
        case "Assigned": return '#FF870E';
        case "Completed": return '#Fa0e0e';
    }
  }
  open(imag){
    console.log(imag);
  }
  onChangeDate(event){
    console.log("Event",event);
    
  }
  // Filter Tasks
  tasksFilter(type){
    this.taskStatus = type
  }
  deleteTask(data,i){
    let message = `Do you want to delete ${data.postTitle} task.` 
    let dailogRef = this.dialog.open(DeleteDailogComponent, {
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:true,
      data : message
    });
    dailogRef.afterClosed().subscribe(res=>{
      if(res){
        this.adminService.showLoader.next(true);
        let obj = {
          postID: data.postID
        };
        let token = sessionStorage.getItem('token');
        this.adminService.deleteTask(obj,token).subscribe((posRes:any)=>{
          this.adminService.showLoader.next(false);
          if(posRes.response == 3){
            this.openSnackBar(posRes.message,"");
            this.filteredData.splice(i,1);
            this.cd.detectChanges();
          }else{
            this.openSnackBar(posRes.message,"");
          }
        },(err:HttpErrorResponse)=>{
          this.adminService.showLoader.next(false);
          this.openSnackBar(err.message,"")
          if(err.error instanceof Error){
            console.warn("Client Error",err.error);
          }else{
            console.warn("Server Error",err.message);
          }
        })
      }
    })
  }
  applyFilter(term: string) {
    if(!term) {
      this.filteredData = this.jobsCopy;
    } else {
      this.filteredData = this.jobsCopy.filter(x => 
       x.postTitle.trim().toLowerCase().includes(term.trim().toLowerCase()) || x.postID.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }
 
  getJobs(){
    this.adminService.showLoader.next(true);
    this.dataMessage ="Fetching Data..."
   this.jobObj.pageNo = ""+ this.pageNo;
    let token = sessionStorage.getItem('token')
    this.adminService.getFilteredTasks(this.jobObj,token).subscribe((posRes:any)=>{
      this.dataMessage = "No Data Found"
      this.adminService.showLoader.next(false);
      console.log("results",posRes);
      if(posRes.response == 3){
        this.jobs = posRes.jobsData;
        this.jobsCopy = posRes.jobsData;
        this.totalPageCount = posRes.pages;
        sessionStorage.setItem('allJobs',JSON.stringify(this.jobs))
        this.jobs.forEach((val,i)=>{
          // this.jobs.taskDate = new Date(parseFloat(val.taskDate));
          this.jobs[i].postedDate = new Date(val.postedDate * 1);
          if(val.budget.budgetType.Total == false){
            let num:number = parseInt(val.budget.Hours);
            this.jobs[i].budget.budget = num * val.budget.pricePerHour;
          }
        })
        this.filteredData = this.filteredData.concat(this.jobs);
        this.cd.detectChanges()
      }else{
  this.openSnackBar(posRes.message,"");
      }
      
    },(err:HttpErrorResponse)=>{
      this.openSnackBar(err.error,"");
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("CSError",err.error)
      }else{
        console.warn("SSError",err.error)
      }
    })
  }
  showDate(event){
    console.log(event);   
  }
  openDetails(job){
this.router.navigate(['admin','details',job.postID])
  }
}
