import { Component, OnInit } from '@angular/core';
import {Student} from '../api/model/student';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: Student;

  firstname: string;
  lastname: string;
  email: string;

  constructor(
      private userService: UserService
  ) { }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);
  }

}
