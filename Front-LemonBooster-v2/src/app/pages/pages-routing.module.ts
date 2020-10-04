import { RouterModule, Routes } from '@angular/router';

import { EditProgramComponent } from './../pages/edit-program/edit-program.component';
import { ProgramUrlComponent } from './../pages/program-url/program-url.component';
import { NewProgramComponent } from './../pages/new-program/new-program.component';
import { ProgramsComponent } from './../pages/programs/programs.component';
import { ComingSoonComponent } from '../pages/coming-soon/coming-soon.component';
import { NgModule } from '@angular/core';


const PagesRoutes: Routes = [
  { path: 'programs/list', component: ProgramsComponent }, 
  { path: 'programs/new-program', component: NewProgramComponent },
  { path: 'programs/:url/edit', component: EditProgramComponent },
  { path: 'programs/:url', component: ProgramUrlComponent },

  { path: 'findomain', component: ComingSoonComponent },
  { path: 'linkfinder', component: ComingSoonComponent },
  { path: 'arjun', component: ComingSoonComponent },
  { path: 'dirsearch', component: ComingSoonComponent },
  { path: 'jsearch', component: ComingSoonComponent },
];


@NgModule({
  imports: [RouterModule.forChild(PagesRoutes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
