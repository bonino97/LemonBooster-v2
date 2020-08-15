import { WebsocketService } from './websocket.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(
    public apiService: ApiService,
    public wsService: WebsocketService
  ) { }

  /* AMASS SECTION */

  GetAmass(url){
    return this.apiService.GET(`amass/${url}`);
  }

  ExecuteAmassWithASNs(url, params){
    return this.apiService.POST(`amass/${url}/asn`, params);
  }

  ExecuteAmassWithCIDRs(url, params){
    return this.apiService.POST(`amass/${url}/cidr`, params);
  }
  
  WsExecuteAmassWithASNs(payload){
    this.wsService.Emit('execute-amass-asn', payload);
  }

  WsExecuteAmassWithCIDRs(payload){
    return this.wsService.Emit('execute-amass-cidr', payload);
  }

  GetExecutedAmass() {
    return this.wsService.Listen('executed-amass');
  }

  /* ENUMERATION SECTION */

  GetSubdomainEnumeration(url){
    return this.apiService.GET(`enumeration/${url}`);
  }

  ExecuteSubdomainEnumeration(url, params){
    return this.apiService.POST(`enumeration/${url}`, params);
  }

  WsExecuteSubdomainEnumeration(payload){
    this.wsService.Emit('execute-subdomain-enumeration', payload);
  }

  GetExecutedSubdomainEnumeration() {
    return this.wsService.Listen('executed-subdomain-enumeration');
  }


}
