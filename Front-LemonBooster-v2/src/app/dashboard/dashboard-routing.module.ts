import { EditProgramComponent } from './../pages/edit-program/edit-program.component';
import { ProgramUrlComponent } from './../pages/program-url/program-url.component';
import { NewProgramComponent } from './../pages/new-program/new-program.component';
import { ProgramsComponent } from './../pages/programs/programs.component';

import { Routes } from '@angular/router';
import { ComingSoonComponent } from '../pages/coming-soon/coming-soon.component';
import { DocsComponent } from '../pages/docs/docs.component';


export const DashboardRoutes: Routes = [
  { path: 'programs', component: ProgramsComponent }, 
  { path: 'programs/new-program', component: NewProgramComponent },
  { path: 'programs/:url/edit', component: EditProgramComponent },
  { path: 'programs/:url', component: ProgramUrlComponent },

  { path: 'findomain', component: ComingSoonComponent },
  { path: 'linkfinder', component: ComingSoonComponent },
  { path: 'arjun', component: ComingSoonComponent },
  { path: 'dirsearch', component: ComingSoonComponent },
  { path: 'jsearch', component: ComingSoonComponent },
];


