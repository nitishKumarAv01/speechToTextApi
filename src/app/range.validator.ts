import { ValidatorFn, AbstractControl } from '@angular/forms';

export interface RangeError {
  range: {
    reason: 'tooLow',
    currentValue: number,
    minValue: number
  } | {
    reason: 'tooHigh',
    currentValue: number,
    maxValue: number
  };
}

/**
 * @returns an error object like {range: {...}} or null if valid
 */
export const rangeValidator = (minValue: number, maxValue: number): ValidatorFn => {

  return (control: AbstractControl): RangeError | null => {
    // If no value, return null (valid)
    if (control.value == null) {
      return null;
    }

    // If value is less than the minimum, return tooLow error
    if (control.value < minValue) {
      return {
        range: {
          reason: 'tooLow',
          currentValue: control.value,
          minValue
        }
      };
    }

    // If value is greater than the maximum, return tooHigh error
    if (control.value > maxValue) {
      return {
        range: {
          reason: 'tooHigh',
          currentValue: control.value,
          maxValue
        }
      };
    }

    // If the value is in range, return null (valid)
    return null;
  };
};
