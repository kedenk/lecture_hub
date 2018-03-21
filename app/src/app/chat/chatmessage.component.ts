import {Component, Input, OnInit} from '@angular/core';
import {ChatMessageRec} from '../api/model/chatmessagerec';
import {Student} from '../api/model/student';
import {UserService} from '../services/user.service';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chatmessage.component.html',
    styleUrls: ['./chatmessage.component.css']
})
export class ChatMessageComponent implements OnInit {

    @Input()
    chatMessage: ChatMessageRec;

    currentUser: Student;

    constructor(private userService: UserService) {}

    ngOnInit(): void {

        if ( this.chatMessage === undefined ) {
            throw new Error('Something went wrong. No chatmessage provided.');
        }

        // get current user from user service
        this.currentUser = this.userService.getCurrentUser();
    }

    /***
     * Checks, if the current user is the author of the chat message
     * @returns {boolean}
     */
    isUserAuthor(): boolean {
        return this.currentUser.username === this.chatMessage.username;
    }
}
