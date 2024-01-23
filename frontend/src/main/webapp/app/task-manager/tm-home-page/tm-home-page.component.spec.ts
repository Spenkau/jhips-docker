import { ComponentFixture, TestBed } from '@angular/core/testing';

import TmHomePageComponent from './tm-home-page.component';

describe('TaskManagerComponent', () => {
  let component: TmHomePageComponent;
  let fixture: ComponentFixture<TmHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
