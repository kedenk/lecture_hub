import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {StudentService, Student} from '../api/index';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class UserService {

    private cookieStudentId = 'userid';
    private cookieStudentName = 'username';

    // Observable sources
    private userLoginSource = new Subject<Student>();
    private userLogoutSource = new Subject<boolean>();

    // Observable string streams
    userLogin$ = this.userLoginSource.asObservable();
    userLogout$ = this.userLogoutSource.asObservable();

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
        return this.getStudentCookie() !== null;
    }

    public logout(): void {

        this.cookieService.delete(this.cookieStudentId);
        this.cookieService.delete(this.cookieStudentName);

        this.onUserLogout();
    }

    public login(username: string): Observable<Student> {

console.log("login", username);
        let currentUser = this.checkUsername( username );
        console.log("1");
        if ( currentUser === null ) {
            console.log("2");
            const newStudent: Student = new Student();
            console.log("2");
            newStudent.username = username;
            console.log("2");
            this.studentService.addStudent( newStudent ).subscribe(
                data => {
console.log(data);
                    currentUser = data;
                    this.setStudentCookie( currentUser );

                    // invoke userlogin event
                    this.onUserLogin( currentUser );

                    return new Observable<Student>((observer) => {
                        observer.next(currentUser);
                        observer.complete();
                    });
                },
                error => {
                    console.log(error);
                    console.log("error");
                }
            );

        } else {

            // invoke userlogin event
            this.onUserLogin( currentUser );

            return new Observable<Student>((observer) => {
                observer.next(currentUser);
                observer.complete();
            });
        }
    }

    private setStudentCookie( student: Student ): void {

        this.cookieService.set( this.cookieStudentId, student.studentID, 2147483647);
        this.cookieService.set( this.cookieStudentName, student.username, 2147483647);
    }

    private getStudentCookie(): Student {

        if ( this.cookieService.check(this.cookieStudentId) && this.cookieService.check(this.cookieStudentName) ) {

            const student: Student = new Student();
            student.studentID = this.cookieService.get(this.cookieStudentId);
            student.username = this.cookieService.get(this.cookieStudentName);

            return student;
        } else {
            return null;
        }
    }

    private checkUsername( username: string ): Student {

        const student: Student = this.getStudentCookie();
        if ( student !== null && student.username === username) {
            return student;
        } else {
            return null;
        }
    }

    /***
     * Emits an event that a user logged in
     * @param {Student} student
     */
    private onUserLogin( student: Student ): void {

        this.userLoginSource.next( student );
    }

    /***
     * Emits an event that a user logged out
     */
    private onUserLogout(): void {

        this.userLogoutSource.next( true );
    }
}
