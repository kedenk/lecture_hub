import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {WebsocketService} from './websocket.service';
import {Question, Answer, QuestionVoteRatioChanged, AnswerVoteRatioChanged,
    QuestionTextContentChanged, AnswerTextChanged, Mood} from '../api/model/models';
import {Moodchanged} from '../api/model/moodchanged';

@Injectable()
export class ServerNotificationService extends WebsocketService {

    private onNewQuestionTopic = 'onNewQuestion';
    private onNewAnswerTopic = 'onNewAnswer';
    private onQuestionVoteRatioChangedTopic = 'onQuestionVoteRatioChanged';
    private onAnswerVoteRatioChangedTopic = 'onAnswerVoteRatioChanged';
    private onQuestionTextContentChangedTopic = 'onQuestionTextContentChanged';
    private onAnswerTextChangedTopic = 'onAnswerTextChanged';
    private onMoodChangedTopic = 'onMoodChanged';

    public onNewQuestion(): Observable<Question> {
        return new Observable<Question>(observer => {
            this.socket.on(this.onNewQuestionTopic, (data: Question) => observer.next(data));
        });
    }

    public onNewAnswer(): Observable<Answer> {
        return new Observable<Answer>(observer => {
            this.socket.on(this.onNewAnswerTopic, (data: Answer) => observer.next(data));
        });
    }

    public onQuestionVoteRatioChanged(): Observable<QuestionVoteRatioChanged> {
        return new Observable<QuestionVoteRatioChanged>(observer => {
            this.socket.on(this.onQuestionVoteRatioChangedTopic, (data: QuestionVoteRatioChanged) => observer.next(data));
        });
    }

    public onAnswerVoteRatioChanged(): Observable<AnswerVoteRatioChanged> {
        return new Observable<AnswerVoteRatioChanged>(observer => {
            this.socket.on(this.onAnswerVoteRatioChangedTopic, (data: AnswerVoteRatioChanged) => observer.next(data));
        });
    }

    public onQuestionTextContentChanged(): Observable<QuestionTextContentChanged> {
        return new Observable<QuestionTextContentChanged>(observer => {
            this.socket.on(this.onQuestionTextContentChangedTopic, (data: QuestionTextContentChanged) => observer.next(data));
        });
    }

    public onAnswerTextChanged(): Observable<AnswerTextChanged> {
        return new Observable<AnswerTextChanged>(observer => {
            this.socket.on(this.onAnswerTextChangedTopic, (data: AnswerTextChanged) => observer.next(data));
        });
    }

    public onMoodChanged(): Observable<Moodchanged> {
        return new Observable<Moodchanged>(observer => {
            this.socket.on(this.onMoodChangedTopic, (data: Moodchanged) => observer.next(data));
        });
    }
}
