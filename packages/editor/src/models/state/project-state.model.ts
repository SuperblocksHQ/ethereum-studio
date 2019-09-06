import { IProjectItem } from '../project';
import { IApiError } from '../';

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
    isProjectLoading: boolean;
    loadProjectError?: IApiError;
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
