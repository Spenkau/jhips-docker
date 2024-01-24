import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 8045,
};

export const sampleWithPartialData: IComment = {
  id: 15571,
  createdAt: dayjs('2024-01-24'),
};

export const sampleWithFullData: IComment = {
  id: 12269,
  content: 'jubilantly industrialise',
  createdAt: dayjs('2024-01-24'),
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
