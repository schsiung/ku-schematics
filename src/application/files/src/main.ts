import { enableProdMode, ViewEncapsulation } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "@env/environment";
import "@core/preloader/preloader";
// hmr热更新模块
import { hmrBootstrap } from "./hmr";
if (environment.production) {
    enableProdMode();
}

const bootstrap = () => {
    return platformBrowserDynamic().bootstrapModule(AppModule, {
        defaultEncapsulation: ViewEncapsulation.Emulated,
        preserveWhitespaces: false
    });
};
const closeLoading = () => {
    if ((<any>window).appBootstrap) {
        (<any>window).appBootstrap();
    }
};
if (environment.hmr&&module["hot"]) {
        hmrBootstrap(module, bootstrap);
        closeLoading();
} else {
    if(environment.hmr&&!module["hot"]) {
        console.error("HMR is not enabled in environment!");
    }
    bootstrap().then(() => {
        closeLoading();
    });
}
