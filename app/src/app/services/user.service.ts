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

    /***
     * Returns the current user id
     * @returns {string}
     */
    public getCurrentUserId(): string {
        return this.getStudentCookie().studentID;
    }

    /***
     * Returns the current user
     * @returns {Student}
     */
    public getCurrentUser(): Student {
        return this.getStudentCookie();
    }

    /***
     * Returns true, if user is logged in. Otherwise false
     * @returns {boolean}
     */
    public isLoggedIn(): boolean {
        return this.getStudentCookie() !== null;
    }

    /***
     * Logout a user and delets the cookies
     */
    public logout(): void {

        this.cookieService.delete(this.cookieStudentId);
        this.cookieService.delete(this.cookieStudentName);

        this.onUserLogout();
    }


    /***
     * Login a user and creates the cookies
     * @param {string} username
     */
    public login(username: string): void {

        let currentUser = this.checkUsername( username );

        if ( currentUser === null ) {

            const newStudent: Student = new Student();

            newStudent.studentID = undefined;
            newStudent.username = username;

            this.studentService.addStudent( newStudent ).subscribe(
                data => {
                    currentUser = data;
                    this.setStudentCookie( currentUser );

                    // invoke userlogin event
                    this.onUserLogin( currentUser );
                },
                error => {
                    console.log(error);
                    console.log("error");
                }
            );

        } else {

            // invoke userlogin event
            this.onUserLogin( currentUser );
        }
    }

    /***
     * Sets the cookies for the current user
     * @param {Student} student
     */
    private setStudentCookie( student: Student ): void {

        this.cookieService.set( this.cookieStudentId, student.studentID, 2147483647);
        this.cookieService.set( this.cookieStudentName, student.username, 2147483647);
    }

    /***
     * Returns the cookies for the current user, if available. Otherwise null
     * @returns {Student}
     */
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

    /***
     * Checks, if given username is in cookies
     * @param {string} username
     * @returns {Student}
     */
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
