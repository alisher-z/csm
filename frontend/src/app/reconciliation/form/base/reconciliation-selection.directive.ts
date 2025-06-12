import { Directive, WritableSignal } from "@angular/core";
import { FormUtilsDirective } from "../../../components/utils/form-utils.directive";
import { AbstractControl, FormGroup } from "@angular/forms";

@Directive({
    selector: '[selection]'
})

export class ReconciliationFormSelection extends FormUtilsDirective {
    override form!: FormGroup<any>;
    mainForm!: FormGroup;
    indeterminate!: WritableSignal<boolean>;
    indeterminates!: WritableSignal<boolean[]>;

    select(value: boolean, form: AbstractControl) {
        this.form = form as FormGroup;
        const due = this.getValue('due');

        this.setValue(value ? due : 0, 'received');
    }
    selectAll(value: boolean, forms: FormGroup[]) {
        if (!value) return;

        for (const form of forms) {
            this.form = form;
            this.patchValue({
                include: true,
                received: this.getValue('due')
            })
        }
    }
    setIndeterminates(index: number) {
        this.indeterminates()[index] = true;
    }
    setIndeterminate(form: FormGroup) {
        this.form = form;

        const due = this.getValue('total', 'due');
        const received = this.getValue('total', 'received');

        this.indeterminate.set(received > 0 && received < due ? true : false);
    }
    checkAll(form: FormGroup) {
        this.form = form;
        const received = this.getValue('total', 'received');

        this.setValue(received > 0 ? !this.indeterminate() : false, 'includeAll');
    }


}