import { Component, OnInit } from '@angular/core';
import {Observable, timer} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {AsyncPipe, DatePipe} from "@angular/common";
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu, 'ru');

@Component({
  selector: 'jhi-clock',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss'
})
export class ClockComponent implements OnInit {
  currentDate = new Date();
  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map(tick => new Date()),
    shareReplay(1)
  );

  ngOnInit(): void {
  }

  get time() {
    return this._time$;
  }
}
