import { NgModule } from "@angular/core";
import { DebounceClickDirective } from "@shared/directive/debounce-click.directive";
import { AuthControlDirective } from "./auth-control.directive.";

@NgModule({
    providers: [],
    declarations: [DebounceClickDirective, AuthControlDirective],
    exports: [DebounceClickDirective, AuthControlDirective]
})
export class DirectivesModule {}
