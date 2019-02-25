import { IProjectItem } from '../project';

export interface IEnvironment {
    name: Nullable<string>;
    endpoint: Nullable<string>;
}

export interface IAccount {
    name: string;
    balance: Nullable<string>;
    address: Nullable<string>;
    type: string;
    isLocked: boolean;
}

export interface IProjectState {
    project?: Partial<IProjectItem>;
    environments: IEnvironment[];
    selectedEnvironment: IEnvironment;
    accounts: IAccount[];
    selectedAccount: IAccount;
    openWallets: {
        [key: string]: string[]
    };
    metamaskAccounts: string[];
    dappfileData: any;
}
