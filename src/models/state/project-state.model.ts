import { IProject } from '../project.model';
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
    runConfigurations: IRunConfiguration[];
    pluginsState: IPluginData[];
    hasUpdates: boolean; // updates to be saved

    runConfigurationsFile?: IProjectItem;

    openWallets: {
        [key: string]: string[]
    };
}
