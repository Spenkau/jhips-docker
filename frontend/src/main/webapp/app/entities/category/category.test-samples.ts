import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 188,
};

export const sampleWithPartialData: ICategory = {
  id: 14612,
};

export const sampleWithFullData: ICategory = {
  id: 27405,
  name: 'bah',
};

export const sampleWithNewData: NewCategory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
