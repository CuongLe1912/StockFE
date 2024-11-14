import { Pipe, Injectable, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({
    name: "sanitizeUrl"
})
@Injectable()
export class SanitizeUrlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(url: string): SafeUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
} 
