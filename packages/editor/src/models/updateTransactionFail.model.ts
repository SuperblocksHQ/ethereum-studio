import { TransactionType } from './transaction.model';
import { IApiError } from './apiError.model';

export interface IUpdateTransactionFailParams {
    transactionType?: TransactionType;
    hash?: string;
    environment?: string;
    receipt?: any;
    contractName?: string;
    tx?: any;
    contractArgs?: any[];
    functionName?: string;
    error?: IApiError;
}
