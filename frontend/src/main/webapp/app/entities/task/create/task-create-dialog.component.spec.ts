import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreateDialogComponent } from './task-create-dialog.component';

describe('CreateComponent', () => {
  let component: TaskCreateDialogComponent;
  let fixture: ComponentFixture<TaskCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
