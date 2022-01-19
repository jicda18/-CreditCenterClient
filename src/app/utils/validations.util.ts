import { AbstractControl, ValidatorFn } from '@angular/forms';

export abstract class CustomValidations {
  public static fn = (fn: (value?: any) => boolean): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
    if (fn(control.value)) {
      return null;
    }

    return { fn: { value: control.value, error: 'Invalid' } };
  }
}
