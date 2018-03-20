export class ChatMessageRec {

    lectureID?: number;
    username?: string;
    message?: string;

    date?: Date;

    constructor(lectureID: number, username: string, message: string) {
        this.lectureID = lectureID;
        this.username = username;
        this.message = message;
    }
}
