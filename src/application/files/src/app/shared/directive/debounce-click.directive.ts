import { throttleTime } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import {
    Directive,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    Input,
    OnDestroy
} from "@angular/core";

@Directive({
    selector: "[appDebounceClick]"
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 2000;
    @Output() debounceClick = new EventEmitter();
    private clicks = new Subject<any>();
    private subscription: Subscription;
    constructor() {}

    ngOnInit() {
        this.subscription = this.clicks
            .pipe(throttleTime(2000))
            // .debounceTime(this.debounceTime)
            .subscribe(e => this.debounceClick.emit(e));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    @HostListener("click", ["$event"])
    clickEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(123);
        this.clicks.next(event);
    }
}
