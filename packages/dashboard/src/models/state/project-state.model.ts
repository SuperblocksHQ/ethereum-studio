import { IProjectItem } from '../project';

export interface IEnvironment {
    name: string;
    endpoint: string;
}

export interface IAccount {
    name: string;
    balance: Nullable<string>;
    address: Nullable<string>;
    type: string;
    walletName: Nullable<string>;
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
    isOwnProject: boolean;
}
