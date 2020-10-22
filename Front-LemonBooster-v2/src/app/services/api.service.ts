import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

export class ResponseGeneric {
  success: boolean;
  data: any;
  error: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = `http://${localStorage.getItem('IpVPS')}:5000/api`;

  constructor(
    private http: HttpClient,
    
  ) { 
    console.log('API');  
  }

  POST(entity, data:any):Observable<any>{
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    
    return this.http.post(`${this.url}/${entity}`, params, {
      headers: headers
    });
  }

  PUT(entity, data:any):Observable<any>{
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    
    return this.http.put(`${this.url}/${entity}`, params, {
      headers: headers
    });
  }

  DELETE(entity):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    
    return this.http.delete(`${this.url}/${entity}`, {
      headers: headers
    });
  }

  GET(entity):Observable<any> { 
    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.get(`${this.url}/${entity}`,{
      headers: headers
    });
  }

  
}
