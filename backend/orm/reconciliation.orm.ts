import { DBResult, MainORM } from "./main.orm";

export class Reconciliation extends MainORM {
    protected model = 'reconciliation';

    async uncleared(): Promise<DBResult> {
        const result = this.getFunctionQuery('select * from fn_list_uncleared_reconciliation');
        return await (this.attempt(result));
    }
}