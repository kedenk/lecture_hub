export class ChatMessageSend {

    lectureid?: number;
    studentid?: string;
    message?: string;

    constructor(lectureID: number, studentid: string, message: string) {
        this.lectureid = lectureID;
        this.studentid = studentid;
        this.message = message;
    }
}
