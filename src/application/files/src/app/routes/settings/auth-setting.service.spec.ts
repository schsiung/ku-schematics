import { defer } from "rxjs";
import { TestBed, inject } from "@angular/core/testing";
import { AuthSettingService } from "./auth-setting.service";
import { HttpClient } from "@angular/common/http";
import {
    BaseResponseOptions,
    Http,
    HttpModule,
    Response,
    ResponseOptions
} from "@angular/http";
import { MockBackend } from "@angular/http/testing";

export function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}
describe("AuthSettingService", () => {
    // let httpClientSpy: { get: jasmine.Spy };
    let service: AuthSettingService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule]
            // providers: [
            //     {
            //         provide: HttpClient,
            //         useFactory: (mockBackend, options) => {
            //             return new Http(mockBackend, options);
            //         },
            //         deps: [MockBackend, BaseResponseOptions]
            //     },
            //     MockBackend,
            //     BaseResponseOptions,
            //     AuthSettingService
            // ]
        });
        service = TestBed.get(AuthSettingService);
    });

    xit("获取用户列表", () => {
        service.getUsers().subscribe(list => {
            expect(list).toBeDefined();
        });
        //  httpClientSpy.get.and.returnValue(asyncData(userList));
        //  expect(service.getUsers()).toEqual(userList);
        // AccountService.getUsers().subscribe(
        //     users => expect(users).toEqual(userList, "获取用户列表成功"),
        //     fail
        // );
        //  expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
        //  expect(AccountService).toBeTruthy();
        //  expect(AccountService).not.toThrow();
    });
});
