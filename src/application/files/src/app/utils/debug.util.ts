import { environment } from "./../../environments/environment";
import { Observable } from "rxjs";
declare module "rxjs/internal/Observable" {
    interface Observable<T> {
        debug: (...any) => Observable<T>;
    }
}
Observable.prototype.debug = function(message: string) {
    let started;
    if (!environment.production) {
        started = Date.now();
    }
    return this.do(
        next => {
            if (!environment.production) {
                console.group(`[${message}]成功，返回 `, next);
                const elapsed = Date.now() - started;
                console.log(`[耗时] ${elapsed} ms`);
                console.groupEnd();
            }
        },
        err => {
            if (!environment.production) {
                console.error(`[${message}]失败，返回 `, err);
                const elapsed = Date.now() - started;
                console.log(`[耗时] ${elapsed} ms`);
                console.groupEnd();
            }
        },
        _ => {
            // complete处有延迟,不能用于计时
        }
    );
};
