import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskPostponeDialogComponent} from './task-postpone-dialog.component';

describe('TaskPostponeDialogComponent', () => {
  let component: TaskPostponeDialogComponent;
  let fixture: ComponentFixture<TaskPostponeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPostponeDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskPostponeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
