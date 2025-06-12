import { Directive, EventEmitter, inject, OnInit, Output, WritableSignal } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { FormUtilsDirective } from "../../../components/utils/form-utils.directive";

@Directive({
    selector: '[total]'
})
export class ReconciliationFormTotal extends FormUtilsDirective {
    @Output() indeterminateE = new EventEmitter<number>();

    override form!: FormGroup;

    changed(value: number) {
        if (value > 0)
            this.setReceivableAmount(this.forms, value);
    }

    setDue() {
        const sum = this.values.reduce(
            (sum, { due }) => sum + +due, 0
        );

        this.setValue(sum, 'total', 'due');
    }

    setReceived() {
        const amount = this.getRecievedAmount();

        this.setValue(amount, 'total', 'received');
    }

    private getRecievedAmount() {
        return this.values.reduce(
            (sum, { received, include }) => include ? sum + +received : sum, 0
        )
    }

    private setReceivableAmount(forms: FormGroup[], amount: number) {
        for (const [index, form] of forms.entries()) {
            const due = form.get('due')!.value;

            this.patchForm({
                include: amount < due ? false : true,
                received: amount <= due ? amount : due
            }, form);

            if (amount < due)
                this.indeterminateE.emit(index);

            if (amount <= due)
                break;

            amount -= due;
        }
    }

    get forms() {
        return (<FormArray>this.form.get('receivables')).controls as FormGroup[];
    }
    get values() {
        return (<FormArray>this.form.get('receivables')).getRawValue() as any[];
    }
}