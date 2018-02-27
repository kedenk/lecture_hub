export class ChatMessageRec {

    lectureid?: number;
    username?: string;
    message?: string;

    date?: Date;

    constructor(lectureID: number, username: string, message: string) {
        this.lectureid = lectureID;
        this.username = username;
        this.message = message;
    }
}
