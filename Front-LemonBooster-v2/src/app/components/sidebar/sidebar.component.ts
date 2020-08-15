import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
}


export const ROUTES: RouteInfo[] = [
  {
    path: "/programs",
    title: "Programs",
    type: "link",
    icontype: "tim-icons icon-chart-pie-36",
  },
  {
    path: "/findomain",
    title: "Findomain",
    type: "link",
    icontype: "tim-icons icon-atom",
  },
  {
    path: "/linkfinder",
    title: "LinkFinder",
    type: "link",
    icontype: "tim-icons icon-bullet-list-67",
  },
  {
    path: "/arjun",
    title: "Arjun",
    type: "link",
    icontype: "tim-icons icon-app",
  },
  {
    path: "/dirsearch",
    title: "Dirsearch",
    type: "link",
    icontype: "tim-icons icon-attach-87",
  },
  {
    path: "/jsearch",
    title: "JSearch",
    type: "link",
    icontype: "tim-icons icon-paper",
  }
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any;

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
