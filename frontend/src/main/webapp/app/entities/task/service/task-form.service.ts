import {Injectable} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ITask, NewTask} from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id' | 'tags'>;

type TaskFormGroupContent = {
  id: FormControl<ITask['id'] | NewTask['id']>;
  title: FormControl<ITask['title']>;
  content: FormControl<ITask['content']>;
  priorityId: FormControl<ITask['priorityId']>;
  statusId: FormControl<ITask['statusId']>;
  // categoryId: FormControl<ITask['categoryId']>;
  startedAt: FormControl<ITask['startedAt']>;
  finishedAt: FormControl<ITask['finishedAt']>;
  // owner: FormControl<ITask['owner']>;
  category: FormControl<ITask['category']>;
  tags: FormControl<ITask['tags']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({providedIn: 'root'})
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = {id: null}): TaskFormGroup {
    const taskRawValue = {
      ...this.getFormDefaults(),
      ...task,
    };
    return new FormGroup<TaskFormGroupContent>({
      id: new FormControl(
        {value: taskRawValue.id, disabled: true},
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(taskRawValue.title),
      content: new FormControl(taskRawValue.content),
      priorityId: new FormControl(taskRawValue.priorityId),
      statusId: new FormControl(taskRawValue.statusId),
      // categoryId: new FormControl(taskRawValue.categoryId),
      startedAt: new FormControl(taskRawValue.startedAt),
      finishedAt: new FormControl(taskRawValue.finishedAt),
      // owner: new FormControl(taskRawValue.owner),
      category: new FormControl(taskRawValue.category),
      tags: new FormControl(taskRawValue.tags ?? []),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return form.getRawValue() as ITask | NewTask;
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = {...this.getFormDefaults(), ...task};
    form.reset(
      {
        ...taskRawValue,
        id: {value: taskRawValue.id, disabled: true},
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    return {
      id: null,
      tags: [],
    };
  }
}
