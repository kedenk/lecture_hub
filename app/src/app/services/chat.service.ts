import {Injectable, OnInit} from '@angular/core';
import * as socketIO from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {ChatMessageSend} from "../api/model/chatmessagesend";
import {ChatMessageRec} from "../api/model/chatmessagerec";

class RegisterMessage {

    public lectureID: number;
    public studentID: string;

    constructor( lectureID: number, studentID: string ) {
        this.lectureID = lectureID;
        this.studentID = studentID;
    }
}

@Injectable()
export class ChatService implements OnInit {

    private url = 'http://localhost:3000';
    private socket;

    private onMessageTopic = 'onSendMessage';
    private onPropagateTopic = 'onReceiveMessage';
    private onRegisterTopic = 'onRegisterForChat';

    ngOnInit(): void {
    }

    public initSocket() {

        this.socket = socketIO(this.url);
    }

    public registerChat( lectureID: number, studentID: string): void {

        const msg: RegisterMessage = new RegisterMessage(lectureID, studentID);
        this.socket.emit(this.onRegisterTopic, msg);
    }

    public sendMessage( lectureID: number, studentID: string, message: string ): void {

        const msg: ChatMessageSend = new ChatMessageSend(lectureID, studentID, message);
        this.socket.emit(this.onMessageTopic, msg);
    }

    public onMessage(): Observable<ChatMessageRec> {
        return new Observable<ChatMessageRec>(observer => {
            this.socket.on(this.onPropagateTopic, (data: ChatMessageRec) => {
                console.log(data);
                observer.next(data);
            });
        });
    }
}
