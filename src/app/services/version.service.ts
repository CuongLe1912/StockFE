import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class VersionService {
    public loginEvent: EventEmitter<any> = new EventEmitter();

    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
    
    constructor(private http: HttpClient) {}

    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
    public initVersionCheck(url: string, frequency = 1000 * 60 * 30, needChange?: any) {
        setInterval(() => {
            this.checkVersion(url, needChange);
        }, frequency);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
    public checkVersion(url: string, needChange?: any) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime())
            .subscribe(
                (response: any) => {
                    const hash = response.hash;
                    const version = response.version;
                    const hashChanged = this.hasHashChanged(this.currentHash, hash);

                    // If new version, do something
                    if (hashChanged) {
                        if (needChange) needChange(version);
                    }
                    // store the new hash so we wouldn't trigger versionChange again
                    // only necessary in case you did not force refresh
                    this.currentHash = hash;
                },
                (err) => {
                    console.error(err, 'Could not get version');
                }
            );
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }

        return currentHash !== newHash;
    }
}