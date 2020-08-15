import { ROUTES } from './../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from "@angular/common";

var misc: any = {
  sidebar_mini_active: true
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private listTitles: any[];
  location: Location;

  private toggleButton: any;
  public isCollapsed = true;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router
  ) {
    this.location = location;
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)

  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("sidebar-mini");
      misc.sidebar_mini_active = true;
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function() {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function() {
      clearInterval(simulateWindowResize);
    }, 1000);
  }
  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe(event => {
      this.sidebarClose();
    });
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = <HTMLElement>(
      document.getElementsByTagName("body")[0]
    );
    const html = document.getElementsByTagName("html")[0];
    if (window.innerWidth < 991) {
      body.style.position = "fixed";
    }

    setTimeout(function() {
      toggleButton.classList.add("toggled");
    }, 200);

    html.classList.add("nav-open");
    var $layer = document.createElement('div');
    $layer.setAttribute('id', 'bodyClick');


    if (html.getElementsByTagName('body')) {
        document.getElementsByTagName('body')[0].appendChild($layer);
    }
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    $layer.onclick = function() { //asign a function
      html.classList.remove('nav-open');
      setTimeout(function() {
          $layer.remove();
          $toggle.classList.remove('toggled');
      }, 200);
      const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

      if (window.innerWidth < 991) {
        setTimeout(function(){
          mainPanel.style.position = '';
        }, 200);
      }
    }.bind(this);

    html.classList.add('nav-open');
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];
    this.toggleButton.classList.remove("toggled");
    const body = <HTMLElement>(
      document.getElementsByTagName("body")[0]
    );

    if (window.innerWidth < 991) {
      setTimeout(function() {
        body.style.position = "";
      }, 500);
    }
    var $layer: any = document.getElementById("bodyClick");
    
    if ($layer) {
      $layer.remove();
    }

    html.classList.remove("nav-open");
  }
}
