export interface IEnvironment {
    name: Nullable<string>;
    endpoint: Nullable<string>;
}

export interface IProjectState {
    project?: any;
    environments: IEnvironment[];
    selectedEnvironment: IEnvironment;
    selectedAccount: any;
}
