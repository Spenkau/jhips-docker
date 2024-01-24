import { ITag, NewTag } from './tag.model';

export const sampleWithRequiredData: ITag = {
  id: 28960,
};

export const sampleWithPartialData: ITag = {
  id: 6802,
  name: 'uh-huh given verbally',
};

export const sampleWithFullData: ITag = {
  id: 15181,
  name: 'summer',
};

export const sampleWithNewData: NewTag = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
