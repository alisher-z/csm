export abstract class MainORM {
    protected abstract insert: string;

    list() {

    }
}

type DBMessageType = { message: string, status: number };
type DBResultType = {
    success: DBMessageType | null,
    status: DBMessageType | null
}

function query(qry: string, params: any) {
    let result: IDBResult;
    try {

    } catch (error) {

    }
}