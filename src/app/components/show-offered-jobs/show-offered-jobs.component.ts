import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';

@Component({
  selector: 'app-show-offered-jobs',
  templateUrl: './show-offered-jobs.component.html',
  styleUrls: ['./show-offered-jobs.component.css']
})
export class ShowOfferedJobsComponent implements OnInit {
offeredJobs:Array<any> = [];
jobs:Array<any> = []
  constructor(private dialogRef: MatDialogRef<any>, private adminService:AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any , private dialog:MatDialog) { }

  ngOnInit() {
this.jobs = [...this.data.jobsData]
    this.onLoad();
  }
  onLoad(){
 this.offeredJobs = this.jobs.filter((job,index)=>{
   let i = -1;
  i = job.offers.findIndex(val=>{
    return this.data.userID == val.offeredUserID;
  });
  return job.offers[i].isTaskerHired;
  if(job.offers[i].isTaskerHired){
    this.jobs[index].isUserHired = true;
  }else{
    this.jobs[index].isUserHired = false; 
  }
  if(job.offers[i].isTaskerWithDraw){
    this.jobs[index].isUserWithdraw = true;
  }else{
    this.jobs[index].isUserWithdraw = false;
  }
})
console.log("Updated",this.offeredJobs)
  }
  getColors(status){
    switch (status){
      case "Open":
        return '#09A804';
        case "Assigned": return '#FF870E';
        case "Completed": return '#Fa0e0e';
        case "Expired": return '#33b5e5';
        case "Cancel": return '#9435a9';
    }
  }
  // Withdraw User from Hired Job
 
  withdrawUser(job,i){
    let obj = {
      "postID":job.postID,
      "offeredUserID" : this.data.userID
    }
    let message = `Do you want to remove this user from this job ?` 
    let dailogRef = this.dialog.open(DeleteDailogComponent, {
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:true,
      data : message
    });
    dailogRef.afterClosed().subscribe(res=>{
      if(res){
        let token = sessionStorage.getItem('token');
      this.adminService.deleteOffer(obj,token).subscribe((posRes)=>{
        if(posRes.response == 3){
          // this.openSnackBar(posRes.message,"")
          this.offeredJobs.splice(i,1);
        }else{
          // this.openSnackBar(posRes.message,"")
        }
      },(err:HttpErrorResponse)=>{
        // this.openSnackBar(err.message,"")
        if(err.error instanceof Error){
          console.warn("Client Error",err.error);
        }else{
          console.warn("Server Error",err.error);
        }
      })
      
      }
    })
    
      }
  openDetails(job){

  }
  closeTab(){
this.dialogRef.close();
  }
}
