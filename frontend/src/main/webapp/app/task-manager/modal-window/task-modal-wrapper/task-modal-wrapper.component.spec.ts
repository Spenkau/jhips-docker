import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskModalWrapperComponent } from './task-modal-wrapper.component';

describe('TaskModalWrapperComponent', () => {
  let component: TaskModalWrapperComponent;
  let fixture: ComponentFixture<TaskModalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskModalWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
