import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {StudentService, Student} from '../api/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

    cookieStudentId = 'userid';
    cookieStudentName = 'username';

    constructor(
        private cookieService: CookieService,
        private studentService: StudentService
    ) {}

    public getCurrentUserId(): string {
        return this.getStudentCookie().studentID;
    }

    public getCurrentUser(): Student {
        return this.getStudentCookie();
    }

    public isLoggedIn(): boolean {
        if( this.getStudentCookie() !== null ) {
            return true;
        } else {
            return false;
        }
    }

    public logout(): void {
        console.log("logout");
        this.cookieService.delete(this.cookieStudentId);
        this.cookieService.delete(this.cookieStudentName);
    }

    public login(username: string): Observable<Student> {

        console.log("All cookies");
        console.log(this.cookieService.getAll());
        let currentUser = this.checkUsername( username );
        if ( currentUser === null ) {

            console.log("user not in cookie");
            console.log("create new");

            let newStudent: Student = new Student();
            newStudent.username = username;
            this.studentService.addStudent( newStudent ).subscribe(
                data => {
                    console.log( "new user" );
                    console.log( data );
                    currentUser = data;
                    this.setStudentCookie( currentUser );

                    return new Observable<Student>((observer) => {
                        observer.next(currentUser);
                        observer.complete();
                    });
                },
                error => {
                    console.error("Can't add student");
                    new Error("No Server connection.");
                }
            );

        } else {

            console.log("user in cookies");

            return new Observable<Student>((observer) => {
                observer.next(currentUser);
                observer.complete();
            });
        }
    }

    private setStudentCookie( student: Student ): void {

        console.log("Set cookie: ", student);
        this.cookieService.set( this.cookieStudentId, student.studentID, 2147483647);
        this.cookieService.set( this.cookieStudentName, student.username, 2147483647);
    }

    private getStudentCookie(): Student {

        if( this.cookieService.check(this.cookieStudentId) && this.cookieService.check(this.cookieStudentName) ) {

            let student: Student = new Student();
            student.studentID = this.cookieService.get(this.cookieStudentId);
            student.username = this.cookieService.get(this.cookieStudentName);

            return student;
        } else {
            return null;
        }
    }

    private checkUsername( username: string ): Student {

        let student: Student = this.getStudentCookie();
        if( student !== null && student.username === username) {
            return student;
        } else {
            return null;
        }
    }
}
