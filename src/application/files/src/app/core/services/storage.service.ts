import { Injectable, Optional } from "@angular/core";
import { SessionStorageStore } from "@ku/auth";

@Injectable()
export class StorageService {
    constructor(private storageService: SessionStorageStore) {
        return;
    }

    public setQueryParameter(key: string, param: Object) {
        this.storageService.set(key, param);
    }

    public getQueryParameter(key: string) {
        return this.storageService.get(key);
    }
}
