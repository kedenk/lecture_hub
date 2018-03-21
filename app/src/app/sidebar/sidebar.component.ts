import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: 'user', title: 'User Profile',  icon:'pe-7s-user', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor(
        private userService: UserService,
        private route: Router
    ) { }

    ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    logout(): void {
        this.userService.logout();
        this.route.navigate(['/']);
    }

    isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
    };
}
