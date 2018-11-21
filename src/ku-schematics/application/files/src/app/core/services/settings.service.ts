import { Injectable } from "@angular/core";
import { SettingsService } from "@ku/ui";

export interface IApp {
    name: string;
    description: string;
    year: number;
    [key: string]: any;
}

@Injectable()
export class AppSettingService extends SettingsService {
    app: IApp = {
        name: "中证征信基础开发平台",
        description: "中证征信（深圳）有限公司 版权所有",
        year: new Date().getFullYear()
    };

    constructor() {
        super();
    }
}
