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

export interface IRunConfiguration {
    id: string;
    name: string;
    plugin: string;
    pluginData: any;
    data?: any;
    active?: boolean;
}

export interface IProjectState {
    project?: Partial<IProjectItem>;
    selectedRunConfig?: IRunConfiguration;
    runConfigurations: IRunConfiguration[];

    environments: IEnvironment[];
    selectedEnvironment: IEnvironment;
    accounts: IAccount[];
    selectedAccount: IAccount;
    openWallets: {
        [key: string]: string[]
    };
    metamaskAccounts: string[];
}
