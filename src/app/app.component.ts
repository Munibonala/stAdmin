import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'starTaskerAdmin';
  loading:boolean = false;
  constructor(private adminService:AdminService, private cd:ChangeDetectorRef, private bnIdle: BnNgIdleService, private router:Router){
    this.adminService.showLoader.subscribe((flag:boolean)=>{
      if(this.loading !== flag) {
        this.loading = flag;
      }
    })
  }
ngOnInit(){
  this.bnIdle.startWatching(60 * 60).subscribe((isTimedOut: boolean) => {
    if (isTimedOut) {
      if ( (this.router.url != '/login') ){
        sessionStorage.clear();
      this.router.navigateByUrl('/login');
      }
      
    }
  });
}  
}
