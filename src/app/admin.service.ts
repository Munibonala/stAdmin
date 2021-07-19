import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public baseUrl:string = "https://stagingapi.startasker.com";
  stagingUrl:string = "https://stagingapi.startasker.com"
  showLoader = new BehaviorSubject(false);
  constructor(private http:HttpClient) { }

  adminLogin(data){
    return this.http.post(`https://stagingapi.startasker.com/api/admin/login`,data)
  }
  updateMobileNumber(data,token):Observable<any>{
    return this.http.put("https://stagingapi.startasker.com/api/customer/updatemobileno",data,{headers:{"startasker":token}})
  }
  // Dash Board Api's
  fetchStatus(token):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/admin/QuickStatus`,{headers:{"startasker":token}});
  }
  fetchBookingStatus(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/totalBookings`,data,{headers:{"startasker":token}});
  }
  fetchCategoryStatus(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/postjobsFilter`,data,{headers:{"startasker":token}})
  }
  fetchlocationBasedTasks(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/getStateWiseJobs`,data,{headers:{"startasker":token}})
  }
  browsBookings():Observable<any>{
    return this.http.get("https://stagingapi.startasker.com/api/postjob/fetch_all");
  }
  searchByName(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/namesearching`,data,{headers:{"startasker":token}})
  }
  releasePaymentToProvider(data,token):Observable<any>{
    return this.http.post("https://stagingapi.startasker.com/api/admin/status",data,{headers:{"startasker":token}})
  }
  getMyTasks(data):Observable<any>{
    return this.http.post("https://stagingapi.startasker.com/api/postjob/get",data) 
   }
   getTasksBySearch(data,token):Observable<any>{
     return this.http.post(`${this.baseUrl}/api/admin/postjob_search`,data,{headers:{"startasker":token}})
   }
   getBookingsBySearch(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/bookings_search`,data,{headers:{"startasker":token}})
  
   }
   deleteTask(data,token){
    return this.http.post(`${this.baseUrl}/api/admin/deletetask`,data,{headers:{"startasker":token}})
   }
   getFilteredTasks(data,token){
     return this.http.post("https://stagingapi.startasker.com/api/admin/fetchtask",data,{headers:{"startasker":token}})
   }
  //  Hire Providers
  hireProviders(data,token):Observable<any>{
    return this.http.post("https://stagingapi.startasker.com/api/hire/taskers",data,{headers:{"startasker":token}})
  }
   browseCategory():Observable<any>{
    return this.http.get('https://stagingapi.startasker.com/api/categories')
  }
  bookingDetails(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/hire/`,data,{headers:{"startasker":token}})
  }
  ediComment(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/updatecomment`,data,{headers:{"startasker":token}});
  }
  fetchAllbookings(data,token):Observable<any>{
    return this.http.post('https://stagingapi.startasker.com/api/admin/bookings',data,{headers:{"startasker":token}})
  }
  fetchAllCustomers(data,token):Observable<any>{
    return this.http.post("https://stagingapi.startasker.com/api/admin/filters",data,{headers:{"startasker":token}})
  }
 downloadReports(data,token):Observable<any>{
   return this.http.post("https://stagingapi.startasker.com/api/admin/Reports",data,{headers:{"startasker":token},responseType: 'arraybuffer'})
 }
  deleteComments(data,token):Observable<any>{
return this.http.post(`${this.baseUrl}/api/admin/deletecomment`,data,{headers:{"startasker":token}})
  }
  deleteOffer(data,token):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/admin/deleteprovidertask`,data,{headers:{"startasker":token}})
  }
  // get details with ratings also;
      fetchUserDetails(id,token):Observable<any>{
        return this.http.post("https://stagingapi.startasker.com/api/admin/",id,{headers:{"startasker":token}})
          }
          // get only details.Api from apps
          getUserDetails(id):Observable<any>{
            return this.http.post("https://stagingapi.startasker.com/api/customer/fetch",id)
              }
          // Block or unblock
    
          blockUnBlock(data,token):Observable<any>{
            return this.http.post("https://stagingapi.startasker.com/api/admin/blockOrUnblock",data,{headers:{"startasker":token}})
          }
          getMyOfferedTasks(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/offers/getOfferedPosts`,data,{headers:{"startasker":token}})  }
          // Account verification
          verifyCustomer(data,token):Observable<any>{
            return this.http.post("https://stagingapi.startasker.com/api/admin/verification",data,{headers:{"startasker":token}})
          }
          // Refferal
          getReferralData(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/referral`,data,{headers:{"startasker":token}})
          }
          fetchUserReffaral(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/fetchEarnedReferrals`,data,{headers:{"startasker":token}})
          }
          makeAsPaid(obj,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/referralpaid`,obj,{headers:{"startasker":token}})
          }
          // Chat Update
          updateChatMessages(obj,token):Observable<any>{
            return this.http.put(`${this.baseUrl}/api/postjob/offer_Chat_Update`,obj,{headers:{"startasker":token}})
          }
          // Delete chat messages
          deleteChatMessages(obj,token):Observable<any>{
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "startasker":token
              }),
              body: {
                "postID":obj.postID,
    "offeredUserID" : obj.offeredUserID,
	"userID" : obj.userID,
    "message" : obj.message,
    "timeStamp" : obj.timeStamp
              }
            }
            return this.http.delete(`${this.baseUrl}/api/postjob/chatDelete`,options)
          }
          fetchNotifications(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/fetchAdminNotifications`,data,{headers:{"startasker":token}})
          }
          fetchUserIDS(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/fetchCustomerIDs`,data,{headers:{"startasker":token}})
          }
          sendNotifications(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/admin/pushnotification`,data,{headers:{"startasker":token}})
          }
          deleteNotifiCation(data,token):Observable<any>{    
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "startasker":token
              }),
              body: {
                "notifyID":data.notifyID,
                userID: data.userID,
                type:data.type
              }
            }
            return this.http.delete(`${this.baseUrl}/api/admin/deleteNotification`,options)
          }
          deleteAllNotifiCations(data,token):Observable<any>{    
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "startasker":token
              }),
              body: {
                userID: data.userID,
                type:data.type
              }
            }
            return this.http.delete(`${this.baseUrl}/api/admin/deleteAllNotification`,options)
          }
          settingsCategoryInsert(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/categories/insert`,data,{headers:{"startasker":token}})
          }
          updateAmount(data,token):Observable<any>{
            return this.http.post(`${this.baseUrl}/api/categories/updateamountdata`,data,{headers:{"startasker":token}})
          }
          deleteCategory(data,token):Observable<any>{    
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "startasker":token
              }),
              body: {
                "categoryId":data.categoryId 
              }
            }
            return this.http.delete(`${this.baseUrl}/api/categories/delete`,options)
          }
}
