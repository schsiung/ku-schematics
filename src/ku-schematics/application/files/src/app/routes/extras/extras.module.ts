import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { ExtrasRoutingModule } from "./extras-routing.module";
import { ExtrasComponent } from "./extras.component";
import { ChangePasswordComponent } from "./changePassword/change-password.component";
import { ExtrasService } from "./extras.service";

const COMPONENTS = [ExtrasComponent, ChangePasswordComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, ExtrasRoutingModule],
    declarations: [
        ExtrasComponent,
        ChangePasswordComponent,
        ...COMPONENTS_NOROUNT
    ],
    providers: [ExtrasService],
    entryComponents: COMPONENTS_NOROUNT
})
export class ExtrasModule { }
