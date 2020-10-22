import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(
    public apiService: ApiService
  ) { }

  GetProgram(url){
    return this.apiService.GET(`programs/${url}`);
  }

  GetPrograms(){
    return this.apiService.GET('programs');
  }

  RemoveProgram(id){
    return this.apiService.DELETE(`programs/${id}`);
  }

  AddProgram(params: any){
    return this.apiService.POST('programs', params);
  }

  EditProgram(url, params: any){
    return this.apiService.PUT(`programs/${url}`, params);
  }
}
