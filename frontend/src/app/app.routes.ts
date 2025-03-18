import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/form/form.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierFormComponent } from './supplier/form/form.component';
import { ProductComponent } from './product/product.component';
import { ProductFormComponent } from './product/form/form.component';

export const routes: Routes = [
    {
        path: 'customer',
        component: CustomerComponent,
        children: [
            {
                path: 'form',
                component: CustomerFormComponent
            }, {
                path: 'form/:id',
                component: CustomerFormComponent
            }
        ]
    }, {
        path: 'supplier',
        component: SupplierComponent,
        children: [
            {
                path: 'form',
                component: SupplierFormComponent
            }, {
                path: 'form/:id',
                component: SupplierFormComponent
            }
        ]
    }, {
        path: 'product',
        component: ProductComponent,
        children: [
            {
                path: 'form',
                component: ProductFormComponent
            }, {
                path: 'form/:id',
                component: ProductFormComponent
            }
        ]
    }
];
