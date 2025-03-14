import db from '../db';

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
}

export async function get() {
    try {
        const result = await db.query('select * from customers');
        return result.rows;
    } catch (error) {
        console.log(error);
        return { error: 'something is wrong!' };
    }
}
export async function insert(data: Customer) {
    try {
        await db.query(`call pr_insert_customer('${JSON.stringify(data)}')`);
        return { success: 'good' };
    } catch (error) {
        console.log(error);
        return { error: 'something is wrong!' };
    }
}