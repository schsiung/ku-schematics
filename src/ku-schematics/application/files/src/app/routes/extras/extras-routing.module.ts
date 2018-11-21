import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChangePasswordComponent } from "./changePassword/change-password.component";
import { ExtrasComponent } from "./extras.component";

const routes: Routes = [
    { path: "", component: ExtrasComponent },
    { path: "change", component: ChangePasswordComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExtrasRoutingModule {}
