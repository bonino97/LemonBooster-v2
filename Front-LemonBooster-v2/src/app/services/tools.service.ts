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

  GetEnumerationProgram(url){
    return this.apiService.GET(`enumeration/${url}`);
  }

  ExecuteSubdomainEnumeration(url, params){
    return this.apiService.POST(`enumeration/${url}`, params);
  }

  WsExecuteSubdomainEnumeration(payload){
    this.wsService.Emit('execute-subdomain-enumeration', payload);
  }

  WsExecutePermutationEnumeration(payload){
    this.wsService.Emit('execute-permutation-enumeration', payload);
  }

  WsExecuteGithubEnumeration(payload){
    this.wsService.Emit('execute-github-enumeration', payload);
  }

  GetExecutedSubdomainEnumeration() {
    return this.wsService.Listen('executed-subdomain-enumeration');
  }

  GetProgramSubdomainsByScope(url, page, limit, scope, filter){
    return this.apiService.GET(`enumeration/${url}/subdomains?page=${page}&limit=${limit}&scope=${scope}&filter=${filter}`); 
  }

  //ALIVE  

  ExecuteAlive(url, params){
    return this.apiService.POST(`enumeration/${url}/alive`, params);
  }

  WsExecuteAlive(payload){
    this.wsService.Emit('execute-alive', payload);
  }

  GetExecutedAlive() {
    return this.wsService.Listen('executed-alive');
  }

  GetAlivesByScope(url, page, limit, scope, filter) {
    return this.apiService.GET(`enumeration/${url}/alives?page=${page}&limit=${limit}&scope=${scope}&filter=${filter}`); 
  }


  //SCREENSHOTS

  ExecuteScreenshots(url, params){
    return this.apiService.POST(`enumeration/${url}/screenshot`, params);
  }

  WsExecuteScreenshots(payload){
    this.wsService.Emit('execute-screenshot', payload);
  }

  GetExecutedScreenshots() {
    return this.wsService.Listen('executed-screenshot');
  }

  GetScreenshotsFile(url, scope){
    return this.apiService.GET(`enumeration/${url}/screenshot?scope=${scope}`);
  }

  //JSSCANNER

  ExecuteJSScanner(url, params){
    return this.apiService.POST(`enumeration/${url}/js`, params);
  }

  WsExecuteJSScanner(payload){
    this.wsService.Emit('execute-jsscanner', payload);
  }

  GetExecutedJSScanner() {
    return this.wsService.Listen('executed-jsscanner');
  }

  GetJSFile(url, scope, alive){
    return this.apiService.GET(`enumeration/${url}/js?scope=${scope}&subdomain=${alive}`);
  }

  //RESPONSECODES 

  ExecuteSubdomainResponseCodes(url, params){
    return this.apiService.POST(`enumeration/${url}/response-codes`, params);
  }

  WsExecuteSubdomainResponseCodes(payload){
    this.wsService.Emit('execute-response-codes', payload);
  }

  GetExecutedSubdomainResponseCodes() {
    return this.wsService.Listen('executed-response-codes');
  }

  GetSubdomainResponseCodes(url, page, limit, scope, filter){
    return this.apiService.GET(`enumeration/${url}/response-codes?page=${page}&limit=${limit}&scope=${scope}&filter=${filter}`);
  }

  //WAYBACKURLS 

  ExecuteAllWaybackurls(url, params){
    return this.apiService.POST(`discovery/${url}/waybackurls/all`, params);
  }

  WsExecuteAllWaybackurls(payload){
    this.wsService.Emit('execute-waybackurls-all', payload);
  }

  GetExecutedWaybackurls() {
    return this.wsService.Listen('executed-waybackurls');
  }


  ExecuteWaybackurlBySubdomain(url, params){
    return this.apiService.POST(`discovery/${url}/waybackurls`, params);
  }


  WsExecuteWaybackurlsBySubdomain(payload){
    this.wsService.Emit('execute-waybackurls', payload);
  }


}
