import { Injectable } from '@angular/core';

declare var $: any;

export enum NotificationTypes {
    info = 1,
    success = 2,
    warning = 3,
    danger = 4
}

export enum NotificationPosition {
    top = 0,
    left = 1,
    right = 2,
    bottom = 4
}

export enum NotificationAlign {
    left = 0,
    right = 1,
    center = 2
}

@Injectable()
export class UinotificationService {

    /*
    Types can be:
        0:
        1: info
        2: success
        3: warning
        4: danger
     */
    private type = ['', 'info', 'success', 'warning', 'danger'];
    private position = ['top', 'left', 'right', 'bottom'];
    private alignment = ['left', 'right', 'center']

    /***
     * Shows a notification
     * @param from
     * @param align
     * @param type Can be between 0 to 4
     */
    public showNotification(from, align, type, message): void {

        $.notify({
            icon: 'pe-7s-gift',
            message: message
        }, {
            type: this.type[type],
            timer: 1000,
            placement: {
                from: this.position[from],
                align: this.alignment[align]
            }
        });
    }
}
