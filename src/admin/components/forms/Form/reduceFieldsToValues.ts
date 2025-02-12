import { unflatten as flatleyUnflatten } from 'flatley';
import { Fields, Data } from './types';

const reduceFieldsToValues = (fields: Fields, unflatten?: boolean): Data => {
  const data = {};

  Object.keys(fields).forEach((key) => {
    if (!fields[key].disableFormData) {
      if (fields[key].stringify) {
        data[key] = JSON.stringify(fields[key].value);
      } else {
        data[key] = fields[key].value;
      }
    }
  });

  if (unflatten) {
    const unflattened = flatleyUnflatten(data, { safe: true });
    return unflattened;
  }

  return data;
};

export default reduceFieldsToValues;
