import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/form/form.component';

export const routes: Routes = [
    {
        path: 'customer',
        component: CustomerComponent,
        children: [
            {
                path: 'form',
                component: CustomerFormComponent
            }
        ]
    }
];
