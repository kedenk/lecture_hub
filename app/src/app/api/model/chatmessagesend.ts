export class ChatMessageSend {

    lectureID?: number;
    studentID?: string;
    message?: string;

    constructor(lectureID: number, studentID: string, message: string) {
        this.lectureID = lectureID;
        this.studentID = studentID;
        this.message = message;
    }
}
