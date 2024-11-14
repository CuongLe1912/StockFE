import { Pipe, Injectable, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: "sanitizeHtml"
})
@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(html: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
} 
