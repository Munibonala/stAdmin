import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {
providerReviews:any;
posterReviews:any;
totalReviews:number = 0;
avgRating:number = 0;
one:number = 0;
two:number = 0;
three:number = 0;
four:number = 0;
five:number =0;
fiveStar:Array<any> =[1,2,3,4,5];
fourStar:Array<number>= [1,2,3,4];
threeStar:Array<number> =[1,2,3];
twoStar:Array<number> = [1,2]
taskerFiveStar:Array<any> = [];
taskerFourStar:Array<any> = [];
taskerThreeStar:Array<any> = [];
taskerTwoStar:Array<any> = [];
taskerOneStar:Array<any> = [];
posterFiveStar:Array<any> = [];
posterFourStar:Array<any> = [];
posterThreeStar:Array<any> = [];
posterTwoStar:Array<any> = [];
posterOneStar:Array<any> = [];
asPoster:boolean = false;

userReviews:any = {
  TaskCompletedCount: 0,
completedPercentage: "0"
};
  constructor(private dialogRef: MatDialogRef<CustomerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log("Data", this.data);
    this.posterReviews = this.data.poster;
    this.providerReviews = this.data.provider;
   setTimeout(()=>{
    this.setReviews()
   },100)
  }
setReviews(){
  if(this.providerReviews && this.providerReviews.rating5){
    this.userReviews = this.providerReviews.providerTaskCompletedDetails
    this.taskerFiveStar = this.providerReviews.rating5;
  this.taskerFourStar = this.providerReviews.rating4;
  this.taskerThreeStar = this.providerReviews.rating3;
  this.taskerTwoStar = this.providerReviews.rating2;
  this.taskerOneStar = this.providerReviews.rating1;
  }else{
    this.userReviews = {
      TaskCompletedCount: 0,
completedPercentage: ""
    }
  }
  let event = {
    value : "tasker"
  }
  this.changeView(event);
  console.log("As poster", this.posterReviews);
  if(this.posterReviews && this.posterReviews.rating5){
    this.userReviews = this.posterReviews.posterTaskCompletedDetails
    this.posterFiveStar = this.posterReviews.rating5;
  this.posterFourStar = this.posterReviews.rating4;
  this.posterThreeStar = this.posterReviews.rating3;
  this.posterTwoStar = this.posterReviews.rating2;
  this.posterOneStar = this.posterReviews.rating1;
  }else{
    this.userReviews = {
      TaskCompletedCount: 0,
completedPercentage: ""
    }
    
  }
}
closeTab(){
  this.dialogRef.close()
}
userProfile(user){
  console.log(user);
  
}
changeView(event){
  if(event.value == "poster"){
    if(!isNaN(this.posterReviews.averageRatingAsAPoster)){
      this.avgRating = parseFloat(this.posterReviews.averageRatingAsAPoster);
    }else{
      this.avgRating = 0;
    }
    this.asPoster = true
    if(this.posterReviews && this.posterReviews.rating5){
      this.userReviews = this.posterReviews.posterTaskCompletedDetails;
       this.one = this.posterReviews.rating1.length
       this.two = this.posterReviews.rating2.length
      this.three = this.posterReviews.rating3.length
      this.four = this.posterReviews.rating4.length
      this.five = this.posterReviews.rating5.length
      this.totalReviews = this.one + this.two + this.three + this.four + this.five;
    }else{
      this.one = 0;
        this.two = 0;
        this.three = 0;
        this.four = 0;
        this.five = 0;
      this.totalReviews = 0;
      this.userReviews = {
        TaskCompletedCount: 0,
completedPercentage: ""
      }
    }
  }else{
   this.asPoster = false;
   if(this.providerReviews && this.providerReviews.rating5){
    if(!isNaN(this.providerReviews.averageRatingAsAProvider)){
      this.avgRating = parseFloat(this.providerReviews.averageRatingAsAProvider);
    }else{
      this.avgRating = 0;
    }
setTimeout(()=>{
this.userReviews = this.providerReviews.providerTaskCompletedDetails;
},100)
this.one = this.providerReviews.rating1.length
this.two = this.providerReviews.rating2.length
this.three = this.providerReviews.rating3.length
this.four = this.providerReviews.rating4.length
this.five = this.providerReviews.rating5.length
this.totalReviews = this.one + this.two + this.three + this.four + this.five;
  }else{
    this.one = 0;
        this.two = 0;
        this.three = 0;
        this.four = 0;
        this.five = 0;
    this.totalReviews = 0;
    this.userReviews = {
      TaskCompletedCount: 0,
completedPercentage: ""
    }
  }
  }

}
}
