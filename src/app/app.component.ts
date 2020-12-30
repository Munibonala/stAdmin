import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'starTaskerAdmin';
  loading:boolean = false;
  constructor(private adminService:AdminService, private cd:ChangeDetectorRef){
    this.adminService.showLoader.subscribe((flag:boolean)=>{
      if(this.loading !== flag) {
        this.loading = flag;
      }
     
    })
  }
}
