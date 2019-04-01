import { IProject } from '../project.model';

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
    data: any;
    active: boolean;
    selected: boolean;
}

export interface IPluginData {
    name: string;
    data: any;
}

export interface IProjectState {
    project?: Partial<IProject>;
    selectedRunConfig?: IRunConfiguration;
    runConfigurations: IRunConfiguration[];
    pluginsState: IPluginData[];

    openWallets: {
        [key: string]: string[]
    };
}
