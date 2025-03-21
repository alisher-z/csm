import db from '../db';
import { MainORM } from './main.orm';

export interface ICustomer {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
}

export class Customer extends MainORM {
    protected model: string = 'customer';
}