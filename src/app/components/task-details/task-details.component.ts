import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommentsDailogComponent } from '../comments-dailog/comments-dailog.component';
import { MatDialog } from '@angular/material';
import { OffersDailogComponent } from '../offers-dailog/offers-dailog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit ,OnChanges {
  rawData:any;
  id:string;
  taskUserInfo:any;
  image:string;
  date:any;
  routeSub:any;
  one:boolean = true;
  public baseUrl:string;
  comments:Array<any> = [];
  offers:Array<any> = [];
  assigned:Array<any> = [];
  @Input() childID: string;
  @Output() closeEvent = new EventEmitter();
  isFromAllTask:boolean = false;
  constructor(private adminService:AdminService,private router:Router, private activatedRoute:ActivatedRoute,
    private dialog:MatDialog) { }

  ngOnInit() {
   this.onLoad()
  }
  onLoad(){
    this.baseUrl = this.adminService.baseUrl;
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      //log the entire params object
     if(params && params['id']){
      this.id = params['id'];
      this.getTaskDetails()
     }
   }); 
  }
  ngOnChanges(changes: SimpleChanges){
    this.isFromAllTask = true
    this.id = this.childID;
    this.getTaskDetails();
  }
  closeDetails(){
    this.isFromAllTask = false;
    this.closeEvent.emit(true)
  }
  getColors(status){
    switch (status){
      case "Open":
        return '#09A804';
        case "Assigned": return '#FF870E';
        case "Completed": return '#Fa0e0e';
    }
  }
  
  getTaskDetails(){
    let obj = {
      userID: this.id
    }
    this.adminService.showLoader.next(true);
   this.adminService.getMyTasks(obj).subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.rawData = posRes.jobsData[0];
        console.log("data",this.rawData);
        if(this.rawData && this.rawData.userInfo){
          this.taskUserInfo = this.rawData.userInfo;
          this.comments = this.rawData.comments;
          this.offers = this.rawData.offers;
          this.assigned = this.offers.filter(val=>{
            return val.isTaskerHired && !val.isTaskerWithDraw
          })
          if(this.taskUserInfo.profilePic != ""){
            this.image = "https://liveapi.startasker.com"+this.taskUserInfo.profilePic
          }
        }
        if(this.rawData.budget.budgetType.Total == false){
          let num:number = parseInt(this.rawData.budget.Hours) 
          this.rawData.budget.budget = num * this.rawData.budget.pricePerHour;
        }
   
   this.date = new Date(posRes.jobsData[0].postedDate * 1)
    
      }else{
        alert(posRes.message)
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("Client Error",err.error)
      }else{
        console.warn("Server Error",err.error)
      }
      
    })
  }
  openComments(){
    let obj = {
      offers : this.comments,
      postID : this.rawData.postID
    }
    let dialogRef = this.dialog.open(CommentsDailogComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
    dialogRef.afterClosed().subscribe(res=>{
      this.getTaskDetails()
    })
  }
  openOffers(){
    let obj = {
      offers : this.offers,
      postID : this.rawData.postID
    }
    let dialogRef = this.dialog.open(OffersDailogComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    }) 
  }
}
