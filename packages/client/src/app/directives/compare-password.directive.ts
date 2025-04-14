import { Directive, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[compare]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ComparePasswordDirective,
      multi: true,
    },
  ],
})
export class ComparePasswordDirective implements Validator {
  @Input('compare') compareTo: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const controlToCompare = control.parent?.get(this.compareTo);
    if (controlToCompare && control.value !== controlToCompare.value) {
      return { compare: true };
    }
    return null;
  }
}
