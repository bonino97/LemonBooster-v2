import { FormBuilder } from '@angular/forms';
import { ToolsService } from './../../services/tools.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-amass',
  templateUrl: './amass.component.html',
  styleUrls: ['./amass.component.scss']
})
export class AmassComponent implements OnInit {
  asnForm: FormGroup;
  program:any;
  checkedAsns:any = [];
  textAsn: any = '';
  
  cidrForm: FormGroup;
  checkedCidrs:any = [];
  textCidr: any = '';

  constructor(
    public route : ActivatedRoute,
    public toolService:ToolsService,
    private formBuilder: FormBuilder
  ) {
    this.asnForm = this.formBuilder.group({
      ASNs: this.formBuilder.array([])
    });

    this.cidrForm = this.formBuilder.group({
      CIDRs: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (data) => {
        this.toolService.GetAmass(data['url'])
        .subscribe((data:any) => {
          this.program = data.data;
        });
      });
    this.toolService.GetExecutedAmass().subscribe();
  }

  onCheckboxChangeAsns(e){

    const ASNs: FormArray = this.asnForm.get('ASNs') as FormArray;
  
    if (e.target.checked) {
      ASNs.push(new FormControl(e.target.value));
      this.checkedAsns.push(e.target.value);
    } else {
       const index = ASNs.controls.findIndex(x => x.value === e.target.value);
       ASNs.removeAt(index);
       this.checkedAsns = removeItemFromArr(this.checkedAsns, e.target.value);
    }

    this.textAsn = this.checkedAsns.toString();

  }

  onCheckboxChangeCidrs(e){

    const CIDRs: FormArray = this.cidrForm.get('CIDRs') as FormArray;
  
    if (e.target.checked) {
      CIDRs.push(new FormControl(e.target.value));
      this.checkedCidrs.push(e.target.value);
    } else {
       const index = CIDRs.controls.findIndex(x => x.value === e.target.value);
       CIDRs.removeAt(index);
       this.checkedCidrs = removeItemFromArr(this.checkedCidrs, e.target.value);
    }

    this.textCidr = this.checkedCidrs.toString();

  }

  asnExec(){
    this.route.params.subscribe(
      (data) => {
        this.toolService.WsExecuteAmassWithASNs(this.asnForm.value); // Ejecuto herramienta.
        this.toolService.ExecuteAmassWithASNs(data['url'], this.asnForm.value) // Guardo resultados.
        .subscribe((data:any) => {
        });
      });
  }

  cidrExec(){
    this.route.params.subscribe(
      (data) => {
        this.toolService.WsExecuteAmassWithCIDRs(this.cidrForm.value); // Ejecuto herramienta.
        this.toolService.ExecuteAmassWithCIDRs(data['url'], this.cidrForm.value) // Guardo resultados.
        .subscribe((data:any) => {
        });
      });
  }

}

function removeItemFromArr( arr, item ){
  var i = arr.indexOf( item );

  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
  return arr;
}