import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 13835,
};

export const sampleWithPartialData: ITask = {
  id: 31367,
  content: 'hm',
  statusId: 7069,
  startedAt: dayjs('2024-01-23'),
  finishedAt: dayjs('2024-01-24'),
};

export const sampleWithFullData: ITask = {
  id: 27363,
  title: 'basis',
  content: 'except',
  priorityId: 20018,
  statusId: 25098,
  categoryId: 22771,
  startedAt: dayjs('2024-01-23'),
  finishedAt: dayjs('2024-01-24'),
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
