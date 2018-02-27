import {Injectable} from '@angular/core';
import * as socketIO from 'socket.io-client';

@Injectable()
export class WebsocketService {

    protected baseUrl = 'http://localhost:3000';
    protected socket;

    constructor() {}

    public setBaseUrl( baseUrl: string ): void {
        this.baseUrl = baseUrl;
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    public initSocket() {
        this.socket = socketIO(this.baseUrl);
    }

    public send( topic: string, msg: any ) {

        this.socket.emit(topic, msg);
    }
}
