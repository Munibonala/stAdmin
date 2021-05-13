import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.css']
})
export class ImgPreviewComponent implements OnInit {
  baseUrl:string = "";
  isGalleryImages:boolean = false;
  imageArray:Array<any> = []
  constructor(private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService:AdminService) { }

  ngOnInit() {
    if(this.data.isFromGallery){
      this.isGalleryImages = true;

    }else{
      this.isGalleryImages = false;
    }
    this.baseUrl = this.adminService.baseUrl;
    this.onLoad()
  }
onLoad(){
  if(this.isGalleryImages){
    this.data.images.forEach(val=>{
      if(val.substring(val.lastIndexOf('.')+1) == 'jpg'){
        let obj = {
          path : this.baseUrl+val,
          isImage : true
        }
        this.imageArray.push(obj)
      }else{
        let obj = {
          thumbNail: this.baseUrl+val,
          path : this.baseUrl+val.replace('png','mp4'),
          isImage : false
        }
        this.imageArray.push(obj)
      }
    })
    console.log(this.imageArray);
  }else{
    this.data.images.forEach(val=>{
      let obj = {
        path : val,
        isImage : true
      }
      this.imageArray.push(obj)
    })
  }
 
}
}
