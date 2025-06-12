import { Directive } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

@Directive({})
export abstract class FormUtilsDirective {
    abstract form: FormGroup;
    event = false;

    private getFormGroup(label: string[]) {
        let _form = this.form;
        if (label.length <= 0)
            return _form;

        for (const l of label)
            _form = _form.get(l) as FormGroup;

        return _form;
    }
    private getControl(label: string[]) {
        let _form: AbstractControl | null = this.form;

        for (const l of label)
            if (_form)
                _form = _form.get(l);

        return _form;
    }

    patchValue(value: any, ...args: string[]) {
        const form = this.getFormGroup(args);
        if (form)
            form.patchValue(value, { emitEvent: this.event });
    }
    setValue(value: any, ...args: string[]) {
        const control = this.getControl(args);

        if (control)
            control.setValue(value, { emitEvent: this.event });
    }
    patchForm(value: any, form: FormGroup) {
        form.patchValue(value, { emitEvent: this.event });
    }
    setControl(value: any, control: AbstractControl) {
        control.setValue(value, { emitEvent: this.event });
    }
    getValue(...args: string[]) {
        let _form: AbstractControl | null = this.form;
        for (const l of args)
            if (_form)
                _form = _form.get(l);

        return _form?.value;
    }
}