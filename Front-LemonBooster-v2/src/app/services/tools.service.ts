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

  GetSubdomainsResults(url, scope){
    return this.apiService.GET(`results/${url}/subdomains?scope=${scope}`); 
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

  GetAlivesResults(url, scope){
    return this.apiService.GET(`results/${url}/alives?scope=${scope}`); 
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

  GetResponseCodeResults(url, scope){
    return this.apiService.GET(`results/${url}/response-codes?scope=${scope}`); 
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

  GetWaybackResults(url, scope){
    return this.apiService.GET(`results/${url}/wayback?scope=${scope}`); 
  }

  GetWaybackResultsBySubdomain(url, scope, subdomain){
    return this.apiService.GET(`results/${url}/wayback-subdomain?scope=${scope}&subdomain=${subdomain}`); 
  }

  //GOSPIDER 

  ExecuteAllGoSpider(url, params){
    return this.apiService.POST(`discovery/${url}/gospider/all`, params);
  }

  WsExecuteAllGoSpider(payload){
    this.wsService.Emit('execute-gospider-all', payload);
  }

  GetExecutedGoSpider() {
    return this.wsService.Listen('executed-gospider');
  }


  ExecuteGoSpiderBySubdomain(url, params){
    return this.apiService.POST(`discovery/${url}/gospider`, params);
  }

  WsExecuteGoSpiderBySubdomain(payload){
    this.wsService.Emit('execute-gospider', payload);
  }

  GetGoSpiderResults(url, scope){
    return this.apiService.GET(`results/${url}/gospider?scope=${scope}`); 
  }

  GetGoSpiderResultsBySubdomain(url, scope, subdomain){
    return this.apiService.GET(`results/${url}/gospider-subdomain?scope=${scope}&subdomain=${subdomain}`); 
  }

  //HAKRAWLER 

  ExecuteAllHakrawler(url, params){
    return this.apiService.POST(`discovery/${url}/hakrawler/all`, params);
  }

  WsExecuteAllHakrawler(payload){
    this.wsService.Emit('execute-hakrawler-all', payload);
  }

  GetExecutedHakrawler() {
    return this.wsService.Listen('executed-hakrawler');
  }


  ExecuteHakrawlerBySubdomain(url, params){
    return this.apiService.POST(`discovery/${url}/hakrawler`, params);
  }


  WsExecuteHakrawlerBySubdomain(payload){
    this.wsService.Emit('execute-hakrawler', payload);
  }

  GetHakrawlerResults(url, scope){
    return this.apiService.GET(`results/${url}/hakrawler?scope=${scope}`); 
  }

  GetHakrawlerResultsBySubdomain(url, scope, subdomain){
    return this.apiService.GET(`results/${url}/hakrawler-subdomain?scope=${scope}&subdomain=${subdomain}`); 
  }

  //DIRSEARCH 

  GetDirsearchLists(url) {
    return this.apiService.GET(`discovery/${url}/dirsearch/lists`);
  }

  ExecuteAllDirsearch(url, params){
    return this.apiService.POST(`discovery/${url}/dirsearch/all`, params);
  }

  WsExecuteAllDirsearch(payload){
    this.wsService.Emit('execute-dirsearch-all', payload);
  }

  ExecuteDirsearchBySubdomain(url, params){
    return this.apiService.POST(`discovery/${url}/dirsearch`, params);
  }

  WsExecuteDirsearchBySubdomain(payload){
    this.wsService.Emit('execute-dirsearch', payload);
  }

  GetExecutedDirsearch() {
    return this.wsService.Listen('executed-dirsearch');
  }

  GetDirsearchResults(url, scope){
    return this.apiService.GET(`results/${url}/dirsearch?scope=${scope}`); 
  }

  GetDirsearchResultsBySubdomain(url, scope, subdomain){
    return this.apiService.GET(`results/${url}/dirsearch-subdomain?scope=${scope}&subdomain=${subdomain}`); 
  }

  //MONITORING

  GetMonitoringResults(url, scope, type, page, limit, startDate, endDate, filter){
    return this.apiService.GET(`monitoring/${url}?scope=${scope}&type=${type}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}&filter=${filter}`);
  }

  //COMPLETE SCAN

  WsExecuteCompleteScan(payload){
    this.wsService.Emit('execute-complete-scan', payload);
  }

  GetCompletedScan(){
    return this.wsService.Listen('completed-scan');
  }

}
