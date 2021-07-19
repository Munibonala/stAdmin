import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-al-customers',
  templateUrl: './al-customers.component.html',
  styleUrls: ['./al-customers.component.css'],
})
export class AlCustomersComponent implements OnInit, OnDestroy  {
filtercustomer:string= "All";
filterOption:string = "All";
baseUrl:string="";
jobs:any = [];
taskStatus:string = "";
customerSubscribe:any;
customers:Array<any> = [];
maxDate:any = new Date()
filterdCustomers:Array<any> = [];
pageNo:number = 1;
message:string = "Finding Users.."
totalPageCount:number = 1;
isTotalCountReached:boolean = false;
debounceTime = null;
isFetchingUsers:boolean = false;
filterForm:FormGroup;
searchByNameForm:FormGroup;
customerObj:any = null;
isSearchByName:boolean = false;
isDetails:boolean = false
keywordSearch:any;
customerID:string = ""
currentPage:number = 0;
pageNumbers:Array<any> = [];
categoryList:Array<any> = [];
@ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
image:string = "https://stagingapi.startasker.com/images/Customers/NYlLT1600410727105JPEG_20200918_143028_1044443140.jpg"
  constructor(private adminService:AdminService, private router:Router, private fb:FormBuilder,
    private snackBar:MatSnackBar, private activatedRoute: ActivatedRoute,private dialog:MatDialog) { }

  ngOnInit() {
    let cat = JSON.parse(sessionStorage.getItem('categories'));
    if(cat && cat.length){
      this.categoryList = cat;
    }else{
      this.browseCategory();
    }
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.keywordSearch = { ...params };
    });
    if(this.keywordSearch && this.keywordSearch.params && this.keywordSearch.params.search_term){
      this.filterOption = this.keywordSearch.params.search_term
    }
    
    this.searchByNameForm = this.fb.group({
      userID:["",Validators.required],
      pageNo:[""],
      size:["21"]
    })
    this.adminService.showLoader.next(true)
    this.customerObj = {
      type : this.filtercustomer,
      "sortBy":this.filterOption,
      pageNo:""+this.pageNo,
      size:"90",
      State:"All",
      category: "All"
    }
   this.fetchAllUsers()   
    // this.baseUrl = this.adminService.baseUrl;
    this.baseUrl = "https://stagingapi.startasker.com"
    this.filterForm = this.fb.group({
      dateRange: [null]
    })
  }
  //message alerts showing
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  // Browse Category
browseCategory(){
  this.adminService.browseCategory().subscribe((posRes)=>{
    if(posRes.response == 3){
      this.categoryList = posRes.categoriesList;
      sessionStorage.setItem('categories',JSON.stringify(this.categoryList));
    }else{
      this.openSnackBar(posRes.message,"")
    }
  },(err:HttpErrorResponse)=>{
    if(err.error instanceof Error){
      console.warn("CSE",err.message);
    }else{
      console.warn("SSE",err.message);
      
    }
  })
}
  searchByName(){
    if(this.searchByNameForm.valid){
      this.filterdCustomers = []
      this.pageNo = 1;
      this.isSearchByName = true;  
      this.getUsersByName()
    }else{
     this.openSnackBar("Enter First Name..","") 
    }
  }
  getUsersByName(){
    this.adminService.showLoader.next(true);
    this.message = 'Finding Users..'
    this.isFetchingUsers = true;
this.searchByNameForm.patchValue({
  pageNo: ""+this.pageNo
})
this.isSearchByName = true;
let token = sessionStorage.getItem('token')
this.adminService.searchByName(this.searchByNameForm.value,token).subscribe((posRes)=>{
  console.log("All Users",posRes);
  this.pageNumbers = [];
  this.adminService.showLoader.next(false);
  this.message = "No Users Found.."
if(posRes.response == 3){
this.customers = posRes.FetchData;
this.totalPageCount = posRes.pages;
for(let i:number = 0; i<this.totalPageCount; i++){
  this.pageNumbers.push(i+1);
}
if(this.totalPageCount <= this.pageNo){
 this.isTotalCountReached = true;
}else{
 this.isTotalCountReached = false;
}
let parentElm = document.getElementById('main-wrap');
//let  currentScrollPositio = parentElm.pageYOffset;
let currentScrollPosition = parentElm.scrollTop;
//console.log("Yposition",currentScrollPosition);
this.filterdCustomers = this.customers;
// this.filterdCustomers = this.filterdCustomers.concat(this.customers);
this.isFetchingUsers = false;
parentElm.scrollTop= 0;
// parentElm.scrollTop = currentScrollPosition
// console.log("Yposition2",parentElm.scrollTop);
//  parentElm.scrollTo(0,currentScrollPositio)
}else{
  this.openSnackBar(posRes.message,"")
this.pageNo = this.pageNo -1;
this.isFetchingUsers = false;
}
},(err:HttpErrorResponse)=>{
  this.message = "No Users Found.."
  this.openSnackBar(err.message,"")
  this.pageNo = this.pageNo -1;
  this.isFetchingUsers = false;
  this.adminService.showLoader.next(false);
  if(err.error instanceof Error){
    console.warn("Client SIde Error",err.error);
  }else{
    console.warn("Server Error",err.error);
  }
})
  }
  getFilteredTask(){
    if(this.filterForm.value.dateRange != null){
      console.log(new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0),new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,100));
      
      let frmDate = new Date(this.filterForm.value.dateRange[0]).getTime();
      let toDate = new Date(this.filterForm.value.dateRange[1]).getTime();
        frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0);
       toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
      this.filterdCustomers = [];
      this.pageNo = 1;
      this.customerObj = {
        type : this.filtercustomer,
        "sortBy":this.filterOption,
      pageNo:""+this.pageNo,
      size:"60",
      "fromdate": ""+ frmDate,
      "todate":""+ toDate,
      }
      this.fetchAllUsers();
    }else{
      this.filterdCustomers = [];
      this.pageNo = 1;
      this.customerObj = {
        type : this.filtercustomer,
        "sortBy":this.filterOption,
        pageNo:""+this.pageNo,
        size:"90"
      }
      this.fetchAllUsers()
    }
  }
  taskFilters(){
    let obj = {
      from : "AllCust",
      category: this.categoryList,
      filters:this.customerObj
    }
    this.pageNo = 1;
   let dialogRef = this.dialog.open(FiltersComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res && res.pageNo){
        this.filterdCustomers = [];
        this.customerObj = res;
        console.log(this.customerObj);
        this.fetchAllUsers();
      }
    })
  }
  changeView(event){
  this.filtercustomer = event.value;
  }
  gotoSelectedPage(num){
    this.pageNo = num;
    if(!this.isSearchByName){
      this.fetchAllUsers()
    }else{
      this.getUsersByName()
    }
  }
  receiveMessage(event){
    this.isDetails = event;
  }
  showUserDetails(customer){
    this.adminService.showLoader.next(true);
    this.isDetails = true;
    this.customerID = customer.userID
    // this.router.navigate(['admin','customer',customer.userID]);
  }
 loadMore(){
   this.pageNo = this.pageNo + 1;
   if(this.totalPageCount <= this.pageNo){
     this.isTotalCountReached = true;
   }else{
     this.isTotalCountReached = false;
   }
   if(!this.isSearchByName){
    this.fetchAllUsers()
   }else{
     this.getUsersByName()
   }
 }
 previousPage(){
  this.pageNo = this.pageNo - 1;
  if(this.totalPageCount <= this.pageNo){
    this.isTotalCountReached = true;
  }else{
    this.isTotalCountReached = false;
  }
  if(!this.isSearchByName){
   this.fetchAllUsers()
  }else{
    this.getUsersByName()
  }
 }
 fetchAllUsers(){
   this.pageNumbers = [];
   this.message = "Finding Users.."
   this.isSearchByName = false;
   this.isFetchingUsers = true;
   this.customerObj.pageNo = ""+this.pageNo
   this.adminService.showLoader.next(true);
   let token = sessionStorage.getItem('token');
   this.customerSubscribe = this.adminService.fetchAllCustomers(this.customerObj,token).subscribe((posRes)=>{
     console.log("All Users",posRes);
     this.message = "No Users Found.."
     this.adminService.showLoader.next(false);
if(posRes.response == 3){
  this.customers = posRes.FetchData;
  this.totalPageCount = posRes.pages;
  for(let i:number = 0; i<this.totalPageCount; i++){
    this.pageNumbers.push(i+1);
  }
  if(this.totalPageCount <= this.pageNo){
    this.isTotalCountReached = true;
  }else{
    this.isTotalCountReached = false;
  }
  let parentElm = document.getElementById('main-wrap');
 //let  currentScrollPositio = parentElm.pageYOffset;
let currentScrollPosition = parentElm.scrollTop;
//console.log("Yposition",currentScrollPosition);
  // this.filterdCustomers = this.filterdCustomers.concat(this.customers);
  this.filterdCustomers = this.customers
  this.isFetchingUsers = false;
  //  parentElm.scrollTop = currentScrollPosition;
   parentElm.scrollTop = 0;
}else{
  this.openSnackBar(posRes.message,"");
  this.pageNo = this.pageNo -1;
  this.isFetchingUsers = false;
}
   },(err:HttpErrorResponse)=>{
     this.message = "No Users Found.."
     this.openSnackBar(err.message,"")
    this.pageNo = this.pageNo -1;
    this.isFetchingUsers = false;
    this.adminService.showLoader.next(false);
    if(err.error instanceof Error){
      console.warn("Client SIde Error",err.error);
    }else{
      console.warn("Server Error",err.error);
    }
   })
 }
 showAll(){
   this.filterdCustomers = this.customers;
 }
 showOnly(text){
  
   this.filterOption = text
   
 }
 applyFilter(term: string) {
  if(!term) {
    this.filterdCustomers = this.customers;
  } else {
    this.filterdCustomers = this.customers.filter(x => 
       x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
    );
  }
  
}
 ngOnDestroy() {
  this.customerSubscribe.unsubscribe();
}
}
