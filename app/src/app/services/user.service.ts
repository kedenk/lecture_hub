import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {StudentService, Student} from '../api/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

    currentUser: Student;

    cookieId = 'userid';

    constructor(
        private cookieService: CookieService,
        private studentService: StudentService
    ) {}

    public getCurrentUserId(): string {
        return this.cookieService.get('userid');
    }

    public getCurrentUser(): Student {
        return this.currentUser;
    }

    public isLoggedIn(): string {
        console.log(this.cookieService.getAll());

        return this.getCurrentUserId();
    }

    public logout(): void {
        this.cookieService.delete(this.cookieId);
        this.currentUser = undefined;
    }

    public getUserId(username): Observable<Student> {

        const userId: string = this.cookieService.get(this.cookieId);
        if ( userId === undefined ) {

            return this.getNewUserId(username);
        }

        const student: Student = new Student();
        student.username = username;
        student.studentid = userId;

        return new Observable<Student>((observer) => {
            observer.next(student);
            observer.complete();
        });
    }

    private getNewUserId(username): Observable<Student> {

        const newStudent: Student = new Student();
        newStudent.username = username;

        this.studentService.addStudent(newStudent).subscribe(
            data => {
                this.currentUser = data;
                this.storeUserId(data.studentid);
                return new Observable<Student>((observer) => {
                    observer.next(data);
                    observer.complete();
                });
            }
        );

        return null;
    }

    private storeUserId(userId): void {

        this.cookieService.set(this.cookieId, userId);
    }
}
