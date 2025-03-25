import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/form/form.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierFormComponent } from './supplier/form/form.component';
import { ProductComponent } from './product/product.component';
import { ProductFormComponent } from './product/form/form.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryFormComponent } from './inventory/form/form.component';
import { SalesReceiptComponent } from './salesreceipt/salesreceipt.component';
import { SalesReceiptFormComponent } from './salesreceipt/form/form.component';
import { HomeComponent } from './home/home.component';

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
    }, {
        path: 'inventory',
        component: InventoryComponent,
        children: [
            {
                path: 'form',
                component: InventoryFormComponent
            }, {
                path: 'form/:id',
                component: InventoryFormComponent
            }
        ]
    }, {
        path: 'sales-receipt',
        component: SalesReceiptComponent,
        children: [
            {
                path: 'form',
                component: SalesReceiptFormComponent
            }, {
                path: 'form/:id',
                component: SalesReceiptFormComponent
            }
        ]
    },
    {
        path: '',
        component: HomeComponent
    }
];
