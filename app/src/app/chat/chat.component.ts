import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Lecture} from '../api/model/lecture';
import {UserService} from '../services/user.service';
import {Student, ChatMessageRec} from '../api/model/models';
import {ChatService} from '../services/chat.service';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

    @Input()
    lecture: Lecture;
    currentStudent: Student;

    messages: ChatMessageRec[] = [];

    chatForm: FormGroup;

    chatMessageSubscription: Subscription;

    constructor(private userService: UserService,
                private chatService: ChatService) {}

    ngOnInit(): void {

        this.currentStudent = this.userService.getCurrentUser();
        if ( this.currentStudent === undefined ) {
            console.error('Cant get user. Something is wrong');

        } else {
            this.chatService.initSocket();
            this.chatService.registerChat(this.lecture.lectureid, this.currentStudent.studentid);
        }

        this.chatForm = new FormGroup({
            chatMessage: new FormControl()
        });

        this.chatMessageSubscription = this.chatService.onMessage().subscribe(
            msg => {

                if ( msg !== undefined && this.lecture.lectureid === msg.lectureid ) {

                    const tmp = new ChatMessageRec(msg.lectureid, msg.username, msg.message);
                    tmp.date = new Date();

                    this.addChatMessage(tmp);
                }
            }
        );
    }

    /***
     * Clean up
     */
    ngOnDestroy(): void {

        // unsubscribe subscribtions
        this.chatMessageSubscription.unsubscribe();
    }

    addChatMessage( message: ChatMessageRec ): void {

        this.messages.push(message);
    }

    /***
     * Send chat message to server
     */
    onChatMessageSubmit(): void {

        if ( this.chatForm.valid ) {
            // webservice
            this.chatService.sendMessage(this.lecture.lectureid, this.currentStudent.studentid, this.chatForm.value.chatMessage);
            this.chatForm.reset();
        }
    }
}
