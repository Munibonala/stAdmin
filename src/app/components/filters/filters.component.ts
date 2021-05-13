import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
maxDate = new Date()
  constructor(private dialogRef: MatDialogRef<AlCustomersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder) { }
 
  ngOnInit() {
    this.filterForm = this.fb.group({
      dateRange: [null]
    })
    this.onLoad()
  }
  selectState(stateName){
    this.state = stateName;
  }
  selectCat(cat){
    this.category = cat;
  }

  onLoad(){
    if(this.data.from == "AllCust"){
      this.isAllCustmerFilters = true;
      this.isAllBookings = false;
      this.isAllTasksFilters = false;
    }else if(this.data.from == "AllTasks"){
      this.isAllTasksFilters = true;
      this.isAllCustmerFilters = false;
      this.isAllBookings = false;
      this.headings = "Tasks filter";
    
    }else{
      this.headings = "Bookings filter";
      this.isAllCustmerFilters = false;
      this.isAllBookings = true;
      this.isAllTasksFilters = false;
    }
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
        console.log(new Date(frmDate),new Date(toDate));
       
        this.jobObj = {
          taskStatus : this.taskStatus,
        pageNo:"1",
        size:"30",
        State:this.state,
        "fromdate": ""+ frmDate,
        "todate":""+ toDate,
        }
        this.dialogRef.close(this.jobObj);
      }else{
        this.jobObj = {
          taskStatus : this.taskStatus,
          pageNo:"1",
          size:"30",
          State:this.state
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
        State:this.state
        }
        this.dialogRef.close(this.jobObj);
      }else{
        this.jobObj = {
          type : this.bookingStatus,
          pageNo:"1",
          size:"20",
          State:this.state
        }
        this.dialogRef.close(this.jobObj);
      }
    }
}
