import {Pipe, PipeTransform} from '@angular/core';

/***
 * This pipe cut the given string to a specific length for text previews
 */
@Pipe({name: 'textPreview' })
export class TextpreviewPipe implements PipeTransform {

    // Standard length of the preview text
    stdLength = 100;

    transform(text: string, length?: number): string {

        let newStr = '';
        let len = this.stdLength;

        if ( length !== undefined && !isNaN(length) ) {
            len = length;
        }

        if ( this.checkLength(text, len) ) {
            newStr = (text.substr(0, length - 3) + '...');
        } else {
            newStr = text;
        }

        return newStr;
    }

    /***
     * Method checks, if the given has to be sliced
     * @param text
     * @param length
     * @returns {boolean} Returns true, if it has to be sliced
     */
    private checkLength(text: string, length: number): boolean {

        if ( text.length < length ) {
            return false;
        } else {
            return true;
        }
    }
}
