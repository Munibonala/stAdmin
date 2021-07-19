import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';
import { AlCustomersComponent } from '../al-customers/al-customers.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  headings:string = "Customers Filter";
  filterForm:FormGroup;
  filtercustomer:string= "All";
filterOption:string = "All";
category:string = "All"
baseUrl:string="";
jobs:any = [];
isAllCustmerFilters:boolean = false;
isAllTasksFilters:boolean = false;
isAllBookings:boolean = false;
taskStatus:string = "All";
bookingStatus:string = "All"
customerObj:any;
jobObj:any;
state:string = "All"
statesArray:Array<any> = ["All","Sabah", "Sarawak", "Selangor", "Perak", "Johor", "Kedah", "Negeri Sembilan", "Pahang", "Terengganu", "Penang", "Perlis", "Maleka","Kuala Lumpur"]
maxDate = new Date();
categoryList:Array<any> = [];
  constructor(private dialogRef: MatDialogRef<AlCustomersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder, private adminService:AdminService) { }
 
  ngOnInit() {
    console.log(this.data);
    
    this.filterForm = this.fb.group({
      dateRange: [null]
    })
    this.onLoad();
  }
  selectState(stateName){
    this.state = stateName;
  }
  selectCat(cat){
    this.category = cat;
  }
  selectMainCat(cat){
    this.category = cat
  }
  onLoad(){
    this.categoryList = this.data.category;
    if(this.data.filters && this.data.filters.fromdate){
      let dateFilter = this.data.filters;
      let dates = [new Date(parseInt(dateFilter.fromdate)), new Date(parseInt(dateFilter.todate))]
      this.filterForm.get('dateRange').setValue(dates)
    }
    if(this.data.from == "AllCust"){
      this.isAllCustmerFilters = true;
      this.isAllBookings = false;
      this.isAllTasksFilters = false;
      let filters = this.data.filters
      this.filterOption = filters.sortBy;
      this.filtercustomer = filters.type;
      this.category = filters.category;
      this.state = filters.State
    }else if(this.data.from == "AllTasks"){
      this.isAllTasksFilters = true;
      this.isAllCustmerFilters = false;
      this.isAllBookings = false;
      this.headings = "Tasks filter";
      let filters = this.data.filters
      this.state = filters.State;
      this.taskStatus = filters.taskStatus;
       this.category = filters.category
    }else{
      this.headings = "Bookings filter";
      this.isAllCustmerFilters = false;
      this.isAllBookings = true;
      this.isAllTasksFilters = false;
      let filters = this.data.filters
      this.state = filters.State;
      this.bookingStatus = filters.type;
      this.category = filters.category

      console.log("Cat",this.data);
      
      
    }
  }
  reset(){
    this.filterForm.get('dateRange').setValue(null)
    this.bookingStatus = "All";
    this.taskStatus = "All";
    this.category = "All";
    this.state = "All"
    this.filterOption = "All";
    this.filtercustomer = "All";
  }
   // Browse Category
browseCategory(){
  this.adminService.browseCategory().subscribe((posRes)=>{
    if(posRes.response == 3){
      this.categoryList = posRes.categoriesList; 
      sessionStorage.setItem("cat",JSON.stringify(this.category));
    }else{
      // this.openSnackBar(posRes.message,"")
    }
  },(err:HttpErrorResponse)=>{
    if(err.error instanceof Error){
      console.warn("CSE",err.message);
    }else{
      console.warn("SSE",err.message);
      
    }
  })
}
  closeTab(){
    this.dialogRef.close();
  }
  changeView(event){
    this.filtercustomer = event.value;
    }
    tasksFilter(type){
      this.taskStatus = type
    }
    bookingsFilter(type){
      this.bookingStatus = type;
    }
    showOnly(text){
      this.filterOption = text; 
    }
    getFilteredCustomers(){
      if(this.filterForm.value.dateRange != null){
        console.log(new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0),new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,100));
        
        let frmDate = new Date(this.filterForm.value.dateRange[0]).getTime();
        let toDate = new Date(this.filterForm.value.dateRange[1]).getTime();
          frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0);
         toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
        this.customerObj = {
          type : this.filtercustomer,
          "sortBy":this.filterOption,
        pageNo:"1",
        size:"60",
        "fromdate": ""+ frmDate,
        "todate":""+ toDate,
        State:this.state,
        category : this.category
        }
        this.dialogRef.close(this.customerObj);
      }else{
        this.customerObj = {
          type : this.filtercustomer,
          "sortBy":this.filterOption,
          pageNo:"1",
          size:"90",
          State:this.state,
          category : this.category
        };
        this.dialogRef.close(this.customerObj);
      }
    }
    getFilteredTask(){
      if(this.filterForm.value.dateRange != null){
        let frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0);
        let toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
       
        this.jobObj = {
          taskStatus : this.taskStatus,
        pageNo:"1",
        size:"20",
        State:this.state,
        "fromdate": ""+ frmDate,          
      "todate":""+ toDate,
      category : this.category

        }
        this.dialogRef.close(this.jobObj);
      }else{
        this.jobObj = {
          taskStatus : this.taskStatus,
          pageNo:"1",
          size:"20",
          State:this.state,
          category : this.category
        }
        this.dialogRef.close(this.jobObj);
      }
    }
    getFilteredBookings(){
      if(this.filterForm.value.dateRange != null){
        let frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0);
        let toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
        console.log(new Date(frmDate),new Date(toDate));
       
        this.jobObj = {
          type : this.bookingStatus,
        pageNo:"1",
        size:"20",
        "fromdate": ""+ frmDate,
        "todate":""+ toDate,
        State:this.state,
        category: this.category
        }
        this.dialogRef.close(this.jobObj);
      }else{
        this.jobObj = {
          type : this.bookingStatus,
          pageNo:"1",
          size:"20",
          State:this.state,
          category: this.category
        }
        this.dialogRef.close(this.jobObj);
      }
    }
}
